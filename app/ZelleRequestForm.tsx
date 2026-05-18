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
    setMessage("Đã nhận thông tin Zelle. Linh sẽ check bank và kích hoạt quyền học cho email này sau khi thấy tiền vào tài khoản.");
  }

  return (
    <div className="zelle-box">
      <div className="lesson-kicker">Zelle payment</div>
      <h3>Trả qua Zelle</h3>
      <p>
        Gửi <b>$10</b> đến <b>626-456-1150</b>. Sau khi gửi, điền email và phone bên dưới để Linh đối chiếu trong bank rồi kích hoạt quyền học.
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
          <input name="zelleName" placeholder="Tên hiện trong Zelle/bank" required />
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
  );
}
