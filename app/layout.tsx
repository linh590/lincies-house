import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};


export const metadata: Metadata = {
  metadataBase: new URL("https://www.lincieshouse.com"),
  title: "Airbnb Thực Chiến Tại Mỹ: Từ Setup Đến Vận Hành (Start Airbnb. Build Your Profit.) | Lincies House",
  description: "Từ setup căn nhà, tạo listing, pricing, chăm guest đến cleaner flow và vận hành Airbnb bài bản bằng tiếng Việt.",
  alternates: { canonical: "https://www.lincieshouse.com" },
  openGraph: {
    title: "Airbnb Thực Chiến Tại Mỹ: Từ Setup Đến Vận Hành (Start Airbnb. Build Your Profit.)",
    description: "Từ setup căn nhà đến vận hành Airbnb bài bản. Học cùng Linh, Superhost 6 năm và host/co-host gần 30 listings tại Mỹ.",
    type: "website",
    url: "https://www.lincieshouse.com",
    siteName: "Lincies House",
    locale: "vi_VN",
    images: [
      {
        url: "/assets/lincies-house-og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Lincies House - Airbnb Thực Chiến Tại Mỹ: Từ Setup Đến Vận Hành (Start Airbnb. Build Your Profit.)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Airbnb Thực Chiến Tại Mỹ: Từ Setup Đến Vận Hành (Start Airbnb. Build Your Profit.)",
    description: "Từ setup căn nhà đến vận hành Airbnb bài bản. Học cùng Linh, Superhost 6 năm.",
    images: ["/assets/lincies-house-og-preview.jpg"],
  },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Airbnb Thực Chiến Tại Mỹ: Từ Setup Đến Vận Hành (Start Airbnb. Build Your Profit.)",
  description: "Airbnb Thực Chiến Tại Mỹ: Từ Setup Đến Vận Hành (Start Airbnb. Build Your Profit.) cùng Linh, hướng dẫn setup property, tạo listing, pricing, guest communication, cleaner flow, operations, reviews và hosting strategy.",
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
    { "@type": "Question", name: "Có tài liệu hoặc checklist để làm theo không?", acceptedAnswer: { "@type": "Answer", text: "Có. Anh chị có Airbnb Toolkit Thực Chiến gồm setup checklist nhà Airbnb, supply shopping list, cleaner flow và cleaning checklist, guest message templates, house rules template, Bộ Design, listing checklist, checklist chụp hình đẹp bằng điện thoại, pricing checklist cơ bản và các tài liệu hỗ trợ vận hành thực tế." } },
    { "@type": "Question", name: "Video học bằng ngôn ngữ nào?", acceptedAnswer: { "@type": "Answer", text: "Video hiện tại bằng tiếng Việt, Linh giải thích tự nhiên và vẫn dùng các thuật ngữ Airbnb/hosting quen thuộc như listing, guest, cleaner, co-host để anh chị dễ áp dụng khi làm thật." } },
    { "@type": "Question", name: "Mua xong vào học như thế nào?", acceptedAnswer: { "@type": "Answer", text: "Sau khi thanh toán thành công, email mua hàng sẽ được kích hoạt quyền học. Anh chị dùng email đó để đăng nhập và xem bài trong khu học viên." } },
    { "@type": "Question", name: "Package 1 và Package 2 khác nhau gì?", acceptedAnswer: { "@type": "Answer", text: "Package 1 dành cho anh chị muốn tự học. Package 2 bao gồm Package 1 và Monthly Meeting Group Q&A cùng Linh trong 12 tháng, mỗi tháng 1 buổi hỏi đáp nhóm online để trao đổi tình huống setup, vận hành và các câu hỏi thường gặp khi làm Airbnb." } },
    { "@type": "Question", name: "Package 3 dành cho ai?", acceptedAnswer: { "@type": "Answer", text: "Package 3 dành cho anh chị đã sẵn sàng triển khai Airbnb thật và muốn Linh đồng hành sát hơn trong giai đoạn setup, launch, review listing và vận hành ban đầu, theo phạm vi hỗ trợ của gói." } },
    { "@type": "Question", name: "Có thể thanh toán bằng Zelle không?", acceptedAnswer: { "@type": "Answer", text: "Có. Anh chị có thể thanh toán bằng thẻ qua Stripe hoặc chuyển Zelle, sau đó điền form Zelle để Linh đối chiếu giao dịch và kích hoạt quyền học." } },
    { "@type": "Question", name: "Khóa học có đảm bảo có booking hoặc lợi nhuận không?", acceptedAnswer: { "@type": "Answer", text: "Không. Khóa học cung cấp kiến thức, quy trình và kinh nghiệm thực tế. Booking, doanh thu và lợi nhuận phụ thuộc vào property, thị trường, giá, hình ảnh, review và cách anh chị thực hiện." } },
    { "@type": "Question", name: "Khóa học có được bổ sung nội dung không?", acceptedAnswer: { "@type": "Answer", text: "Có. Khóa học được update bổ sung bài học mới khi Airbnb có tính năng mới, chính sách mới hoặc tình huống thực tế quan trọng/phù hợp với việc vận hành. Đây không phải cam kết cập nhật mọi thay đổi ngay lập tức." } },
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
