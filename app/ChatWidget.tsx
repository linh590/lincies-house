"use client";

import { FormEvent, useState } from "react";

type ChatStatus = "idle" | "sending" | "sent" | "error";

export default function ChatWidget() {
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Tin nhắn chưa gửi được. Anh/chị thử lại giúp Linh nha.");
      }

      form.reset();
      setStatus("sent");
      setMessage("Em đã gửi tin nhắn cho Linh. Linh sẽ trả lời anh/chị sớm nhất có thể nha.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Tin nhắn chưa gửi được. Anh/chị thử lại giúp Linh nha.");
    }
  }

  return (
    <aside className="live-chat-widget" aria-label="Chat with Lincies House">
      <div className="live-chat-head">
        <span className="chat-status-dot"></span>
        <b>Can I help you?</b>
      </div>
      <p>Hi, I’m Linh. Anh/chị nhắn trực tiếp tại đây, Linh sẽ nhận được tin và trả lời lại sớm nhất có thể.</p>
      <form className="live-chat-form" onSubmit={handleSubmit}>
        <label>
          <span>Tên của anh/chị</span>
          <input name="name" placeholder="Tên của anh/chị" autoComplete="name" required />
        </label>
        <label>
          <span>Email hoặc số điện thoại</span>
          <input name="contact" placeholder="Email / phone" autoComplete="email" required />
        </label>
        <label>
          <span>Tin nhắn</span>
          <textarea name="message" placeholder="Anh/chị cần hỏi gì về khóa học Airbnb hoặc co-host?" rows={3} required />
        </label>
        <input className="chat-bot-field" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button className="live-chat-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Đang gửi..." : "Gửi tin nhắn cho Linh →"}
        </button>
        {message && <div className={`live-chat-message ${status === "sent" ? "success" : "error"}`}>{message}</div>}
      </form>
    </aside>
  );
}
