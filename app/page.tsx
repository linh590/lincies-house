"use client";

import { useEffect } from "react";
import { courseChapters, totalCoreLessons } from "./courseData";
import { createClient } from "./lib/supabase/client";
import { isSupabaseConfigured } from "./lib/supabase/config";
import ZelleRequestForm from "./ZelleRequestForm";
import "./globals.css";

export default function Page() {
  useEffect(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>(".qa button");
    const handlers: Array<() => void> = [];
    buttons.forEach((btn) => {
      const handler = () => btn.parentElement?.classList.toggle("open");
      btn.addEventListener("click", handler);
      handlers.push(() => btn.removeEventListener("click", handler));
    });
    return () => handlers.forEach((remove) => remove());
  }, []);

  useEffect(() => {
    async function sendLoggedInStudentsToCourse() {
      if (!isSupabaseConfigured) return;
      const supabase = createClient();
      const currentUrl = new URL(window.location.href);
      const code = currentUrl.searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          window.location.replace(`/login?error=callback-failed&message=${encodeURIComponent(error.message)}`);
          return;
        }
        window.history.replaceState({}, document.title, "/");
      }

      if (window.location.hash.includes("access_token")) {
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            window.location.replace(`/login?error=callback-failed&message=${encodeURIComponent(error.message)}`);
            return;
          }
          window.history.replaceState({}, document.title, "/");
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) return;

      const normalizedEmail = session.user.email.trim().toLowerCase();
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .ilike("email", normalizedEmail)
        .eq("status", "active")
        .maybeSingle();

      if (student) {
        window.location.replace("/learn");
      } else {
        window.location.replace("/login?error=not-enrolled");
      }
    }

    sendLoggedInStudentsToCourse();
  }, []);

  return (
    <>
<div className="page">
<nav className="nav"><a className="logo" href="#top" aria-label="Lincies House home"><img className="script-logo" src="/assets/lincies-house-logo-transparent.png" alt="Lincies House logo" /></a><div className="navlinks"><a href="#course">Khóa học</a><a href="/learn">Vào học</a><a href="#about">Về Linh</a><a href="#toolkit">Tài liệu</a><a href="#faq">FAQ</a></div><a className="cta" href="#pricing">Đăng ký học</a></nav>
<header className="hero" id="top"><div><div className="eyebrow"><span className="dot"></span> Khóa học Airbnb thực chiến cho người muốn bắt đầu đúng</div><h1>Biến căn nhà thành Airbnb <span className="highlight">có hệ thống, đẹp mắt và biết bán.</span></h1><p className="lead">Linh hướng dẫn anh chị cách nhìn một căn nhà như một sản phẩm hospitality: chọn mô hình, chuẩn bị nhà, tạo listing, đặt giá, chăm guest, làm việc với cleaner và xử lý vận hành. Không học lan man, học để tự tin launch listing đầu tiên hoặc nâng cấp listing đang có.</p><div className="actions"><a className="btn primary" href="#pricing">Muốn bắt đầu Airbnb bài bản →</a><a className="btn secondary" href="#course">Xem lộ trình học</a></div><div className="stats"><div className="stat"><b>{totalCoreLessons}</b><span>bài học thực chiến</span></div><div className="stat"><b>100%</b><span>Video tiếng Việt + quyền truy cập English</span></div><div className="stat"><b>7+</b><span>năm Superhost liên tục</span></div></div></div><div className="visual"><div className="photo-card"></div><div className="mini"><b>Bonus</b><small>Cập nhật bonus khi Airbnb, công cụ hoặc thị trường có thay đổi quan trọng</small></div><div className="teacher-card"><div className="avatar"></div><h3>Học cùng Linh</h3><p>Linh bắt đầu từ spare rooms trong nhà, rồi mở rộng sang nhiều căn tại LA, Dallas và Florida.</p></div></div></header>
<section className="section"><div className="section-title"><div><div className="kicker">Ai nên học khóa này</div><h2>Nếu muốn làm Airbnb như một mô hình kinh doanh thật sự, đây là nơi bắt đầu.</h2></div><p>Dành cho anh chị đang có nhà, phòng trống, đang tính thuê/mua để làm Airbnb, hoặc đã có listing nhưng muốn vận hành chuyên nghiệp hơn thay vì tự mò từng lỗi.</p></div><div className="audience-grid"><div className="tile"><div className="icon">🏡</div><h3>Mới bắt đầu, chưa biết đi từ đâu</h3><p>Biết Airbnb có thể là cơ hội, nhưng chưa rõ nên chọn mô hình nào, chuẩn bị nhà ra sao và tránh rủi ro gì trước khi xuống tiền.</p></div><div className="tile"><div className="icon">🛏️</div><h3>Có nhà hoặc phòng trống muốn khai thác</h3><p>Muốn biến không gian sẵn có thành một listing nhìn sạch, đáng tin, có rules rõ ràng và đủ tiện nghi để guest muốn book.</p></div><div className="tile"><div className="icon">📈</div><h3>Đã có listing nhưng chưa ổn định</h3><p>Muốn cải thiện hình ảnh, pricing, review, cleaner flow và cách xử lý guest để listing bớt rối và có hệ thống hơn.</p></div><div className="tile"><div className="icon">🤝</div><h3>Muốn học để co-host hoặc hỗ trợ chủ nhà</h3><p>Muốn hiểu cách nhìn property, nói chuyện với owner, setup quy trình và hỗ trợ vận hành như một người làm thật trong ngành hospitality.</p></div></div></section>
<section className="section story" id="about"><div className="story-photo"></div><div className="story-copy"><h2>Không dạy từ sách vở. Linh dạy từ những căn đã tự setup, host và sửa sai.</h2><p>Linh bắt đầu làm Airbnb năm 2019 từ những spare rooms trong chính nhà mình. Sau đó Linh mở rộng sang rented homes, mua và remodel nhà cùng chồng, rồi host/co-host gần 30 listings tại LA, Dallas và Florida.</p><p>Khóa học gom lại những bài học mà host thường phải trả giá mới biết: setup thiếu đồ, ảnh listing chưa hút khách, cleaner làm không đều, pricing sai mùa, guest nhắn liên tục, review thấp vì những chi tiết tưởng nhỏ.</p><div className="story-points"><div className="point"><b>2019</b><span>bắt đầu từ spare rooms</span></div><div className="point"><b>~30</b><span>listings đã host/co-host</span></div><div className="point"><b>3</b><span>thị trường: LA, Dallas, Florida</span></div></div></div></section>
<section className="section" id="course" style={{ scrollMarginTop: "160px" }}><div className="section-title"><div><div className="kicker">Bên trong khóa học</div><h2>Từ ý tưởng Airbnb đến một listing vận hành được ngoài đời thật.</h2></div><p>7 chương chính với {totalCoreLessons} video giúp anh chị hiểu cách chọn mô hình, chuẩn bị nhà, đăng listing, đặt giá, chăm guest và xây quy trình vận hành có thể lặp lại.</p></div><div className="modules"><div className="module"><div className="num">01</div><h3>Airbnb như một mô hình kinh doanh lưu trú</h3><p>Nhìn đúng doanh thu, chi phí, rủi ro, guest experience và trách nhiệm thật sự của một host.</p></div><div className="module"><div className="num">02</div><h3>Chọn mô hình phù hợp</h3><p>So sánh spare room, nhà riêng, rental arbitrage, mua nhà và co-host để biết hướng nào hợp với vốn, thời gian và mức chịu rủi ro.</p></div><div className="module"><div className="num">03</div><h3>Chuẩn bị căn trước khi lên Airbnb</h3><p>Checklist tiện nghi, supplies, safety, house rules, local rules và những chi tiết giúp căn nhìn guest-ready.</p></div><div className="module"><div className="num">04</div><h3>Tạo listing biết bán</h3><p>Cách viết title/description, chọn ảnh, trình bày tiện nghi, đặt expectations để guest thấy tin và muốn book.</p></div><div className="module"><div className="num">05</div><h3>Pricing, calendar và booking strategy</h3><p>Đặt base price, minimum nights, discount, calendar và điều chỉnh theo season, event, demand.</p></div><div className="module"><div className="num">06</div><h3>Vận hành như một host chuyên nghiệp</h3><p>Guest messages, check-in/check-out, cleaner checklist, supplies, handyman và flow xử lý sự cố.</p></div><div className="module"><div className="num">07</div><h3>Review, tối ưu và phát triển dài hạn</h3><p>Đọc review để sửa căn, tối ưu listing theo thời gian, hiểu co-host và xây tư duy vận hành bền hơn.</p></div></div><div className="curriculum-panel"><div className="curriculum-head"><div><div className="kicker">Course Video Library</div><h3>{totalCoreLessons} bài học thực chiến, học theo từng bước</h3></div><span>Học viên đăng nhập để xem video và theo dõi tiến độ</span></div><div className="chapter-list">{courseChapters.map((chapter) => (<div className="chapter-card" key={chapter.chapter}><div className="chapter-top"><div><span>Chương {chapter.chapter}</span><h4>{chapter.title}</h4></div><b>{chapter.lessons.length} video</b></div><ul>{chapter.lessons.map((lesson) => (<li key={lesson.playbackId}><span>{lesson.lesson}</span><strong>{lesson.title}</strong></li>))}</ul></div>))}</div><p className="curriculum-note">Sau khi đăng ký, học viên vào khu học riêng để xem video, theo dõi bài đã học và quay lại khi đang setup căn hoặc xử lý tình huống thực tế.</p></div></section>
<section className="section"><div className="section-title"><div><div className="kicker">Nhà thật, bài học thật</div><h2>Từ ảnh listing đến cleaner checklist: học bằng tình huống của nhà thật.</h2></div><p>Airbnb bán bằng cảm giác tin tưởng. Khóa học chỉ cho anh chị cách nhìn một căn nhà qua mắt guest: ảnh có sáng không, phòng có đủ tiện nghi không, bathroom có sạch không, quy trình sau mỗi checkout có rõ không.</p></div><div className="portfolio"><div className="home-card"><div><b>Không gian sáng, dễ book</b><span>Ảnh listing, tiện nghi và cảm giác tin tưởng</span></div></div><div className="home-card"><div><b>Chi tiết sạch chuẩn khách sạn</b><span>Bathroom, supplies và kỳ vọng của guest</span></div></div><div className="home-card"><div><b>Phòng ngủ ready-to-book</b><span>Setup ngủ nghỉ, checklist và trải nghiệm 5 sao</span></div></div></div></section>
<section className="section" id="pricing"><div className="section-title"><div><div className="kicker">Đăng ký học cùng Linh</div><h2>Chọn cách học phù hợp với mức độ hỗ trợ anh chị muốn có.</h2></div><p>Nếu anh chị muốn tự học, có coaching riêng, hoặc cần Linh đồng hành sâu hơn khi chuẩn bị listing, hãy chọn package phù hợp với mục tiêu hiện tại.</p></div><div className="pricing-grid"><div className="price-card"><div className="eyebrow"><span className="dot"></span> Package 1</div><h3>Tự học bài bản</h3><div className="price">$497</div><div className="list"><div className="li"><div className="check">✓</div>{totalCoreLessons} bài học chính, đi từng bước từ nền tảng đến vận hành</div><div className="li"><div className="check">✓</div>Video tiếng Việt, dễ hiểu, có thể xem lại khi đang setup nhà hoặc xử lý listing</div><div className="li"><div className="check">✓</div>Airbnb toolkit: checklist setup, cleaner flow, guest messages và tài liệu áp dụng ngay</div><div className="li"><div className="check">✓</div>Có Bonus Update Library khi có thay đổi quan trọng/phù hợp về Airbnb, công cụ hoặc cách vận hành</div><div className="li"><div className="check">✓</div>Mua khóa học kế tiếp của Linh được giảm 20%</div></div><form action="/api/checkout" method="post" className="checkout-form"><input type="hidden" name="package" value="course" /><label className="promo-field"><span>Promotion code</span><input name="promoCode" placeholder="Nhập code nếu có" autoComplete="off" /></label><button className="btn primary" type="submit">Mua Package 1 bằng thẻ →</button></form></div><div className="price-card featured"><div className="eyebrow"><span className="dot"></span> Package 2</div><h3>Khóa học + 3 buổi 1:1 với Linh</h3><div className="price">$597</div><div className="promo-note">Phù hợp nếu anh chị đã có căn nhà/listing cụ thể và muốn Linh giúp định hướng rõ hơn.</div><div className="list"><div className="li"><div className="check">✓</div>Bao gồm toàn bộ Package 1, gồm ưu đãi giảm 20% cho khóa học kế tiếp của Linh</div><div className="li"><div className="check">✓</div>Thêm 3 buổi 1:1 coaching với Linh, mỗi buổi 30 phút</div><div className="li"><div className="check">✓</div>Được hỏi theo tình huống property/listing thật của anh chị</div><div className="li"><div className="check">✓</div>Linh góp ý về setup, pricing direction, guest experience và cách vận hành</div></div><form action="/api/checkout" method="post" className="checkout-form"><input type="hidden" name="package" value="coaching" /><label className="promo-field"><span>Promotion code</span><input name="promoCode" placeholder="Nhập code nếu có" autoComplete="off" /></label><button className="btn primary" type="submit">Mua Package 2 bằng thẻ →</button></form></div><div className="price-card premium"><div className="eyebrow"><span className="dot"></span> Package 3</div><h3>Launch cùng Linh</h3><div className="price">$4,999</div><div className="list"><div className="li"><div className="check">✓</div>Từ setup đến listing sẵn sàng nhận booking, có Linh đồng hành sâu trong giai đoạn launch.</div><div className="li"><div className="check">✓</div>Linh hỗ trợ định hướng setup, hình ảnh, nội dung listing và các bước chuẩn bị để căn sẵn sàng launch</div><div className="li"><div className="check">✓</div>Có hỗ trợ vận hành/co-host trong 1 năm theo phạm vi đã nêu trong Điều kiện hỗ trợ Package 3</div><div className="li"><div className="check">✓</div>Được access các khóa online phù hợp của Linh trong tương lai theo quyền lợi Premium</div><div className="li"><div className="check">✓</div>Áp dụng cho tối đa 10 listings hoặc 3 properties của chính học viên, không áp dụng cho bạn bè hoặc họ hàng của học viên</div><div className="li"><div className="check">✓</div>Ongoing Q&A cho các câu hỏi Airbnb quan trọng/phù hợp sau giai đoạn hỗ trợ chính</div></div><form action="/api/checkout" method="post" className="checkout-form"><input type="hidden" name="package" value="premium" /><label className="promo-field"><span>Promotion code</span><input name="promoCode" placeholder="Nhập code nếu có" autoComplete="off" /></label><button className="btn primary" type="submit">Mua Package 3 bằng thẻ →</button></form></div></div><div className="premium-terms"><h3>Điều kiện hỗ trợ Package 3</h3><p><b>Phạm vi áp dụng:</b> Package 3 dành cho các listings/properties do chính học viên sở hữu, thuê, quản lý hoặc trực tiếp vận hành — tối đa 10 listings hoặc 3 properties. Quyền lợi này không áp dụng cho listing của bạn bè, họ hàng, đối tác bên ngoài hoặc người khác nhờ học viên đứng tên hỏi giúp.</p><p><b>Hỗ trợ vận hành/co-host 1 năm:</b> Linh đồng hành định hướng setup, listing, pricing, guest experience, cleaner flow, review improvement và xử lý các tình huống vận hành phổ biến. Gói này không phải dịch vụ trực 24/7, không bao gồm emergency support tức thì, và không có nghĩa Linh chịu trách nhiệm pháp lý/tài chính thay cho học viên.</p><p><b>Lifetime support:</b> Sau 1 năm hỗ trợ vận hành/co-host, học viên vẫn được hỏi đáp lâu dài cho các câu hỏi quan trọng và phù hợp liên quan đến Airbnb/hosting. Linh sẽ cố gắng phản hồi trong vài ngày làm việc tùy lịch và độ phức tạp của câu hỏi.</p><p><b>Trách nhiệm & chi phí:</b> Học viên tự chịu trách nhiệm với quyết định cuối cùng, local rules/permit, tax, insurance, HOA/city compliance, guest dispute, refund/cancellation và các chi phí bên ngoài như cleaner, handyman, furniture, supplies, photographer, software hoặc paid tools. Linh không cam kết booking, doanh thu, lợi nhuận, review hay Superhost status vì kết quả phụ thuộc vào thị trường, property và cách học viên thực hiện.</p><p><b>Các khóa học của Linh:</b> Quyền tham gia miễn phí áp dụng cho các khóa học online do Linh/Lincies House phát hành trong tương lai và phù hợp với quyền lợi Premium; không tự động bao gồm workshop, live event, retreat hoặc dịch vụ 1:1 đặc biệt nếu có thông báo riêng.</p></div><p className="disclaimer"><b>Thanh toán bằng thẻ:</b> Stripe hỗ trợ thẻ credit/debit và Apple Pay khi khách mở bằng iPhone/Safari có Apple Pay. Sau khi thanh toán thành công, tài khoản học sẽ được kích hoạt tự động qua email mua hàng. Nội dung hỗ trợ/coaching sẽ được sắp xếp trực tiếp với Linh sau khi mua.</p><ZelleRequestForm /></section>
<section className="section" id="toolkit"><div className="section-title"><div><div className="kicker">Airbnb toolkit đi kèm</div><h2>Không chỉ nghe lý thuyết. Có checklist để mở ra làm từng bước.</h2></div><p>Toolkit giúp anh chị chuẩn bị căn, giao việc cho cleaner, nhắn guest và kiểm tra lại những phần hay bị quên trước khi listing lên sóng.</p></div><div className="toolkit"><div className="pill-card">Airbnb launch checklist</div><div className="pill-card">Cleaner turnover checklist</div><div className="pill-card">Guest message templates</div><div className="pill-card">Supplies list & operations flow</div></div></section>
<section className="section" id="faq"><div className="section-title"><div><div className="kicker">FAQ</div><h2>Câu hỏi trước khi đăng ký</h2></div><p>Những điều nên hiểu rõ trước khi mua khóa học, để anh chị chọn đúng kỳ vọng và đúng package.</p></div><div className="faq"><div className="qa open"><button>Người mới hoàn toàn có theo được không? <span>+</span></button><p>Có. Khóa học đi từ nền tảng: Airbnb hoạt động ra sao, host cần chuẩn bị gì, guest kỳ vọng gì và từng bước để đưa một listing lên bài bản.</p></div><div className="qa"><button>Chưa có nhà thì học có sớm quá không? <span>+</span></button><p>Không sớm. Học trước giúp anh chị biết nên tìm loại property nào, tính chi phí ra sao, hỏi city/HOA điều gì và tránh xuống tiền khi chưa hiểu mô hình.</p></div><div className="qa"><button>Khóa học có được bổ sung nội dung không? <span>+</span></button><p>Có. Linh có thể bổ sung nội dung khi Airbnb, công cụ, chính sách hoặc tình huống thực tế có điểm quan trọng/phù hợp. Đây không phải cam kết cập nhật mọi thay đổi ngay lập tức.</p></div></div></section>
<footer className="footer"><h2>Sẵn sàng biến ý tưởng Airbnb thành kế hoạch rõ ràng hơn?</h2><p>Học cùng Linh để hiểu mình nên bắt đầu từ đâu, chuẩn bị căn thế nào, bán listing ra sao và vận hành như một host có hệ thống. Không hứa làm giàu nhanh, chỉ tập trung vào kiến thức, quy trình và kinh nghiệm thật.</p><a className="btn primary" style={{background:"#fff",color:"#17231d"}} href="#pricing">Muốn bắt đầu Airbnb bài bản →</a></footer>
</div>
    </>
  );
}
