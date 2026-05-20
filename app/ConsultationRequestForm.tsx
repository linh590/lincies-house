"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ConsultationRequestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/consultation/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packageType: formData.get("packageType"),
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        note: formData.get("note"),
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setMessage(result.error ?? "Không gửi được thông tin tư vấn. Anh/chị thử lại hoặc nhắn Linh trực tiếp nha.");
      return;
    }

    form.reset();
    setStatus("success");
    setMessage("Đã nhận thông tin. Linh sẽ xem qua và gọi lại để tư vấn gói phù hợp cho anh/chị.");
  }

  return (
    <div className="consultation-box" id="consultation-form">
      <div className="consultation-photo" aria-hidden="true" />
      <div className="consultation-content">
        <div>
          <div className="kicker">Tư vấn Premium & Co-host</div>
          <h3>Muốn Linh tư vấn trước? Điền thông tin ngắn bên dưới.</h3>
          <p>
            Gói Premium và Co-host cần nói chuyện trước để Linh hiểu tình trạng property/listing và tư vấn hướng phù hợp. Form này chỉ hỏi thông tin cơ bản, sau đó Linh sẽ gọi lại.
          </p>
        </div>

        <div className="consultation-options">
        <div className="consultation-option">
          <b>Premium Launch Support</b>
          <span>Phù hợp khi anh/chị muốn Linh đồng hành sâu hơn từ setup, launch đến vận hành ban đầu.</span>
        </div>
        <div className="consultation-option">
          <b>Co-host Support</b>
          <span>Phù hợp khi anh/chị muốn trao đổi khả năng Linh hỗ trợ/co-host hoặc định hướng vận hành listing.</span>
        </div>
      </div>

      <form className="consultation-form" onSubmit={handleSubmit}>
        <label>
          Anh/chị quan tâm gói nào?
          <select name="packageType" defaultValue="premium" required>
            <option value="premium">Premium Launch Support</option>
            <option value="cohost">Co-host Support</option>
            <option value="not-sure">Chưa chắc, muốn Linh tư vấn</option>
          </select>
        </label>
        <div className="consultation-grid-two">
          <label>
            Họ tên
            <input name="name" placeholder="Tên của anh/chị" required />
          </label>
          <label>
            Số điện thoại
            <input type="tel" name="phone" placeholder="Số để Linh gọi lại" required />
          </label>
        </div>
        <label>
          Email
          <input type="email" name="email" placeholder="email@example.com" required />
        </label>
        <label>
          Ghi chú ngắn nếu có
          <textarea name="note" placeholder="Ví dụ: em/chị đã có nhà ở Dallas, muốn setup Airbnb..." rows={3} />
        </label>
        <button className="btn primary" disabled={status === "loading"} type="submit">
          {status === "loading" ? "Đang gửi..." : "Gửi thông tin để Linh gọi lại →"}
        </button>
      </form>
        {message ? <p className={`auth-message ${status === "success" ? "sent" : "error"}`}>{message}</p> : null}
      </div>
    </div>
  );
}
