# BAMBOO SPA — Premium Wellness & Beauty Website

> **Status:** Preview Mode (Vorschau / Chưa công bố chính thức)  
> **Standort:** Lothar-Streit-Straße 5, Einheit 13, 08056 Zwickau, Deutschland  
> **Design-Stil:** Luxury Asian Wellness Resort · Japanese Zen Spa · Warm Gold & Deep Brown Palette  

---

## 1. Übersicht & Design-Philosophie

Website cao cấp được thiết kế riêng cho thương hiệu **BAMBOO SPA** tại Zwickau, Đức. Thiết kế bám sát 100% hình ảnh mẫu tham chiếu (`mẫu khách thích.jpg`) kết hợp nhận diện thương hiệu chính thức từ logo vàng (`assets/logo/bamboo-spa-logo.jpg`).

### Bảng màu chuẩn (Color Palette)
- **Primary Dark Brown:** `#241307` / `#160B05` (Nền chủ đạo sang trọng)
- **Secondary Dark Brown:** `#382012` / `#1f1008`
- **Luxury Gold:** `#C99A5C` (Đường nét, viền, icon)
- **Champagne Gold:** `#E8C18B` (Nút bấm CTA chính, điểm nhấn cao cấp)
- **Warm Beige:** `#F1E3D1` (Phụ đề, văn bản trên nền tối)
- **Cream Background:** `#F7EFE5` (Nền sáng ấm cho phần Giới thiệu & Trải nghiệm)
- **Soft White:** `#FFF9F1` (Nền thẻ & văn bản nổi bật)
- **Text Dark:** `#2C1C13` (Chữ trên nền sáng)

### Typography
- **Headings:** `'Cormorant Garamond', serif` (Thanh lịch, quyền quý, serif cổ điển)
- **Body & Controls:** `'Inter', sans-serif` (Hiện đại, thoáng, dễ đọc chuẩn châu Âu)

---

## 2. Cấu trúc thư mục dự án

```
d:/Bamboo Spa/
├── index.html              # Trang chủ đầy đủ (Hero slider, Service bar, About, Treatments, Gallery preview, Booking banner, Contact preview, Footer)
├── about.html              # Trang "Über uns" (Triết lý Zen, Giá trị cốt lõi, Không gian spa)
├── treatments.html         # Trang "Behandlungen & Preise" (3 danh mục: Ganzkörpermassage, Exklusive Fußmassage, Vietnamese Head Spa)
├── gallery.html            # Trang "Galerie" (Masonry grid 12 hình ảnh, bộ lọc theo danh mục, Lightbox phóng to ảnh)
├── contact.html            # Trang "Kontakt" (Bản đồ Google Maps responsive, Địa chỉ, Giờ mở cửa, Form thông tin)
│
├── css/
│   ├── style.css           # Toàn bộ thiết kế hệ thống, tokens, layout, typography, components
│   ├── animations.css      # Keyframes, scroll-reveal, clip-path, floating leaf, micro-interactions, prefers-reduced-motion
│   └── responsive.css      # Media queries tối ưu màn hình (1440px, 1200px, 1024px, 768px, 430px, 390px, 375px)
│
├── js/
│   ├── main.js             # Logic menu mobile, sticky header, hero slider, scroll reveal, cookie banner, booking handler
│   ├── animations.js       # Advanced animation helpers (Parallax, ScrollObserver, ImageReveal, SmoothCounter)
│   ├── gallery.js          # Masonry grid layout, filter danh mục, full-screen lightbox kèm phím bấm / vuốt chạm
│   └── translations.js     # Hệ thống đa ngôn ngữ (Đức DE làm mặc định, kèm tiếng Anh EN)
│
└── assets/
    ├── logo/
    │   └── bamboo-spa-logo.jpg     # Logo vàng chính thức của Bamboo Spa
    ├── images/                     # Thư mục lưu trữ hình ảnh thực tế khi bàn giao
    ├── icons/                      # Các icon bổ trợ
    └── reference-sample.jpg        # Hình ảnh thiết kế mẫu tham chiếu của khách hàng
```

