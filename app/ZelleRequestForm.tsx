"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ZelleRequestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/zelle/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        phone: formData.get("phone"),
        zelleName: formData.get("zelleName"),
        note: formData.get("note"),
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setMessage(result.error ?? "Không gửi được thông tin Zelle. Chị thử lại hoặc nhắn Linh trực tiếp nha.");
      return;
    }

    form.reset();
    setStatus("success");
    setMessage(
      result.emailWarning
        ? "Đã nhận thông tin Zelle. Email xác nhận đang tạm lỗi nhưng Linh vẫn đã nhận request và sẽ đối chiếu giao dịch để kích hoạt quyền học."
        : "Đã nhận thông tin Zelle và đã gửi email xác nhận. Linh sẽ đối chiếu giao dịch và kích hoạt quyền học cho email này sau khi thấy tiền vào tài khoản.",
    );
  }

  return (
    <div className="zelle-box zelle-split-box">
      <div className="zelle-content">
        <div className="lesson-kicker">Zelle payment</div>
        <h3>Thanh toán qua Zelle</h3>
        <p>
          Nếu muốn thanh toán qua Zelle thay vì thẻ, gửi đúng số tiền package đến <b>626-456-1150</b>. Sau khi gửi, điền email và số điện thoại bên dưới để Linh đối chiếu giao dịch rồi kích hoạt quyền học.
        </p>
        <form className="zelle-form" onSubmit={handleSubmit}>
        <label>
          Email muốn dùng để học
          <input type="email" name="email" placeholder="student@email.com" required />
        </label>
        <label>
          Số điện thoại
          <input type="tel" name="phone" placeholder="626-456-1150" required />
        </label>
        <label>
          Tên người gửi Zelle
          <input name="zelleName" placeholder="Tên hiện trong Zelle/ngân hàng" required />
        </label>
        <label>
          Ghi chú, giờ gửi hoặc confirmation nếu có
          <textarea name="note" placeholder="Ví dụ: gửi lúc 2:15 PM, tên account..." rows={3} />
        </label>
        <button className="complete-button" disabled={status === "loading"} type="submit">
          {status === "loading" ? "Đang gửi..." : "Đã gửi Zelle — gửi thông tin cho Linh"}
        </button>
        </form>
        {message ? <p className={`auth-message ${status === "success" ? "sent" : "error"}`}>{message}</p> : null}
      </div>
      <div className="zelle-photo" aria-hidden="true" />
    </div>
  );
}
