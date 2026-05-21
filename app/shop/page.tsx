import "../globals.css";

export const metadata = {
  title: "Airbnb Setup Essentials | Lincies House Shop",
  description:
    "Danh sách đồ Linh recommend để setup Airbnb: bedding, towels, kitchen, cleaning supplies, smart lock, decor và host tools.",
  alternates: { canonical: "https://www.lincieshouse.com/shop" },
  openGraph: {
    title: "Airbnb Setup Essentials | Lincies House",
    description:
      "Danh sách đồ Linh recommend để setup Airbnb gọn, đẹp, dễ vận hành và guest-ready hơn.",
    url: "https://www.lincieshouse.com/shop",
    siteName: "Lincies House",
    locale: "vi_VN",
    type: "website",
  },
};

const retailerLinks = [
  { name: "Amazon", href: "https://www.amazon.com/s?k=airbnb+hosting+essentials" },
  { name: "Walmart", href: "https://www.walmart.com/search?q=airbnb%20essentials" },
  { name: "Target", href: "https://www.target.com/s?searchTerm=airbnb+essentials" },
  { name: "Costco", href: "https://www.costco.com/CatalogSearch?keyword=home+essentials" },
  { name: "Macy’s", href: "https://www.macys.com/shop/bed-bath?id=7495" },
];

const categories = [
  {
    kicker: "BEDDING & LINENS",
    title: "Giường ngủ sạch, sáng và tạo cảm giác hotel-ready",
    intro:
      "Đây là nhóm đồ guest nhìn thấy và cảm nhận đầu tiên. Linh ưu tiên màu dễ giặt, dễ thay, bền và nhìn sạch trên hình listing.",
    items: [
      "Sheet set màu trắng hoặc neutral, dễ thay giữa các booking",
      "Mattress protector chống nước cho từng giường",
      "Pillow protector và gối dự phòng",
      "Duvet insert + duvet cover dễ tháo giặt",
      "Extra blanket để guest cảm thấy được chuẩn bị kỹ",
    ],
    search: "white bedding set airbnb mattress protector",
  },
  {
    kicker: "BATHROOM ESSENTIALS",
    title: "Bathroom phải sạch, đủ đồ và tạo niềm tin ngay lập tức",
    intro:
      "Bathroom ảnh hưởng rất mạnh đến review. Nên chọn towels đồng bộ, supplies rõ ràng và backup đủ để cleaner không bị thiếu đồ.",
    items: [
      "Bath towels, hand towels và washcloths đồng bộ màu",
      "Shower curtain liner hoặc bath mat dễ giặt",
      "Soap, shampoo, conditioner dạng refill hoặc chai đẹp",
      "Toilet paper holder, trash can nhỏ có nắp",
      "Hair dryer và basic first-aid kit",
    ],
    search: "white towels bath mat soap dispenser airbnb",
  },
  {
    kicker: "KITCHEN SETUP",
    title: "Kitchen đủ dùng để guest không phải nhắn hỏi liên tục",
    intro:
      "Không cần mua quá nhiều, nhưng cần đủ những món căn bản để family, business traveler hoặc guest ở dài ngày cảm thấy tiện.",
    items: [
      "Dinnerware set, cups, mugs và wine glasses cơ bản",
      "Cookware set dễ vệ sinh, cutting board và knives",
      "Coffee maker hoặc kettle tùy nhóm khách mục tiêu",
      "Utensils, can opener, measuring cups và mixing bowls",
      "Paper towel holder, dish soap, sponge và trash bags",
    ],
    search: "kitchen starter set cookware dinnerware airbnb",
  },
  {
    kicker: "CLEANING & TURNOVER",
    title: "Cleaner flow tốt bắt đầu từ supplies rõ ràng",
    intro:
      "Một căn Airbnb vận hành ổn cần supplies dễ kiểm tra, dễ refill và có backup. Nhóm này giúp turnover nhanh và ít lỗi hơn.",
    items: [
      "All-purpose cleaner, glass cleaner và disinfecting wipes",
      "Laundry detergent, stain remover và dryer sheets",
      "Vacuum, broom, mop và lint roller",
      "Storage bins để chia supplies theo khu vực",
      "Cleaner checklist clipboard hoặc laminated checklist",
    ],
    search: "airbnb cleaning supplies vacuum storage bins",
  },
  {
    kicker: "SMART LOCK & SAFETY",
    title: "Check-in càng rõ ràng, host càng đỡ bị làm phiền",
    intro:
      "Smart lock, camera đúng vị trí cho phép và safety basics giúp vận hành chuyên nghiệp hơn. Luôn kiểm tra luật địa phương và policy của platform.",
    items: [
      "Smart lock hoặc keypad lock phù hợp cửa nhà",
      "Doorbell camera hoặc exterior camera đúng policy",
      "Smoke detector, carbon monoxide detector và fire extinguisher",
      "Noise monitor nếu market/property phù hợp",
      "Backup lockbox cho tình huống khẩn cấp",
    ],
    search: "smart lock keypad smoke detector airbnb",
  },
  {
    kicker: "DECOR & GUEST EXPERIENCE",
    title: "Decor có cảm xúc nhưng vẫn dễ clean và không rối",
    intro:
      "Decor nên giúp listing có điểm nhớ trên hình, nhưng không làm cleaner mất thời gian hoặc khiến không gian khó bảo trì.",
    items: [
      "Throw pillows và blanket tạo điểm nhấn màu nhẹ",
      "Wall art phù hợp concept căn nhà",
      "Lamps ánh sáng ấm cho bedroom/living room",
      "Luggage rack hoặc bench ở phòng ngủ",
      "Welcome tray, guest book hoặc small local touch",
    ],
    search: "neutral home decor throw pillows lamps guest room",
  },
];

