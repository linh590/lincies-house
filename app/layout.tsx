import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khóa Học Airbnb Thực Chiến Cho Người Mới | Lincies House",
  description: "Khóa học Airbnb thực chiến với 38 bài học chính, video tiếng Việt & English, Airbnb Starter Toolkit, lifetime access và Bonus Update Library.",
  alternates: { canonical: "https://lincieshouse.com/khoa-hoc-airbnb" },
  openGraph: {
    title: "Khóa Học Airbnb Thực Chiến | Lincies House",
    description: "Học Airbnb thực chiến cùng Lincies House: 38 bài học chính, video tiếng Việt & English, toolkit và bonus updates.",
    type: "website",
    images: ["/assets/hero-kitchen.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khóa Học Airbnb Thực Chiến | Lincies House",
    description: "Học Airbnb thực chiến cùng Lincies House: 38 bài học chính, video tiếng Việt & English, toolkit và bonus updates.",
    images: ["/assets/hero-kitchen.jpeg"],
  },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Khóa Học Airbnb Thực Chiến",
  description: "Khóa học Airbnb thực chiến bởi Lincies House, bao gồm listing setup, pricing, guest communication, cleaner, operations, reviews và hosting strategy.",
  provider: { "@type": "Organization", name: "Lincies House", sameAs: "https://lincieshouse.com" },
  inLanguage: ["vi", "en"],
};
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lincies House",
  url: "https://lincieshouse.com",
  description: "Lincies House offers practical Airbnb education, bilingual course access, and hosting resources for people who want to start and operate Airbnb listings with more confidence.",
  slogan: "Airbnb thực chiến, từng bước tạo lợi nhuận.",
};
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Người mới hoàn toàn có học được không?", acceptedAnswer: { "@type": "Answer", text: "Có. Khóa học đi từ nền tảng, giúp anh chị hiểu Airbnb hoạt động thế nào trước khi setup listing." } },
    { "@type": "Question", name: "Có cần sở hữu nhà mới học được không?", acceptedAnswer: { "@type": "Answer", text: "Không nhất thiết. Có thể bắt đầu từ phòng trống, property đang có, thuê hoặc mua nếu phù hợp, hoặc co-host." } },
    { "@type": "Question", name: "Khóa học có update không?", acceptedAnswer: { "@type": "Answer", text: "Có Bonus Update Library khi có nội dung quan trọng và phù hợp, nhưng không có nghĩa mọi thay đổi của Airbnb đều sẽ được cập nhật ngay lập tức hoặc áp dụng cho tất cả host ở mọi khu vực." } },
    { "@type": "Question", name: "Học xong có đảm bảo có lời không?", acceptedAnswer: { "@type": "Answer", text: "Không. Khóa học cung cấp kiến thức, hệ thống và checklist; kết quả phụ thuộc vào location, property, chi phí, luật địa phương, thị trường, pricing, reviews và cách vận hành." } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        {children}
      </body>
    </html>
  );
}
