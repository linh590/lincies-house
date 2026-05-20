"use client";

const previewPoints = [
  "Phân tích property và chọn mô hình phù hợp: nguyên căn, thuê theo phòng, share house hoặc hybrid.",
  "Setup listing, hình ảnh, title, description, amenities, house rules và check-in flow.",
  "Quản lý pricing, booking, guest communication, cleaner flow và tối ưu sau khi launch.",
];

export default function CoHostServiceSection() {
  return (
    <section className="section cohost-section cohost-preview" id="cohost">
      <div className="cohost-hero">
        <div>
          <div className="cohost-label">Dịch vụ Co-host Airbnb cùng Linh</div>
          <h2 className="cohost-subtitle">Biến căn nhà của anh/chị thành Airbnb có chiến lược, không chỉ là đăng listing.</h2>
          <p>
            Nếu anh/chị có nhà nhưng chưa biết bắt đầu Airbnb từ đâu, hoặc listing hiện tại booking chưa đều, Linh có thể hỗ trợ từ bước phân tích property, setup listing đến vận hành thực tế.
          </p>
          <p>
            Phần này chỉ tóm tắt trên trang chủ. Anh/chị có thể xem đầy đủ dịch vụ, phạm vi hỗ trợ, phí setup và các gói co-host ở trang chi tiết.
          </p>
          <div className="cohost-actions">
            <a className="btn primary" href="/cohost">Xem chi tiết dịch vụ Co-host →</a>
            <a className="btn secondary" href="#consultation-form">Gửi thông tin để Linh tư vấn</a>
          </div>
        </div>
        <div className="cohost-proof-card">
          <div className="cohost-proof-photo" aria-hidden="true" />
          <div>
            <b>6 năm Superhost và kinh nghiệm vận hành Airbnb thực tế tại Mỹ.</b>
            <span>Linh đồng hành theo từng property, từng location và từng mô hình vận hành, không tư vấn chung chung.</span>
          </div>
        </div>
      </div>

      <div className="cohost-services-grid cohost-preview-grid">
        {previewPoints.map((item) => <div className="cohost-service" key={item}>{item}</div>)}
      </div>

      <div className="cohost-package-grid cohost-preview-packages">
        <div className="cohost-package-card">
          <div className="eyebrow"><span className="dot"></span> Gói 1</div>
          <h3>Co-host từ xa</h3>
          <div className="cohost-price">10% doanh thu booking</div>
          <p>Dành cho nhà ngoài khu vực Los Angeles, đã có cleaner, smart lock, property sẵn sàng vận hành và có người hỗ trợ onsite khi cần.</p>
        </div>
        <div className="cohost-package-card featured">
          <div className="eyebrow"><span className="dot"></span> Gói 2</div>
          <h3>Co-host trực tiếp</h3>
          <div className="cohost-price">15% doanh thu booking</div>
          <p>Dành cho khu vực Los Angeles / Orange County, bao gồm hỗ trợ vận hành thực tế nhiều hơn khi cần.</p>
        </div>
        <div className="cohost-package-card setup-mini-card">
          <div className="eyebrow"><span className="dot"></span> Setup ban đầu</div>
          <h3>Phí setup ban đầu</h3>
          <div className="cohost-price">$700</div>
          <p>Phí một lần để chuẩn bị property sẵn sàng vận hành Airbnb và các nền tảng OTA khác một cách chuyên nghiệp.</p>
        </div>
      </div>
    </section>
  );
}
