// ============================================================
// AIRBNB HOST BOT TEMPLATE — by Lincies
// Hướng dẫn: Điền thông tin nhà bạn vào phần bên dưới
// Không cần biết code — chỉ cần thay chữ!
// ============================================================

const SYSTEM_PROMPT = `You are a friendly Airbnb host assistant.
Your job: reply with a SHORT, FRIENDLY English message ready to copy-paste to the Airbnb guest.

Rules:
- Write ONLY the message to send to the guest (no explanation, no prefix)
- Tone: warm, professional, like a good Airbnb host
- Keep it concise — 2-4 sentences max
- Always end with something friendly like "Let me know if you need anything!" or similar

=== THÔNG TIN NHÀ CỦA BẠN ===
(Xóa phần ví dụ và điền thông tin nhà bạn vào đây)

──────────────────────────────
TÊN NHÀ — Địa chỉ đầy đủ
──────────────────────────────
- Check-in: [GIỜ CHECK-IN] | Checkout: [GIỜ CHECKOUT]
- WiFi name: [TÊN WIFI] | WiFi password: [MẬT KHẨU WIFI]
- Door code: [MÃ CỬA]
- Parking: [HƯỚNG DẪN ĐỖ XE]
- [Thêm thông tin khác...]

=== CÂU HỎI THƯỜNG GẶP ===
- How to get in: "You can find the detailed instructions on the app to know how to check in!"
- Early check-in: "The room is being prepared. If it's ready early, we'll let you know!"
- Late check-in: "No problem! You can find the check-in instructions on the app anytime."
- Late checkout: "You're welcome to check out at 12PM. Let me know if you need anything!"
- Long-term stay: "Yes, long-term stay is available! Please send me your full name and email. Thank you!"`;

// ============================================================
// KHÔNG CẦN CHỈNH SỬA PHẦN BÊN DƯỚI
// ============================================================

const chatHistory = new Map();

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Airbnb Host Bot is running! 🏠', { status: 200 });
    }

    try {
      const update = await request.json();
      const message = update?.message;
      if (!message?.text) return new Response('ok');

      const chatId = message.chat.id;
      const userText = message.text;
      const firstName = message.from?.first_name || 'bạn';

      if (userText === '/start') {
        chatHistory.delete(chatId);
        await sendTelegram(env.TELEGRAM_TOKEN, chatId,
          `Xin chào ${firstName}! 👋\n\nEm là bot hỗ trợ Airbnb host.\n\n` +
          `📌 Cách dùng:\nNhắn câu hỏi của guest (tiếng Việt hoặc Anh), em soạn tin tiếng Anh để copy gửi lại.\n\n` +
          `Ví dụ:\n"guest hỏi wifi"\n"guest muốn check in sớm"\n"guest hỏi mã cửa"\n\nThử đi! 🏠`
        );
        return new Response('ok');
      }

      if (!chatHistory.has(chatId)) chatHistory.set(chatId, []);
      const history = chatHistory.get(chatId);

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: `Host hỏi: "${userText}"\n\nSoạn tin tiếng Anh để gửi cho guest.` }
      ];

      const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages,
        max_tokens: 300
      });

      const reply = aiResponse?.response?.trim() ||
        "Hi! Thank you for reaching out. We'll get back to you shortly. 😊";

      history.push({ role: 'user', content: `Host hỏi: "${userText}"` });
      history.push({ role: 'assistant', content: reply });
      if (history.length > 20) history.splice(0, 2);

      await sendTelegram(env.TELEGRAM_TOKEN, chatId, `📋 Copy & paste for guest:\n\n${reply}`);

      return new Response('ok');
    } catch (err) {
      console.error(err);
      return new Response('error', { status: 500 });
    }
  }
};

async function sendTelegram(token, chatId, text) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}
