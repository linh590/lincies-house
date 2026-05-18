# LinhHome Launch Notes

## Framework
Chốt dùng **Next.js** để làm website production.

Lý do:
- Đẹp và linh hoạt hơn web builder.
- SEO tốt: metadata, schema, speed optimization.
- Sau này dễ thêm blog, checkout, login học viên, course dashboard.
- Deploy tốt trên Vercel.

## Domain check

### lincies.com
- RDAP Verisign trả về domain record.
- Kết luận: **đã được đăng ký / đang có chủ sở hữu**.
- Không nên chọn nếu muốn mua nhanh, trừ khi mua lại từ chủ domain.

### lincieshouse.com
- RDAP Verisign trả 404 Not Found.
- DNS không resolve.
- Kết luận: **có khả năng đang available**, nhưng cần check lại và mua ngay trên registrar như Namecheap, GoDaddy, Cloudflare Registrar hoặc Squarespace Domains.

## Payment
Chốt dùng **Stripe Checkout** cho debit/credit card.

## Price
Giá test hiện tại: **$1** để bạn bè mua thử như học viên. Đổi lại **$497** trước khi bán công khai.

## Next steps
1. Chị mua/chốt domain, em khuyên ưu tiên `lincieshouse.com` nếu chị thích tên đó.
2. Stripe Checkout dùng inline price theo `STRIPE_COURSE_AMOUNT_CENTS`; hiện đang để $1 test, đổi lại $497 one-time payment trước launch chính thức.
3. Lấy Stripe Checkout link hoặc để em tích hợp Stripe API sau.
4. Deploy Next.js site lên Vercel.
5. Trỏ domain về Vercel.
6. Connect Google Search Console + Analytics.


## Domain purchased
- Domain purchased: **lincieshouse.com**
- Registrar: Namecheap
- Next task: deploy Next.js site to Vercel, then add `lincieshouse.com` and `www.lincieshouse.com` in Vercel Domains.
- DNS target will depend on Vercel instructions, usually:
  - A record for `@` → `76.76.21.21`
  - CNAME for `www` → `cname.vercel-dns.com`
