import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lincieshouse.com"),
  title: "Khóa Học Airbnb Thực Chiến Từ Setup Đến Vận Hành | Lincies House",
  description: "Khóa học Airbnb thực chiến cùng Linh: từ setup căn nhà đầu tiên, tạo listing, pricing, chăm guest đến vận hành homestay bài bản.",
  alternates: { canonical: "https://lincieshouse.com/khoa-hoc-airbnb" },
  openGraph: {
    title: "Khóa Học Airbnb Thực Chiến | Từ Setup Đến Vận Hành",
    description: "Khóa học Airbnb/homestay bằng tiếng Việt: setup căn, tạo listing, pricing, chăm guest, cleaner checklist và vận hành thực tế.",
    type: "website",
    images: ["/assets/hero-kitchen.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khóa Học Airbnb Thực Chiến | Từ Setup Đến Vận Hành",
    description: "Khóa học Airbnb/homestay bằng tiếng Việt: setup căn, tạo listing, pricing, chăm guest, cleaner checklist và vận hành thực tế.",
    images: ["/assets/hero-kitchen.jpeg"],
  },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Khóa Học Airbnb Thực Chiến",
  description: "Khóa học Airbnb thực chiến cùng Linh, hướng dẫn setup property, tạo listing, pricing, guest communication, cleaner flow, operations, reviews và hosting strategy.",
  provider: { "@type": "Organization", name: "Lincies House", sameAs: "https://lincieshouse.com" },
  inLanguage: ["vi", "en"],
};
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lincies House",
  url: "https://lincieshouse.com",
  description: "Lincies House cung cấp khóa học Airbnb/homestay thực chiến bằng tiếng Việt, kèm checklist setup, cleaner flow, guest message templates và tài liệu vận hành cho người muốn bắt đầu hoặc tối ưu listing bài bản hơn.",
  slogan: "Airbnb thực chiến, từng bước tạo lợi nhuận.",
};
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Người mới hoàn toàn có theo được không?", acceptedAnswer: { "@type": "Answer", text: "Có. Khóa học đi từ nền tảng: Airbnb hoạt động ra sao, host cần chuẩn bị gì, guest kỳ vọng gì và từng bước để đưa một listing lên bài bản." } },
    { "@type": "Question", name: "Chưa có nhà thì học có sớm quá không?", acceptedAnswer: { "@type": "Answer", text: "Không sớm. Học trước giúp anh chị biết nên tìm loại property nào, tính chi phí ra sao, hỏi city hoặc HOA điều gì và tránh xuống tiền khi chưa hiểu mô hình." } },
    { "@type": "Question", name: "Có cần sở hữu nhà mới học được không?", acceptedAnswer: { "@type": "Answer", text: "Không cần. Anh chị có thể học để chuẩn bị cho căn nhà tương lai, khai thác phòng trống, làm co-host, hoặc hiểu mô hình trước khi thuê hoặc mua property." } },
    { "@type": "Question", name: "Khóa học phù hợp với người đang có listing chưa?", acceptedAnswer: { "@type": "Answer", text: "Có. Nếu listing đang ít booking, review chưa ổn, ảnh chưa hút khách hoặc vận hành còn rối, khóa học giúp anh chị nhìn lại từng phần để tối ưu có hệ thống hơn." } },
    { "@type": "Question", name: "Học xong có biết tự tạo listing Airbnb không?", acceptedAnswer: { "@type": "Answer", text: "Khóa học hướng dẫn từ chuẩn bị căn, chọn ảnh, viết title và description, đặt rules, setup pricing và calendar đến cách chăm guest sau khi có booking." } },
    { "@type": "Question", name: "Có tài liệu hoặc checklist để làm theo không?", acceptedAnswer: { "@type": "Answer", text: "Có. Anh chị có toolkit đi kèm như launch checklist, cleaner turnover checklist, guest message templates và supplies hoặc operations flow để mở ra làm từng bước." } },
    { "@type": "Question", name: "Video là tiếng Việt hay tiếng Anh?", acceptedAnswer: { "@type": "Answer", text: "Video chính bằng tiếng Việt, dùng các thuật ngữ Airbnb và hosting quen thuộc như listing, guest, cleaner, co-host để anh chị dễ áp dụng khi làm thật." } },
    { "@type": "Question", name: "Mua xong vào học như thế nào?", acceptedAnswer: { "@type": "Answer", text: "Sau khi thanh toán thành công, email mua hàng sẽ được kích hoạt quyền học. Anh chị dùng email đó để đăng nhập và xem bài trong khu học viên." } },
    { "@type": "Question", name: "Package 1 và Package 2 khác nhau gì?", acceptedAnswer: { "@type": "Answer", text: "Package 1 dành cho anh chị muốn tự học. Package 2 có thêm 3 buổi 1:1 với Linh, phù hợp khi anh chị có căn hoặc listing cụ thể và muốn được góp ý riêng." } },
    { "@type": "Question", name: "Package 3 dành cho ai?", acceptedAnswer: { "@type": "Answer", text: "Package 3 dành cho anh chị muốn Linh đồng hành sâu hơn trong giai đoạn launch và vận hành ban đầu, theo phạm vi đã nêu trong phần điều kiện hỗ trợ." } },
    { "@type": "Question", name: "Có thể thanh toán bằng Zelle không?", acceptedAnswer: { "@type": "Answer", text: "Có. Anh chị có thể thanh toán bằng thẻ qua Stripe hoặc chuyển Zelle, sau đó điền form Zelle để Linh đối chiếu giao dịch và kích hoạt quyền học." } },
    { "@type": "Question", name: "Khóa học có đảm bảo có booking hoặc lợi nhuận không?", acceptedAnswer: { "@type": "Answer", text: "Không. Khóa học cung cấp kiến thức, quy trình và kinh nghiệm thực tế. Booking, doanh thu và lợi nhuận phụ thuộc vào property, thị trường, giá, hình ảnh, review và cách anh chị thực hiện." } },
    { "@type": "Question", name: "Khóa học có được bổ sung nội dung không?", acceptedAnswer: { "@type": "Answer", text: "Có. Linh có thể bổ sung nội dung khi Airbnb, công cụ, chính sách hoặc tình huống thực tế có điểm quan trọng và phù hợp. Đây không phải cam kết cập nhật mọi thay đổi ngay lập tức." } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <Script type="module" src="https://cdn.jsdelivr.net/npm/@mux/mux-player@3" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
