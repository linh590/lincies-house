import "../globals.css";

const fitList = [
  "Người mới muốn bắt đầu Airbnb nhưng chưa biết làm sao.",
  "Chủ nhà bận rộn, không có thời gian tự quản lý.",
  "Nhà booking chưa ổn định, occupancy thấp hoặc doanh thu chưa như mong muốn.",
  "Listing đang hoạt động chưa hiệu quả và cần nhìn lại setup, hình ảnh, pricing hoặc guest experience.",
  "Nhà nhiều phòng cần chiến lược setup phù hợp.",
  "Chủ nhà ở xa cần người hỗ trợ vận hành có hệ thống.",
];

const whyLinh = [
  "6 năm kinh nghiệm vận hành Airbnb tại Mỹ.",
  "Superhost nhiều năm liên tiếp.",
  "Trực tiếp setup và vận hành nhiều mô hình: entire house, private room rental, share house và hybrid model.",
  "Có kinh nghiệm tăng booking, tối ưu pricing, hạn chế bad review, xử lý guest issues và cải thiện listing chưa hiệu quả.",
  "Không chỉ nói lý thuyết. Linh vẫn vận hành thực tế và hiểu những vấn đề host gặp mỗi ngày.",
];

const serviceBlocks = [
  {
    title: "1. Phân tích property và chiến lược vận hành",
    items: [
      "Đánh giá tiềm năng Airbnb của property.",
      "Phân tích mô hình phù hợp: cho thuê nguyên căn, cho thuê theo phòng, share house hoặc hybrid model.",
      "Định vị nhóm khách mục tiêu như family travel, business travelers, nurses/medical staff, mid-term stay, students hoặc relocation guests.",
      "Đề xuất số lượng giường, occupancy, layout và cách setup phòng ngủ tối ưu hơn.",
      "Đưa ra chiến lược phù hợp theo location, nhu cầu thị trường và loại khách hàng mục tiêu.",
      "Đề xuất thay đổi giúp tăng khả năng booking.",
    ],
  },
  {
    title: "2. Setup và tối ưu listing",
    items: [
      "Setup listing chuyên nghiệp trên Airbnb.",
      "Hỗ trợ setup thêm trên VRBO, Booking.com và Furnished Finder nếu phù hợp.",
      "Viết title chuẩn SEO Airbnb, mô tả listing, selling points và description từng phòng.",
      "Setup amenities, house rules, check-in instructions và guidebook cơ bản.",
      "Tối ưu thumbnail, thứ tự hình ảnh, calendar và giá giữa các nền tảng.",
    ],
  },
  {
    title: "3. Pricing và tối ưu doanh thu",
    items: [
      "Setup chiến lược giá theo mùa.",
      "Điều chỉnh giá theo weekday, weekend, holidays, local events và occupancy trends.",
      "Theo dõi thị trường và đối thủ cạnh tranh.",
      "Setup minimum stay strategy.",
      "Điều chỉnh giá linh hoạt để tối ưu occupancy và doanh thu theo từng giai đoạn thị trường.",
    ],
  },
  {
    title: "4. Quản lý booking và khách hàng",
    items: [
      "Quản lý booking và calendar.",
      "Trả lời khách trước check-in, trong thời gian lưu trú và sau check-out.",
      "Hỗ trợ check-in/check-out và xử lý guest issues.",
      "Hạn chế các tình huống dễ gây bad review.",
      "Review management và sàng lọc booking có dấu hiệu rủi ro.",
      "Hỗ trợ xử lý các vấn đề thường gặp như check-in issue, wifi, hot water/AC, lost item hoặc guest complaints.",
    ],
  },
  {
    title: "5. Vận hành cleaner và property",
    items: [
      "Setup cleaner flow.",
      "Theo dõi lịch cleaning.",
      "Tạo checklist turnover giữa các booking.",
      "Nhắc bổ sung supplies.",
      "Đảm bảo property sẵn sàng trước check-in.",
      "Hỗ trợ xử lý những vấn đề phát sinh liên quan đến cleaner.",
    ],
  },
  {
    title: "6. Tối ưu sau khi launch",
    items: [
      "Theo dõi hiệu suất listing.",
      "Điều chỉnh chiến lược khi thị trường thay đổi.",
      "Tối ưu listing định kỳ.",
      "Đề xuất cải thiện guest experience.",
      "Hỗ trợ giải pháp nếu listing chưa hoạt động như kỳ vọng.",
    ],
  },
];

