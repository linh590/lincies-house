import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lincieshouse.com"),
  title: "Khóa Học Airbnb Thực Chiến Cho Người Mới | Lincies House",
  description: "Khóa học Airbnb thực chiến bằng tiếng Việt với 37 bài học chính đã gắn, bộ checklist/tài liệu áp dụng và thư viện bonus update khi có nội dung quan trọng.",
  alternates: { canonical: "https://lincieshouse.com/khoa-hoc-airbnb" },
  openGraph: {
    title: "Khóa Học Airbnb Thực Chiến | Lincies House",
    description: "Học Airbnb thực chiến cùng Lincies House: 37 bài học tiếng Việt, toolkit/checklist và bonus updates khi có nội dung quan trọng.",
    type: "website",
    images: ["/assets/hero-kitchen.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khóa Học Airbnb Thực Chiến | Lincies House",
    description: "Học Airbnb thực chiến cùng Lincies House: 37 bài học tiếng Việt, toolkit/checklist và bonus updates khi có nội dung quan trọng.",
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
  description: "Lincies House cung cấp khóa học Airbnb thực chiến bằng tiếng Việt, kèm checklist và tài liệu vận hành cho người muốn bắt đầu hoặc tối ưu Airbnb bài bản hơn.",
  slogan: "Airbnb thực chiến, từng bước tạo lợi nhuận.",
};
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Người mới hoàn toàn có học được không?", acceptedAnswer: { "@type": "Answer", text: "Có. Khóa học đi từ nền tảng, giúp anh chị hiểu Airbnb hoạt động thế nào trước khi setup listing." } },
    { "@type": "Question", name: "Có cần sở hữu nhà mới học được không?", acceptedAnswer: { "@type": "Answer", text: "Không nhất thiết. Có thể bắt đầu từ phòng trống, property đang có, thuê hoặc mua nếu phù hợp, hoặc co-host." } },
    { "@type": "Question", name: "Khóa học có update không?", acceptedAnswer: { "@type": "Answer", text: "Có thư viện bonus update khi có nội dung quan trọng và phù hợp, nhưng không có nghĩa mọi thay đổi của Airbnb đều sẽ được cập nhật ngay lập tức hoặc áp dụng cho tất cả host ở mọi khu vực." } },
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