---

## 3. Các tính năng nổi bật

1. **Chuẩn thiết kế Luxury Spa:** Hero ban đêm ấm áp, bảng dịch vụ viền vàng tinh tế và nội dung liệu trình nền nâu socola đồng nhất với thương hiệu.
2. **Hero Slider 3 Slide:**
   - Slide 1: *"Zeit für Ruhe. Zeit für Sie."*
   - Slide 2: *"Entspannung für Körper und Seele."*
   - Slide 3: *"Ihre persönliche Auszeit beginnt hier."*
   - Chuyển cảnh mượt mà, tự động chuyển mỗi 6 giây, có bộ đếm thứ tự `01 / 03`.
3. **Thanh 3 Dịch vụ (Service Bar):** Ganzkörpermassage, Exklusive Fußmassage và Vietnamese Head Spa, đồng bộ với bảng giá chính thức.
4. **Nút đặt lịch thông minh:** Nút `"Termin buchen"` đồng bộ ở Header, Hero, Booking Banner và các thẻ dịch vụ. Hiện tại khi click sẽ hiển thị thông báo trang trọng: *"Die Online-Terminbuchung ist bald verfügbar."* (chuẩn bị sẵn cấu hình để tích hợp link Treatwell).
5. **Thư viện ảnh tương tác (Gallery & Lightbox):** Lưới ảnh đa dạng tỉ lệ, bộ lọc danh mục (Räumlichkeiten, Behandlungen, Atmosphäre), click mở Lightbox toàn màn hình hỗ trợ phím mũi tên và vuốt trên thiết bị di động.
6. **Bản đồ Google Maps:** Nhúng bản đồ vị trí thực tế tại `Lothar-Streit-Straße 5, 08056 Zwickau` kèm nút `"Route planen"` dẫn đường trực tiếp.
7. **Bảo mật & Pháp lý thị trường Đức:**
   - Chế độ Preview (`<meta name="robots" content="noindex, nofollow">`).
   - Banner Cookie thông báo chuẩn DSGVO (lưu trạng thái vào `localStorage`).
   - Sẵn sàng các trang liên kết chân trang: Impressum, Datenschutzerklärung, AGB.
   - Không tự ý tạo số điện thoại hay thông tin liên hệ khi chưa có dữ liệu chính thức.
8. **Đa ngôn ngữ DE | EN:** Chuyển đổi ngôn ngữ tức thì qua nút trên Header với dữ liệu từ `translations.js`.

---

## 4. Hướng dẫn cập nhật & Vận hành

### 4.1. Tích hợp liên kết đặt lịch Treatwell
Khi khách hàng nhận được đường dẫn đặt lịch Treatwell (ví dụ: `https://widget.treatwell.de/...`), chỉ cần mở tệp `js/main.js` và thay đổi dòng số 19:
```javascript
// Trước:
const BOOKING_URL = '#';

// Sau:
const BOOKING_URL = 'https://widget.treatwell.de/de/bamboo-spa-zwickau/';
```
Tất cả các nút `"Termin buchen"` trên toàn bộ trang web sẽ tự động chuyển hướng đến Treatwell.

### 4.2. Cập nhật Số điện thoại
Khi chủ tiệm có số điện thoại chính thức, mở các tệp HTML (`index.html`, `contact.html`, v.v.) và bổ sung vào khối liên hệ:
```html
<a href="tel:+49123456789" class="contact-link">+49 (0) 123 456789</a>
```

### 4.3. Cập nhật Bảng giá dịch vụ
Bảng giá chính thức được đặt trong `treatments.html`; nội dung song ngữ tương ứng nằm trong `js/translations.js`.

### 4.4. Thay thế hình ảnh minh họa bằng ảnh thực tế
Lưu các hình ảnh chụp thực tế vào thư mục `assets/images/` với các tên tương ứng và cập nhật thuộc tính `src` trong các tệp HTML.

---

## 5. Bản quyền
© 2026 Bamboo Spa. Alle Rechte vorbehalten.

