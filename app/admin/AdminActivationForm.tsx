"use client";

import { useEffect, useMemo, useState } from "react";

type ZelleRequest = {
  id: number;
  email: string;
  phone?: string | null;
  zelle_name?: string | null;
  note?: string | null;
  status?: string | null;
  created_at?: string | null;
  approved_at?: string | null;
};

type StripePurchase = {
  id: string;
  email: string;
  phone?: string | null;
  name?: string | null;
  status?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  package_key?: string | null;
  package_name?: string | null;
  promo_code?: string | null;
  created_at?: string | null;
};

type Status = "idle" | "loading" | "success" | "error";

export default function AdminActivationForm() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requestId, setRequestId] = useState("");
  const [sendLoginEmail, setSendLoginEmail] = useState(true);
  const [requests, setRequests] = useState<ZelleRequest[]>([]);
  const [stripePurchases, setStripePurchases] = useState<StripePurchase[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [loadingRequests, setLoadingRequests] = useState(false);

  const zelleRequests = useMemo(() => requests, [requests]);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("lincies-admin-token") ?? "";
    setToken(savedToken);
  }, []);

  function saveToken(value: string) {
    setToken(value);
    window.localStorage.setItem("lincies-admin-token", value);
  }

  async function loadRequests() {
    if (!token.trim()) {
      setStatus("error");
      setMessage("Nhập admin password trước rồi bấm tải danh sách nha chị.");
      return;
    }

    setLoadingRequests(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/activate-student", {
        method: "GET",
        headers: { "x-admin-token": token.trim() },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? "Không tải được danh sách thanh toán.");
      setRequests(result.requests ?? []);
      setStripePurchases(result.stripePurchases ?? []);
      setStatus("idle");
      const zelleCount = result.requests?.length ?? 0;
      const stripeCount = result.stripePurchases?.length ?? 0;
      setMessage(zelleCount || stripeCount ? `Đã tải ${stripeCount} thanh toán thẻ và ${zelleCount} request Zelle/tư vấn gần đây.` : "Chưa có thanh toán/request nào.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Không tải được danh sách Zelle.");
    } finally {
      setLoadingRequests(false);
    }
  }

  function fillFromRequest(request: ZelleRequest) {
    setEmail(request.email ?? "");
    setPhone(request.phone ?? "");
    setRequestId(String(request.id));
    setSendLoginEmail(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function isConsultation(request: ZelleRequest) {
    return String(request.status ?? "").startsWith("consultation");
  }

  function isApproved(request: ZelleRequest) {
    return String(request.status ?? "").toLowerCase() === "approved";
  }

  function formatMoney(cents?: number | null, currency?: string | null) {
    if (typeof cents !== "number" || !currency) return "";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token.trim()) {
      setStatus("error");
      setMessage("Nhập admin password trước nha chị.");
      return;
    }

    setStatus("loading");
    setMessage("Đang kích hoạt học viên...");

    try {
      const response = await fetch("/api/admin/activate-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token.trim(),
        },
        body: JSON.stringify({
          email,
          phone,
          requestId: requestId ? Number(requestId) : null,
          sendLoginEmail,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? "Không active được học viên.");

      setStatus("success");
      setMessage(
        result.emailSent
          ? `Đã active ${result.email} và gửi email đăng nhập/OTP.`
          : `Đã active ${result.email}. Chưa gửi email đăng nhập.`,
      );
      setEmail("");
      setPhone("");
      setRequestId("");
      await loadRequests();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Không active được học viên.");
    }
  }

  return (
    <section className="admin-shell">
      <div className="admin-header">
        <div>
          <div className="lesson-kicker">Lincies House Admin</div>
          <h1>Admin Lincies House</h1>
          <p>Chị có thể xem request Zelle và thông tin khách gửi để tư vấn Premium/Co-host. Với Zelle, kiểm tra tiền trước rồi mới kích hoạt quyền học.</p>
        </div>
        <a className="back-home" href="/">← Về website</a>
      </div>

      <form className="admin-card" onSubmit={handleSubmit}>
        <label>
          Admin password
          <input type="password" value={token} onChange={(event) => saveToken(event.target.value)} placeholder="Password riêng của chị" required />
        </label>

        <div className="admin-grid-two">
          <label>
            Email học viên
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@email.com" required />
          </label>
          <label>
            Phone nếu có
            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Số điện thoại" />
          </label>
        </div>

        <label>
          Zelle request ID nếu approve từ form
          <input inputMode="numeric" value={requestId} onChange={(event) => setRequestId(event.target.value)} placeholder="Có thể để trống" />
        </label>

        <label className="admin-checkbox">
          <input type="checkbox" checked={sendLoginEmail} onChange={(event) => setSendLoginEmail(event.target.checked)} />
          <span>Gửi email đăng nhập/OTP ngay cho học viên</span>
        </label>

        <button className="complete-button" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Đang active..." : "Kích hoạt học viên"}
        </button>

        {message ? <p className={`auth-message ${status === "success" ? "sent" : status === "error" ? "error" : "sent"}`}>{message}</p> : null}
      </form>

      <div className="admin-card">
        <div className="admin-list-head">
          <div>
            <h2>Thanh toán bằng thẻ gần đây</h2>
            <p>Danh sách này lấy từ Stripe. Khách thanh toán thành công sẽ được web tự động active quyền học.</p>
          </div>
          <button className="complete-button secondary-action" type="button" onClick={loadRequests} disabled={loadingRequests}>
            {loadingRequests ? "Đang tải..." : "Tải danh sách"}
          </button>
        </div>

        <div className="admin-request-list">
          {stripePurchases.length ? (
            stripePurchases.map((purchase) => (
              <article className="admin-request" key={purchase.id}>
                <div>
                  <strong>{purchase.name ? `${purchase.name} · ` : ""}{purchase.email || "Không có email"}</strong>
                  <span>{purchase.phone || "Không có phone"} · {formatMoney(purchase.amount_total, purchase.currency)} · {purchase.status || "paid"}</span>
                  <p>{purchase.package_name || purchase.package_key || "Khóa học Airbnb Lincies House"}{purchase.promo_code ? ` · Promo: ${purchase.promo_code}` : ""}</p>
                  <small>{purchase.created_at ? new Date(purchase.created_at).toLocaleString() : ""} · Stripe ID: {purchase.id}</small>
                </div>
              </article>
            ))
          ) : (
            <p className="admin-empty">Bấm “Tải danh sách” để xem khách thanh toán bằng thẻ gần đây.</p>
          )}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-list-head">
          <div>
            <h2>Thanh toán Zelle & request tư vấn gần đây</h2>
            <p>Zelle sẽ hiện cả pending và approved. Chị chỉ bấm approve sau khi đã thấy tiền vào tài khoản.</p>
          </div>
        </div>

        <div className="admin-request-list">
          {zelleRequests.length ? (
            zelleRequests.map((request) => (
              <article className="admin-request" key={request.id}>
                <div>
                  <strong>{request.zelle_name ? `${request.zelle_name} · ` : ""}{request.email}</strong>
                  <span>{request.phone || "Không có phone"} · {request.status || "pending"} · ID #{request.id}</span>
                  {request.note ? <p>{request.note}</p> : null}
                  <small>{request.created_at ? new Date(request.created_at).toLocaleString() : ""}{request.approved_at ? ` · Approved: ${new Date(request.approved_at).toLocaleString()}` : ""}</small>
                </div>
                {isConsultation(request) || isApproved(request) ? null : (
                  <button className="complete-button" type="button" onClick={() => fillFromRequest(request)}>
                    Chọn approve
                  </button>
                )}
              </article>
            ))
          ) : (
            <p className="admin-empty">Bấm “Tải danh sách” để xem request Zelle hoặc tư vấn mới.</p>
          )}
        </div>
      </div>
    </section>
  );
}