const setupBlocks = [
  {
    title: "1. Phân tích property và chiến lược ban đầu",
    items: [
      "Đánh giá tiềm năng Airbnb.",
      "Tư vấn mô hình phù hợp: entire house, room rental, share house hoặc hybrid model.",
      "Tư vấn setup giường, occupancy và layout.",
      "Định vị khách hàng mục tiêu.",
      "Đưa ra chiến lược vận hành phù hợp.",
    ],
  },
  {
    title: "2. Chụp hình và tối ưu hình ảnh",
    items: [
      "Chụp toàn bộ không gian property.",
      "Chụp theo góc tối ưu booking.",
      "Hướng dẫn staging căn nhà trước khi chụp.",
      "Chỉnh sửa hình ảnh chuyên nghiệp.",
      "Tối ưu ánh sáng, bố cục, cover photo và thứ tự hình ảnh để tăng conversion.",
    ],
  },
  {
    title: "3. Tạo và setup các nền tảng OTA",
    items: [
      "Tạo và setup listing trên Airbnb, VRBO, Booking.com và Furnished Finder nếu phù hợp.",
      "Tạo tài khoản OTA nếu chủ nhà chưa có.",
      "Setup payout method cơ bản, availability calendar, pricing structure, cleaning fee và extra guest fee.",
      "Setup cancellation policy, house rules, guest requirements và check-in/check-out settings.",
      "Đồng bộ lịch giữa các nền tảng.",
    ],
  },
  {
    title: "4. Viết nội dung listing",
    items: [
      "Viết title chuẩn SEO Airbnb.",
      "Viết mô tả property chuyên nghiệp.",
      "Viết selling points nổi bật.",
      "Setup description từng phòng và amenities description.",
      "Tối ưu keyword tăng hiển thị.",
      "Setup guidebook cơ bản.",
    ],
  },
  {
    title: "5. Setup hệ thống vận hành",
    items: [
      "Setup self check-in flow, smart lock instructions và wifi instructions.",
      "Tạo template nhắn khách: booking confirmation, pre check-in, check-in instruction, during stay support, checkout instruction và review request.",
      "Setup cleaner flow cơ bản.",
      "Tạo checklist turnover.",
      "Hướng dẫn chuẩn bị supplies cơ bản.",
    ],
  },
  {
    title: "6. Hỗ trợ launch listing",
    items: [
      "Kiểm tra listing trước khi publish.",
      "Kiểm tra hình ảnh và nội dung cuối.",
      "Hỗ trợ launch listing.",
      "Theo dõi giai đoạn khởi động ban đầu.",
    ],
  },
];

function BulletPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="cohost-detail-panel">
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

