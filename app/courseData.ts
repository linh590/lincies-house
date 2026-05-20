export type Lesson = {
  chapter: number;
  chapterTitle: string;
  lesson: string;
  title: string;
  playbackId: string;
  thumbnailUrl?: string;
  summary?: string;
};

export const courseLessons: Lesson[] = [
  {
    chapter: 1,
    chapterTitle: "Hiểu đúng Airbnb trước khi xuống tiền",
    lesson: "Bài 1.1",
    title: "Tổng quan Airbnb và cách nền tảng hoạt động",
    playbackId: "PYIbByfBingAftHCyrw4ZFpWgP9tDb3yVpOej2fAgrk",
    thumbnailUrl: "/assets/lesson-thumbnails/chapter-1-lesson-1-1-same-design-clean-font.jpg",
    summary: "Airbnb là nền tảng kết nối host và guest; bài học giải thích lịch sử, cách booking/thanh toán/review vận hành và vì sao Airbnb là mô hình lưu trú khác khách sạn.",
  },
  {
    chapter: 1,
    chapterTitle: "Hiểu đúng Airbnb trước khi xuống tiền",
    lesson: "Bài 1.2",
    title: "Câu chuyện Linh bắt đầu Airbnb từ căn nhà đầu tiên",
    playbackId: "9800kZbQTgNKFkjyodXKo4ZS30054NpMf1Y8qotu3021zg",
    summary: "Linh chia sẻ hành trình bắt đầu năm 2019 từ các phòng trong nhà, cách tạo dòng tiền, mở rộng listing và xây nền tảng kinh nghiệm thực chiến.",
  },
  {
    chapter: 1,
    chapterTitle: "Hiểu đúng Airbnb trước khi xuống tiền",
    lesson: "Bài 1.3",
    title: "Ưu điểm, nhược điểm & rủi ro của Airbnb",
    playbackId: "QQ02XlcBxR0100cbSW2oSZqorR3x9IAaPsmwBvjvdRhps8",
    summary: "Nhìn rõ mặt mạnh của Airbnb như dễ bắt đầu, thu nhập theo đêm, khả năng mở rộng; đồng thời hiểu rủi ro mùa vụ, vận hành, guest và luật địa phương.",
  },
  {
    chapter: 1,
    chapterTitle: "Hiểu đúng Airbnb trước khi xuống tiền",
    lesson: "Bài 1.4",
    title: "Ai phù hợp để làm Airbnb lâu dài?",
    playbackId: "Eo6KuJjuBFbXjrzVsAOECswHZrP01ALx00LISQgoV7xGI",
    summary: "Airbnb phù hợp với người có tư duy dịch vụ, sạch sẽ, chăm chút không gian, biết giao tiếp, xử lý tình huống và có tư duy tài chính thực tế.",
  },
  {
    chapter: 1,
    chapterTitle: "Hiểu đúng Airbnb trước khi xuống tiền",
    lesson: "Bài 1.5",
    title: "Tư duy tài chính: doanh thu không phải lợi nhuận",
    playbackId: "VdsGlNwfzQbgwMUnHb7H65zn200R3alc00ADQOdmOtZXU",
    summary: "Cách nhìn đúng về chi phí cố định, vận hành, thuế, hao mòn, tỷ lệ lấp đầy thấp điểm và dòng tiền để tránh chọn căn bị lỗ.",
  },
  {
    chapter: 1,
    chapterTitle: "Hiểu đúng Airbnb trước khi xuống tiền",
    lesson: "Bài 1.6",
    title: "Chọn mô hình Airbnb phù hợp với ngân sách & kinh nghiệm",
    playbackId: "tzVuJkBfV8WffZobY6OmoL8eGmZ2uivDnvezf3JKWTM",
    summary: "So sánh thuê phòng, studio, 1-bedroom, nhà nguyên căn, thuê nhà và co-host để chọn mô hình phù hợp giai đoạn bắt đầu và mục tiêu phát triển.",
  },

  {
    chapter: 2,
    chapterTitle: "Chọn mô hình, location và property phù hợp",
    lesson: "Bài 2.1",
    title: "Luật short-term rental, permit & bảo hiểm trước khi làm Airbnb",
    playbackId: "f4JcLLpyV52koNYPcT01SXbtdsF8xQXywZBqRVB5QQOM",
    summary: "Kiểm tra city có cho phép short-term rental, permit/business license, insurance, lease clause và inspection trước khi thuê hoặc mua nhà làm Airbnb.",
  },
  {
    chapter: 2,
    chapterTitle: "Chọn mô hình, location và property phù hợp",
    lesson: "Bài 2.2",
    title: "Quy trình thuê nhà làm Airbnb & thương lượng với chủ nhà",
    playbackId: "OHKeGL02jzDD01cYpwPhIwzsfl01ivFc97n9LMq7xCnW00g",
    summary: "Xác định mô hình thuê, lọc căn phù hợp, tìm nguồn nhà, đàm phán hợp đồng dài hạn và trình bày rõ với chủ nhà.",
  },
  {
    chapter: 2,
    chapterTitle: "Chọn mô hình, location và property phù hợp",
    lesson: "Bài 2.3",
    title: "Tránh scam khi thuê nhà & cách xây uy tín với chủ nhà",
    playbackId: "JW6ssr2Ks00EulYFRUaMu01UAxRJCd02DbC02MVAMVMSIV00",
    summary: "Cách kiểm tra chủ nhà, giá thuê bất thường, lease, ID, video call; đồng thời thuyết phục chủ nhà và xây niềm tin khi mới bắt đầu.",
  },
  {
    chapter: 2,
    chapterTitle: "Chọn mô hình, location và property phù hợp",
    lesson: "Bài 2.4",
    title: "Chọn loại nhà phù hợp để làm Airbnb cho người mới",
    playbackId: "00VW8LWarqNUUSVFk7jR00LnAsbzSstuUFsJwAdHUP9lI",
    summary: "Ưu tiên studio/nhà nhỏ dễ vận hành, hiểu rủi ro nhà lớn, khu vực, parking, mold, hàng xóm và mức độ phức tạp trước khi mở rộng.",
  },
  {
    chapter: 2,
    chapterTitle: "Chọn mô hình, location và property phù hợp",
    lesson: "Bài 2.5",
    title: "Mua nhà để làm Airbnb: mục tiêu, location & kiểm tra trước khi xuống tiền",
    playbackId: "f02HyRdujjJJIrEuXndRI7HrkF022GvlrWF5HrjUxU011I",
    summary: "Xác định mua để ở kết hợp Airbnb, đầu tư toàn thời gian hay cho thuê dài hạn; phân tích location, khu vực du lịch và yếu tố quyết định tỷ lệ lấp đầy.",
  },
  {
    chapter: 2,
    chapterTitle: "Chọn mô hình, location và property phù hợp",
    lesson: "Bài 2.6",
    title: "Chiến lược đầu tư Airbnb dài hạn ở nhiều thị trường",
    playbackId: "3RBUzK4nv4ErSe006WOAitrVNBIsgIo013MA01TUaAFkBc",
    summary: "Kinh nghiệm mua nhà cũ giá thấp, remodel, giữ tài sản dài hạn và so sánh thị trường Dallas, Florida/LA về nhu cầu, doanh thu và ổn định.",
  },
  {
    chapter: 2,
    chapterTitle: "Chọn mô hình, location và property phù hợp",
    lesson: "Bài 2.7",
    title: "Dùng AirDNA & dữ liệu thị trường trước khi thuê hoặc mua",
    playbackId: "tOgNeKWzEULc262mgcTJ00ToW4w8DNvUEKqZQL2mjtu4",
    summary: "Cách dùng dữ liệu như AirDNA để xem demand, ADR, occupancy, doanh thu khu vực và tránh quyết định theo cảm tính khi đầu tư Airbnb.",
  },

  {
    chapter: 3,
    chapterTitle: "Setup property để có cảm xúc và dễ vận hành",
    lesson: "Bài 3.1",
    title: "Sửa chữa & setup nền móng cho căn Airbnb",
    playbackId: "02LVVFzgaB101IYiKd1aPzKpLjk27DCpIdE7el6cyAlUE",
    summary: "Các hạng mục sửa chữa cơ bản như sơn, vá tường, đèn, outlet, cửa, khóa, plumbing và kiểm tra an toàn để nhà dễ vận hành lâu dài.",
  },
  {
    chapter: 3,
    chapterTitle: "Setup property để có cảm xúc và dễ vận hành",
    lesson: "Bài 3.2",
    title: "Danh sách mua sắm nội thất, đồ bếp & supplies cho Airbnb",
    playbackId: "0034vS501ExAEwFNY2m2zX1UHY1fnTOV9unOqjf02yQJ6c",
    summary: "Chuẩn bị đồ phòng khách, bếp, phòng ngủ, bathroom, amenities và nguồn mua đồ để căn nhà đủ tiện nghi, đẹp và dễ vận hành.",
  },
  {
    chapter: 3,
    chapterTitle: "Setup property để có cảm xúc và dễ vận hành",
    lesson: "Bài 3.3",
    title: "Vì sao concept/theme quyết định booking?",
    playbackId: "gnlkqzUuj7njpnO027N81kjWVyxdnzQVkAtx9LSZQfks",
    summary: "Theme, hình ảnh và cảm xúc giúp listing nổi bật, tăng click, tăng khả năng book và có thể nâng giá so với căn không có concept rõ ràng.",
  },
  {
    chapter: 3,
    chapterTitle: "Setup property để có cảm xúc và dễ vận hành",
    lesson: "Bài 3.4",
    title: "Chọn màu chủ đạo, tranh, rèm & decor đồng bộ",
    playbackId: "gSTDj47K5zjWNWczZQsxRQTG4ymoY7zV79CVb27Qo01s",
    summary: "Cách chọn bảng màu, tranh tường, sofa, rèm, bedding, hoa và decor theo concept để không gian hài hòa, không bị rối.",
  },
  {
    chapter: 3,
    chapterTitle: "Setup property để có cảm xúc và dễ vận hành",
    lesson: "Bài 3.5",
    title: "Dùng AI để chọn style, moodboard & mua đồ decor",
    playbackId: "axw6xPFn393HaQhokxWQidf6lmXyy5Bi00SNCvYE4PLk",
    summary: "Tận dụng AI như Gemini/ChatGPT để phân tích hình nhà, đề xuất style, moodboard, bảng màu, nội thất và tránh mua sai đồ.",
  },
  {
    chapter: 3,
    chapterTitle: "Setup property để có cảm xúc và dễ vận hành",
    lesson: "Bài 3.6",
    title: "Case study decor studio Boho từ phòng khách đến bathroom",
    playbackId: "zmf5y2NOZ6Jikv36AmYj32YKDpM4Gn2Lwdbm02CjXTyM",
    summary: "Linh minh họa cách setup studio boho với tông kem, trắng, cam đất, tre nứa, bedding, cây, đồ trang trí và chi tiết tạo cảm xúc booking.",
  },

  {
    chapter: 4,
    chapterTitle: "Làm hình ảnh, listing và pricing có sức bán",
    lesson: "Bài 4.1",
    title: "Thiết lập listing Airbnb đúng nền tảng",
    playbackId: "IKePuhyv00dvfh3PKGB8015LvC1JT9TcdtD7CoKl01TwCs",
    summary: "Các bước nền tảng khi tạo listing Airbnb để khách hiểu đúng căn nhà, Airbnb đọc đúng thông tin và listing có sức bán ngay từ đầu.",
  },
  {
    chapter: 4,
    chapterTitle: "Làm hình ảnh, listing và pricing có sức bán",
    lesson: "Bài 4.2",
    title: "Chụp hình Airbnb để khách muốn bấm book",
    playbackId: "rpn9zVD02tmlXbyH2n1bO007qJqj1SyqGjsdld01MydU5w",
    summary: "Chuẩn bị nhà sạch, chọn góc chụp, dùng ảnh dọc, ánh sáng tốt, thứ tự ảnh rõ ràng và khi nào nên thuê photographer chuyên nghiệp.",
  },
  {
    chapter: 4,
    chapterTitle: "Làm hình ảnh, listing và pricing có sức bán",
    lesson: "Bài 4.3",
    title: "Tối ưu listing editor để tăng tỷ lệ lấp đầy",
    playbackId: "2N5x4twl1xp1ZJj00HYB02fLZ2xyv43PpTnnibC83MRIU",
    summary: "Kiểm tra title, property type, amenities, sleeping arrangement, house rules và các chi tiết trong Airbnb listing để thuật toán và khách hiểu đúng.",
  },
  {
    chapter: 4,
    chapterTitle: "Làm hình ảnh, listing và pricing có sức bán",
    lesson: "Bài 4.4",
    title: "Định giá Airbnb: giá mở bán, mùa vụ & sự kiện",
    playbackId: "Uh4kRdgVPDA8nTiMZZG3ORfuWHY202bGywJkQd01eIHHc",
    summary: "Không phụ thuộc Smart Pricing; học cách so sánh comp, đặt giá mở bán, tăng giảm theo tuần/mùa/sự kiện và bảo vệ lợi nhuận.",
  },
  {
    chapter: 4,
    chapterTitle: "Làm hình ảnh, listing và pricing có sức bán",
    lesson: "Bài 4.5",
    title: "Chỉnh ảnh iPhone cho listing sáng, sạch và tự nhiên",
    playbackId: "BHwaObDKEKRdIdMdldT5z5xJEzG8P3qLeu5A8dZZLho",
    summary: "Điều chỉnh highlight, shadow, contrast, brightness và màu sắc để ảnh Airbnb sáng đẹp, không cháy sáng, không tối và dễ tạo booking.",
  },

  {
    chapter: 5,
    chapterTitle: "Vận hành booking, team và cleaner flow",
    lesson: "Bài 5.1",
    title: "Quy trình booking, chuẩn bị nhà & check-in",
    playbackId: "ULh5oBcIiKZyf02Ji8zq02LPKC8FVAX3nXQxttGW8pL018",
    summary: "Cách xử lý booking mới, tin nhắn tự động, house rules, chuẩn bị cleaner, kiểm tra amenity, khóa cửa và hỗ trợ guest check-in.",
  },
  {
    chapter: 5,
    chapterTitle: "Vận hành booking, team và cleaner flow",
    lesson: "Bài 5.2",
    title: "Xây team vận hành: co-host, cleaner, handyman & automation",
    playbackId: "NZNMHpIxKUz6MBTfuQjwx4t4rZHNsdAq02a4ydqNzLPE",
    summary: "Cách dùng co-host online, cleaner, handyman, tin nhắn tự động và smart tools để vận hành nhiều căn mà vẫn phản hồi guest nhanh.",
  },
  {
    chapter: 5,
    chapterTitle: "Vận hành booking, team và cleaner flow",
    lesson: "Bài 5.3",
    title: "Bảo trì định kỳ để nhà luôn đẹp và tránh sự cố",
    playbackId: "Y3TAhYhoVS2qyojVoQRayYqdq6KAuhuZ9d6blkg02rtE",
    summary: "Lịch deep clean, thay filter AC, touch-up sơn, pest control, landscaping, home warranty và xử lý hỏng hóc trước khi thành vấn đề lớn.",
  },
  {
    chapter: 5,
    chapterTitle: "Vận hành booking, team và cleaner flow",
    lesson: "Bài 5.4",
    title: "Tuyển, training & giữ cleaner tốt",
    playbackId: "6rQE00b2d02MScEY02cAfUZ7KrDVKoRS68gQvBUKpzWDBE",
    summary: "Kinh nghiệm tìm cleaner, giao checklist, kiểm tra chất lượng, trả công hợp lý và xây team cleaner đáng tin cậy cho Airbnb.",
  },
  {
    chapter: 5,
    chapterTitle: "Vận hành booking, team và cleaner flow",
    lesson: "Bài 5.5",
    title: "Chăm sóc guest để giữ rating và Superhost",
    playbackId: "02tYMhuIgecgEZX00KjhOGQWQbFbLj02uLd3ZhAYq28ZVI",
    summary: "Quy trình phản hồi nhanh, nguyên tắc 3S, xử lý yêu cầu, tạo cảm giác được quan tâm và tăng khả năng khách để lại review tốt.",
  },

  {
    chapter: 6,
    chapterTitle: "Xử lý guest khó, sự cố và review xấu",
    lesson: "Bài 6.1",
    title: "Xử lý phàn nàn thường gặp để tránh review thấp",
    playbackId: "PLh02NgQCCu9D1xJzH4J5xcSw6aejg8dBSO01kVQMLfz8",
    summary: "Cách công khai hạn chế của nhà, phản hồi nhanh với tiếng ồn, cleaning, khu vực, sự cố nhỏ và giao tiếp để giảm nguy cơ bad review.",
  },
  {
    chapter: 6,
    chapterTitle: "Xử lý guest khó, sự cố và review xấu",
    lesson: "Bài 6.2",
    title: "Xử lý sự cố nghiêm trọng: hút thuốc, hư hại, mất đồ",
    playbackId: "x7leiPEBKCVn7W00BUPYH4CUdCS5JHL4znLAQG32Ujvg",
    summary: "Kinh nghiệm xử lý guest gây hư hại, hút thuốc trong nhà, lấy đồ, vi phạm rules; thu thập bằng chứng và làm việc với Airbnb.",
  },
  {
    chapter: 6,
    chapterTitle: "Xử lý guest khó, sự cố và review xấu",
    lesson: "Bài 6.3",
    title: "Cách phản hồi review 1 sao và thương lượng với khách",
    playbackId: "hbjb2yGLwp1KUuhlV7WvM0087XILbu02KtRIUzG8xkssY",
    summary: "Xác định lỗi do host hay guest, xin lỗi/hoàn tiền khi cần, trả lời review chuyên nghiệp và bảo vệ hình ảnh listing.",
  },

  {
    chapter: 7,
    chapterTitle: "Tối ưu listing để đi đường dài",
    lesson: "Bài 7.1",
    title: "Golden Window: tối ưu listing mới trong 48 đến 72 giờ đầu",
    playbackId: "7FjIuB4gZ4k4FyWspe01Qw01AUWJ6uaN2gG5V9oJfolvk",
    summary: "Chuẩn bị ảnh, title, amenities, giá mở bán và tín hiệu ban đầu để tận dụng thời điểm Airbnb ưu tiên đẩy listing mới.",
  },
  {
    chapter: 7,
    chapterTitle: "Tối ưu listing để đi đường dài",
    lesson: "Bài 7.2",
    title: "Refresh listing cũ để kéo booking trở lại",
    playbackId: "xD4elDfuBvibc6ftNZ16KIgk5Hzz9fhBPSstj46ciiw",
    summary: "Khi listing lâu năm giảm booking, cần làm mới hình ảnh, decor, tiêu đề, mô tả, amenities và pricing để tăng click và ranking.",
  },
  {
    chapter: 7,
    chapterTitle: "Tối ưu listing để đi đường dài",
    lesson: "Bài 7.3",
    title: "Biến listing lâu năm thành tài sản mạnh",
    playbackId: "atuBK6TlZ6Rl3018dVP7veL02yePQVn8EkPhQboZlFlsI",
    summary: "Lợi thế review nhiều năm, Superhost, độ tin cậy với guest/Airbnb và cách duy trì chất lượng để listing cũ vẫn tăng trưởng.",
  },
  {
    chapter: 7,
    chapterTitle: "Tối ưu listing để đi đường dài",
    lesson: "Bài 7.4",
    title: "Bí quyết giữ Superhost & tăng review 5 sao",
    playbackId: "VzTYaC3coBk00zv9oVwY02oigtYqdNs00DRlnZDoTFlOBw",
    summary: "Tạo ấn tượng ban đầu, nói rõ khuyết điểm trước khi khách book, check-in chu đáo, chăm sóc cảm xúc guest và xin review đúng cách.",
  },
  {
    chapter: 7,
    chapterTitle: "Tối ưu listing để đi đường dài",
    lesson: "Bài 7.5",
    title: "Tổng kết khóa học & lộ trình bắt đầu nhỏ nhưng bền vững",
    playbackId: "WofzrRShUcZYgTJpTNE2YtQP1Yzjk8Fjj5jwBoYVlFw",
    summary: "Nhìn lại toàn bộ khóa học, tư duy Airbnb không làm giàu nhanh, bắt đầu từ bước nhỏ, làm dịch vụ tốt và xây hệ thống lâu dài.",
  },
  {
    chapter: 7,
    chapterTitle: "Tối ưu listing để đi đường dài",
    lesson: "Bài 7.6",
    title: "Khiếu nại Airbnb để xử lý review xấu không công bằng",
    playbackId: "7nWOLsplZ01zrDvE42ReFQwEwUDkS1sPqtBSWI2iAXcw",
    summary: "Cách gọi Airbnb, yêu cầu ghi chú hồ sơ, kiên trì follow-up, giữ thái độ lịch sự và trình bày case để xin xóa review không hợp lý.",
  },
];

export const courseChapterCounts = courseLessons.reduce<Record<number, number>>((counts, lesson) => {
  counts[lesson.chapter] = (counts[lesson.chapter] ?? 0) + 1;
  return counts;
}, {});

export const courseChapters = Object.entries(
  courseLessons.reduce<Record<number, { chapter: number; title: string; lessons: Lesson[] }>>((chapters, lesson) => {
    chapters[lesson.chapter] ??= {
      chapter: lesson.chapter,
      title: lesson.chapterTitle,
      lessons: [],
    };
    chapters[lesson.chapter].lessons.push(lesson);
    return chapters;
  }, {}),
)
  .map(([, chapter]) => chapter)
  .sort((a, b) => a.chapter - b.chapter);

export const totalCoreLessons = courseLessons.length;
