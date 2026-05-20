"use client";

const serviceHighlights = [
  "Đánh giá tiềm năng property và chọn mô hình phù hợp: nguyên căn, thuê theo phòng, share house hoặc hybrid.",
  "Setup listing chuyên nghiệp trên Airbnb, VRBO, Booking.com và Furnished Finder khi phù hợp.",
  "Viết title, mô tả, selling points, amenities, house rules, check-in instructions và guidebook cơ bản.",
  "Tối ưu pricing theo mùa, weekday, weekend, holiday, local events và occupancy trends.",
  "Quản lý booking, calendar, guest communication, review và những tình huống phát sinh trong thời gian khách ở.",
  "Setup cleaner flow, checklist turnover, supplies và theo dõi để căn nhà sẵn sàng trước check-in.",
];

const setupIncludes = [
  "Phân tích property, tư vấn layout, số giường, occupancy và nhóm khách mục tiêu.",
  "Chụp hình, chỉnh sửa hình ảnh, chọn cover photo và sắp xếp thứ tự ảnh để tăng conversion.",
  "Tạo và setup listing trên các nền tảng OTA cần thiết, bao gồm payout, calendar, fees, policy và house rules.",
  "Viết toàn bộ nội dung listing, keyword, mô tả từng phòng, amenities và guidebook cơ bản.",
  "Tạo template nhắn khách, self check-in flow, smart lock/wifi instructions và cleaner checklist.",
  "Kiểm tra listing trước khi publish và theo dõi giai đoạn launch ban đầu.",
];

const fitList = [
  "Chủ nhà mới muốn bắt đầu Airbnb nhưng chưa biết làm từ đâu.",
  "Chủ nhà bận rộn, không có thời gian tự quản lý booking và guest.",
  "Listing đang ít booking, occupancy thấp hoặc doanh thu chưa như mong muốn.",
  "Nhà nhiều phòng cần chiến lược setup và vận hành phù hợp hơn.",
  "Chủ nhà ở xa cần người hỗ trợ vận hành có hệ thống.",
];

export default function CoHostServiceSection() {
  return (
    <section className="section cohost-section" id="cohost">
      <div className="cohost-hero">
        <div>
          <div className="kicker">Dịch vụ Co-host Airbnb cùng Linh</div>
          <h2>Biến căn nhà của anh/chị thành Airbnb có chiến lược, không chỉ là đăng listing.</h2>
          <p>
            Nếu anh/chị có nhà nhưng chưa biết bắt đầu Airbnb từ đâu, hoặc đã có listing nhưng booking chưa đều, giá phòng chưa tối ưu, occupancy thấp hay không có thời gian quản lý, Linh có thể đồng hành từ bước phân tích property, setup listing đến vận hành thực tế.
          </p>
          <p>
            Với hơn 6 năm kinh nghiệm Superhost và trực tiếp vận hành nhiều mô hình Airbnb tại Mỹ, Linh hỗ trợ chủ nhà setup và vận hành theo hướng thực tế, tối ưu và có hệ thống hơn.
          </p>
          <div className="cohost-actions">
            <a className="btn primary" href="#consultation-form">Gửi thông tin để Linh tư vấn →</a>
            <a className="btn secondary" href="#cohost-packages">Xem gói co-host</a>
          </div>
        </div>
        <div className="cohost-proof-card">
          <b>Phù hợp khi anh/chị cần người có kinh nghiệm thật để nhìn property như một mô hình vận hành.</b>
          <span>Setup đúng từ đầu, tối ưu listing, pricing, guest experience, cleaner flow và theo dõi hiệu suất sau launch.</span>
        </div>
      </div>

      <div className="cohost-grid cohost-fit-grid">
        <div className="cohost-panel">
          <h3>Dịch vụ này phù hợp với</h3>
          <ul>{fitList.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="cohost-panel cohost-note-panel">
          <h3>Vì sao nhiều chủ nhà chọn đồng hành cùng Linh?</h3>
          <p>
            Linh không tư vấn theo lý thuyết chung chung. Mỗi property sẽ được nhìn theo location, nhóm khách mục tiêu, tình trạng nhà, khả năng vận hành onsite và mục tiêu của chủ nhà.
          </p>
          <p>
            Kinh nghiệm thực tế gồm tăng booking, tối ưu pricing, hạn chế bad review, xử lý guest issues và cải thiện listing hoạt động chưa hiệu quả.
          </p>
        </div>
      </div>

      <div className="cohost-block">
        <div className="section-title compact-title">
          <div>
            <div className="kicker">Linh sẽ đồng hành như thế nào?</div>
            <h2>Từ chiến lược setup đến vận hành hằng ngày.</h2>
          </div>
        </div>
        <div className="cohost-services-grid">
          {serviceHighlights.map((item) => <div className="cohost-service" key={item}>{item}</div>)}
        </div>
      </div>

      <div className="cohost-block" id="cohost-packages">
        <div className="section-title compact-title">
          <div>
            <div className="kicker">Gói Co-host</div>
            <h2>Chọn mức hỗ trợ phù hợp với property và khu vực của anh/chị.</h2>
          </div>
        </div>
        <div className="cohost-package-grid">
          <div className="cohost-package-card">
            <div className="eyebrow"><span className="dot"></span> Gói 1</div>
            <h3>Co-host từ xa</h3>
            <div className="cohost-price">10-15% doanh thu booking</div>
            <p>Dành cho nhà ngoài khu vực Los Angeles, đã có cleaner, smart lock, property sẵn sàng vận hành và có người hỗ trợ onsite khi cần.</p>
            <ul>
              <li>Quản lý booking và calendar</li>
              <li>Guest communication</li>
              <li>Pricing management</li>
              <li>Listing optimization</li>
            </ul>
          </div>
          <div className="cohost-package-card featured">
            <div className="eyebrow"><span className="dot"></span> Gói 2</div>
            <h3>Co-host trực tiếp</h3>
            <div className="cohost-price">15% doanh thu booking</div>
            <p>Dành cho khu vực Los Angeles / Orange County, bao gồm toàn bộ phần co-host từ xa và hỗ trợ vận hành thực tế nhiều hơn khi cần.</p>
            <ul>
              <li>Quản lý booking, guest và calendar</li>
              <li>Pricing và listing optimization</li>
              <li>Hỗ trợ cleaner flow và turnover</li>
              <li>Hỗ trợ xử lý vấn đề phát sinh tại property</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="cohost-setup-card">
        <div>
          <div className="kicker">One-time setup fee</div>
          <h3>Phí setup ban đầu: $700 fixed</h3>
          <p>
            Phí setup được tính một lần để chuẩn bị property sẵn sàng vận hành Airbnb và các nền tảng OTA khác một cách chuyên nghiệp.
          </p>
        </div>
        <div className="cohost-setup-list">
          {setupIncludes.map((item) => <div key={item}>✓ {item}</div>)}
        </div>
      </div>

      <div className="cohost-terms-card">
        <h3>Thời gian hợp tác và lưu ý</h3>
        <p>
          Thời gian hợp tác tối thiểu là 12 tháng để listing có thời gian build review, tối ưu occupancy và ổn định hiệu suất vận hành.
        </p>
        <p>
          Chủ nhà chịu chi phí cleaning, repairs, utilities, supplies và platform fees. Kết quả phụ thuộc vào location, seasonality, tình trạng property và nhu cầu thị trường. Mỗi property sẽ được đánh giá riêng trước khi Linh đưa ra hướng vận hành phù hợp.
        </p>
      </div>
    </section>
  );
}