export default function CoHostPage() {
  return (
    <main className="page cohost-detail-page">
      <nav className="nav">
        <a className="logo" href="/#top" aria-label="Lincies House home"><img className="script-logo" src="/assets/lincies-house-logo-transparent.png" alt="Lincies House logo" /></a>
        <div className="navlinks"><a href="/#course">Chương trình học</a><a href="/#pricing">Học cùng Linh</a><a href="/cohost">Co-host</a><a href="/#faq">Giải đáp</a></div>
        <div className="nav-actions"><a className="login-cta" href="/login">Login</a><a className="cta" href="/#consultation-form">Gửi thông tin tư vấn</a></div>
      </nav>

      <section className="section cohost-section cohost-detail-hero">
        <div className="cohost-detail-hero-grid">
          <div className="cohost-detail-hero-copy">
            <div className="cohost-label">Dịch vụ Co-host Airbnb cùng Linh</div>
            <h1>Biến căn nhà của anh/chị thành Airbnb có chiến lược.</h1>
            <p className="cohost-subtitle-line">Không chỉ đơn giản là đăng listing rồi chờ khách đặt phòng.</p>
            <div className="cohost-hero-copy">
              <p>Anh/chị có nhà nhưng chưa biết bắt đầu Airbnb từ đâu?</p>
              <p>Hoặc đã làm Airbnb nhưng booking chưa đều, giá phòng chưa tối ưu, occupancy thấp, không có thời gian quản lý hoặc listing chưa hoạt động hiệu quả như mong muốn?</p>
              <p>Airbnb cần chiến lược setup đúng ngay từ đầu, pricing hợp lý, guest experience tốt và tối ưu liên tục theo thị trường. Với 6 năm kinh nghiệm Superhost và trực tiếp vận hành nhiều mô hình Airbnb tại Mỹ, Linh hỗ trợ chủ nhà setup và vận hành theo hướng thực tế, tối ưu và có hệ thống hơn.</p>
            </div>
            <div className="cohost-actions">
              <a className="btn primary" href="/#consultation-form">Gửi thông tin để Linh tư vấn →</a>
              <a className="btn secondary" href="/#pricing">Xem khóa học Airbnb</a>
            </div>
          </div>
          <div className="cohost-detail-hero-photo" aria-hidden="true" />
        </div>
      </section>

      <section className="section cohost-detail-section">
        <div className="section-title compact-title"><div><div className="kicker">Vì sao chọn Linh?</div><h2>Kinh nghiệm thực tế từ vận hành hằng ngày.</h2></div></div>
        <div className="cohost-detail-grid two-cols">
          <BulletPanel title="Linh có kinh nghiệm gì?" items={whyLinh} />
          <BulletPanel title="Dịch vụ này phù hợp với" items={fitList} />
        </div>
      </section>

      <section className="section cohost-detail-section">
        <div className="section-title compact-title"><div><div className="kicker">Phạm vi đồng hành</div><h2>Linh sẽ đồng hành cùng anh/chị như thế nào?</h2></div></div>
        <div className="cohost-detail-grid">{serviceBlocks.map((block) => <BulletPanel key={block.title} {...block} />)}</div>
      </section>

      <section className="section cohost-detail-section" id="cohost-packages">
        <div className="section-title compact-title"><div><div className="kicker">Gói Co-host</div><h2>Chọn mức hỗ trợ phù hợp với property và khu vực.</h2></div></div>
        <div className="cohost-package-grid">
          <div className="cohost-package-card">
            <div className="eyebrow"><span className="dot"></span> Gói 1</div>
            <h3>Co-host từ xa</h3>
            <div className="cohost-price">10% doanh thu booking</div>
            <p>Dành cho nhà ngoài khu vực Los Angeles.</p>
            <ul>
              <li>Phù hợp với nhà đã có cleaner.</li>
              <li>Có smart lock.</li>
              <li>Property đã sẵn sàng vận hành.</li>
              <li>Có người hỗ trợ onsite khi cần.</li>
              <li>Bao gồm booking, guest communication, pricing, listing optimization và calendar management.</li>
            </ul>
          </div>
          <div className="cohost-package-card featured">
            <div className="eyebrow"><span className="dot"></span> Gói 2</div>
            <h3>Co-host trực tiếp</h3>
            <div className="cohost-price">15% doanh thu booking</div>
            <p>Dành cho khu vực Los Angeles / Orange County.</p>
            <ul>
              <li>Bao gồm toàn bộ dịch vụ co-host từ xa.</li>
              <li>Hỗ trợ vận hành thực tế nhiều hơn khi cần.</li>
              <li>Phù hợp với chủ nhà muốn Linh theo sát hơn trong khu vực gần.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section cohost-detail-section">
        <div className="cohost-setup-card detail-setup-card">
          <div>
            <div className="kicker">One-time setup fee</div>
            <h2>Phí setup ban đầu: $700</h2>
            <p>Phí setup được tính một lần duy nhất để chuẩn bị property sẵn sàng vận hành Airbnb và các nền tảng OTA khác một cách chuyên nghiệp.</p>
          </div>
        </div>
        <div className="cohost-detail-grid setup-detail-grid">{setupBlocks.map((block) => <BulletPanel key={block.title} {...block} />)}</div>
      </section>

      <section className="section cohost-detail-section">
        <div className="cohost-terms-card detail-terms-card">
          <h2>Thời gian hợp tác và lưu ý</h2>
          <p><b>Thời gian hợp tác tối thiểu: 12 tháng.</b> Airbnb thường cần thời gian để build review, tối ưu occupancy và ổn định hiệu suất vận hành, nên Linh ưu tiên hợp tác tối thiểu 12 tháng để có đủ thời gian tối ưu property.</p>
          <p>Chủ nhà chịu chi phí cleaning, repairs, utilities, supplies và platform fees. Cohost không chịu trách nhiệm chi phí sửa chữa hoặc damages của property.</p>
          <p>Kết quả phụ thuộc vào location, seasonality, tình trạng property và nhu cầu thị trường. Mỗi property sẽ được đánh giá riêng để đưa ra chiến lược vận hành phù hợp.</p>
          <div className="cohost-actions"><a className="btn primary" href="/#consultation-form">Gửi thông tin để Linh gọi lại →</a></div>
        </div>
      </section>
    </main>
  );
}
