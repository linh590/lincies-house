import FAQContent from "../FAQContent";
import "../globals.css";

export const metadata = {
  title: "FAQ | Lincies House",
  description: "Câu hỏi thường gặp về khóa học Airbnb Thực Chiến Tại Mỹ của Lincies House.",
};

export default function FAQPage() {
  return (
    <div className="page">
      <nav className="nav"><a className="logo" href="/" aria-label="Lincies House home"><img className="script-logo" src="/assets/lincies-house-logo-transparent.png" alt="Lincies House logo" /></a><div className="navlinks"><a href="/#course">Course Program</a><a href="/#pricing">Learn with Linh</a><a href="/cohost">Co-host</a><a href="/#about">Linh’s Story</a><a href="/#pricing">Course Materials</a><a href="/faq">FAQ</a><a href="/#contact">Contact</a></div><div className="nav-actions"><a className="login-cta" href="/login">Login</a><a className="cta" href="/#pricing">Join the Course</a></div></nav>
      <FAQContent />
      <footer className="footer"><h2>Sẵn sàng bắt đầu Airbnb bài bản và tự tin hơn?</h2><div className="footer-note-frame">Học cách setup, vận hành và phát triển Airbnb một cách rõ ràng hơn, tránh những sai lầm tốn thời gian và tiền bạc từ kinh nghiệm thực tế tại Mỹ.</div><a className="btn primary" style={{background:"#fff",color:"#17231d"}} href="/#pricing">Xem khóa học Airbnb →</a></footer>
    </div>
  );
}