function retailerSearchUrl(retailer: string, query: string) {
  const encoded = encodeURIComponent(query);
  if (retailer === "Amazon") return `https://www.amazon.com/s?k=${encoded}`;
  if (retailer === "Walmart") return `https://www.walmart.com/search?q=${encoded}`;
  if (retailer === "Target") return `https://www.target.com/s?searchTerm=${encoded}`;
  if (retailer === "Costco") return `https://www.costco.com/CatalogSearch?keyword=${encoded}`;
  return `https://www.macys.com/shop/search?keyword=${encoded}`;
}

export default function ShopPage() {
  return (
    <main className="page affiliate-page">
      <nav className="nav">
        <a className="logo" href="/#top" aria-label="Lincies House home">
          <img className="script-logo" src="/assets/lincies-house-logo-transparent.png" alt="Lincies House logo" />
        </a>
        <div className="navlinks">
          <a href="/#course">Course Program</a>
          <a href="/#pricing">Learn with Linh</a>
          <a href="/cohost">Co-host</a>
          <a href="/shop">Shop</a>
          <a href="/#contact">Contact</a>
        </div>
        <div className="nav-actions">
          <a className="login-cta" href="/login">Login</a>
          <a className="cta" href="/#pricing">Join the Course</a>
        </div>
      </nav>

      <section className="affiliate-hero section">
        <div className="affiliate-hero-copy">
          <div className="kicker">AIRBNB SETUP ESSENTIALS</div>
          <h1>Danh sách đồ Linh recommend để setup Airbnb gọn, đẹp và dễ vận hành hơn.</h1>
          <p>
            Trang này gom các nhóm sản phẩm thường dùng khi chuẩn bị một căn Airbnb: bedding, towels,
            kitchen, cleaning supplies, smart lock, decor và host tools. Mục tiêu là giúp anh/chị mua đồ có hệ thống,
            tránh thiếu những món nhỏ nhưng ảnh hưởng đến guest experience và review.
          </p>
          <div className="affiliate-actions">
            <a className="btn primary" href="#categories">Xem danh sách đồ →</a>
            <a className="btn secondary" href="/#course">Học cách setup Airbnb</a>
          </div>
        </div>
        <div className="affiliate-hero-card" aria-hidden="true">
          <div className="affiliate-stack-card">Guest-ready bedding</div>
          <div className="affiliate-stack-card">Cleaner supplies</div>
          <div className="affiliate-stack-card">Smart check-in</div>
        </div>
      </section>

      <section className="section affiliate-disclosure-section">
        <div className="affiliate-disclosure">
          <b>Affiliate disclosure</b>
          <p>
            Một số link trên trang này có thể là affiliate links. Nếu anh/chị mua hàng qua link đó,
            Lincies House có thể nhận một khoản hoa hồng nhỏ, nhưng giá mua của anh/chị không thay đổi.
            Linh chỉ recommend những nhóm đồ phù hợp với việc setup và vận hành Airbnb thực tế.
          </p>
        </div>
      </section>

      <section className="section affiliate-retailers">
        <div className="section-title">
          <div>
            <div className="kicker">SHOP BY STORE</div>
            <h2>Các nơi dễ mua đồ setup nhà tại Mỹ</h2>
          </div>
          <p>Chọn store quen thuộc để tìm nhanh các món cần cho Airbnb, từ đồ setup ban đầu đến supplies dùng trong quá trình vận hành.</p>
        </div>
        <div className="retailer-grid">
          {retailerLinks.map((store) => (
            <a key={store.name} className="retailer-card" href={store.href} target="_blank" rel="nofollow sponsored noreferrer">
              <span>Shop at</span>
              <b>{store.name}</b>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="categories">
        <div className="section-title">
          <div>
            <div className="kicker">HOST SHOPPING LIST</div>
            <h2>Những nhóm đồ nên chuẩn bị trước khi launch listing</h2>
          </div>
          <p>Dùng như checklist mua đồ để chuẩn bị listing có hệ thống hơn, không mua lan man và không thiếu những món nhỏ nhưng ảnh hưởng đến trải nghiệm guest.</p>
        </div>
        <div className="affiliate-category-grid">
          {categories.map((category) => (
            <article key={category.kicker} className="affiliate-category-card">
              <div className="kicker">{category.kicker}</div>
              <h3>{category.title}</h3>
              <p>{category.intro}</p>
              <ul>
                {category.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="shop-link-row">
                {retailerLinks.slice(0, 3).map((store) => (
                  <a key={store.name} href={retailerSearchUrl(store.name, category.search)} target="_blank" rel="nofollow sponsored noreferrer">
                    {store.name}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section affiliate-next-step">
        <div className="affiliate-next-card">
          <div>
            <div className="kicker">FOR STUDENTS</div>
            <h2>Muốn biết mua món nào trước, món nào sau?</h2>
            <p>
              Trong khóa học, Linh hướng dẫn cách nhìn setup theo concept, budget, cleaner flow và guest expectation,
              để anh/chị không mua lan man hoặc thiếu những món quan trọng trước khi chụp hình listing.
            </p>
          </div>
          <a className="btn primary" href="/#pricing">Đăng ký học cùng Linh →</a>
        </div>
      </section>
    </main>
  );
}
