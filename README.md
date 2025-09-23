<div align="center">

# AI Online Learning Platform

AI-powered SaaS platform that lets users instantly generate structured courses (outline, chapters, topics, HTML content, banner image, related YouTube videos) using LLM + Image generation + dynamic enrichment. Built with Next.js App Router, Clerk authentication, Neon serverless Postgres, Drizzle ORM, TailwindCSS, Radix UI primitives, and Google Gemini API.

_English & Vietnamese (Song ngữ) Documentation_

</div>

---

## 1. Overview / Tổng quan

### English
This project is a mini SaaS that demonstrates how AI can automate instructional design workflows. A user submits high-level course parameters (title, level, number of chapters, include video?). The system:
1. Uses a Gemini model to generate a normalized JSON course layout.
2. Generates a banner illustration prompt → sends to external image generation API (Flux model via `aigurulab.tech`).
3. Persists metadata to Neon Postgres through Drizzle ORM.
4. Lets the user optionally edit chapters (future extension point).
5. For each chapter, calls Gemini again to expand topics into rich HTML content (single quotes enforced inside HTML to keep JSON valid).
6. Fetches  related YouTube videos per chapter topic via YouTube Data API.
7. Stores final `courseContent` as JSON for consumption in the learner UI.

The platform also includes an enrollment flow, subscription gating (free users limited to 1 generated course), and learning progress scaffolding (`completedChapters` field prepared for tracking).

### Tiếng Việt
Dự án này là một mini SaaS minh họa cách AI tự động hoá quy trình thiết kế khóa học. Người dùng nhập các tham số cơ bản (tên khóa học, cấp độ, số chương, có kèm video?). Hệ thống sẽ:
1. Gọi mô hình Gemini để sinh JSON layout khóa học chuẩn hoá.
2. Sinh prompt ảnh banner → gửi API tạo ảnh (Flux model qua `aigurulab.tech`).
3. Lưu metadata vào Postgres (Neon) thông qua Drizzle ORM.
4. Cho phép (mở rộng trong tương lai) chỉnh sửa chương trước khi tạo nội dung chi tiết.
5. Với mỗi chương, gọi lại Gemini để mở rộng từng topic thành nội dung HTML (dùng dấu nháy đơn trong HTML để JSON hợp lệ).
6. Lấy danh sách video YouTube liên quan theo tên chương/chủ đề qua YouTube Data API.
7. Lưu `courseContent` (JSON) để hiển thị trong UI học tập.

Nền tảng còn có luồng ghi danh khóa học, giới hạn theo gói (user free chỉ tạo được 1 khóa), và cấu trúc để theo dõi tiến độ (`completedChapters`).

---

## 2. Key Features / Tính năng chính

| English | Tiếng Việt |
|---------|-----------|
| AI-generated course outline (chapters, topics, durations) | Sinh outline khóa học bằng AI (chương, chủ đề, thời lượng) |
| Automatic banner image generation via external image API | Tự động tạo ảnh banner qua API tạo ảnh |
| Chapter-level content expansion to structured HTML | Sinh nội dung HTML chi tiết theo từng chương |
| YouTube video enrichment for each chapter | Bổ sung video YouTube liên quan cho mỗi chương |
| Secure auth & session management with Clerk | Xác thực bảo mật với Clerk |
| Subscription gating (free vs premium plan) | Giới hạn theo gói miễn phí / trả phí |
| Enrollment flow & duplicate enrollment protection | Luồng ghi danh & chống ghi danh trùng |
| Serverless Postgres (Neon) + Drizzle schema-first ORM | Postgres serverless (Neon) + Drizzle ORM |
| Modular Next.js App Router architecture | Kiến trúc module với Next.js App Router |
| Radix UI + Tailwind utility-based styling | Giao diện Radix UI + Tailwind |
| Toast notifications (`sonner`) | Thông báo toast (`sonner`) |
| Extensible data model for progress tracking | Mô hình dữ liệu dễ mở rộng để theo dõi tiến độ |

---

## 3. Architecture / Kiến trúc

### 3.1 SaaS High-Level (from provided diagram) / Tổng quan SaaS
English: Authentication & subscription gating sit in the application layer. After a user authenticates via Clerk, profile/email is persisted to `users` table. Subscription state (checked via `auth().has({plan: 'started'})`) controls whether the user can create more than one course.

Tiếng Việt: Lớp ứng dụng gồm xác thực và kiểm tra gói. Sau khi user đăng nhập qua Clerk, thông tin email được lưu vào bảng `users`. Trạng thái gói (kiểm tra bằng `auth().has({plan: 'started'})`) quyết định quyền tạo thêm khóa học.

### 3.2 Course Enrollment Flow / Luồng ghi danh
1. User clicks Enroll → API `/api/enroll-course` (POST)
2. Check if already enrolled (`enrollCourseTable`)
3. If not exists → insert enrollment record
4. Redirect to course learning page

Tiếng Việt: Người dùng nhấn Ghi danh → kiểm tra đã tồn tại trong `enrollCourseTable` chưa; nếu chưa thì thêm bản ghi rồi chuyển hướng đến trang học.

### 3.3 AI Course Generation Flow / Quy trình sinh khóa học bằng AI
Step-by-step corresponds to last diagram: user input → Gemini outline → image prompt → banner image API → save draft → (optional edit) → per-chapter Gemini content generation → YouTube enrichment → final persistence.

### 3.4 Data Persistence Layer / Tầng lưu trữ
Serverless driver `@neondatabase/serverless` feeds into Drizzle ORM (`neon-http`). Each request handler (in `app/api/*`) performs concise queries using Drizzle composable query builders.

### 3.5 Security / Bảo mật
Protected routes guarded by `middleware.js` using `clerkMiddleware`. Public routes: `/`, `/sign-in`, `/sign-up`. All API routes require auth.

---

## 4. Tech Stack & Libraries / Công nghệ & Thư viện

### Core
- Language / Ngôn ngữ: **TypeScript + JavaScript (ESNext)**
- Framework: **Next.js 15 (App Router)**
- UI: **React 19**, **TailwindCSS v4**, **Radix UI Primitives**
- Icons: **lucide-react**
- Auth: **Clerk** (`@clerk/nextjs`)
- Database: **PostgreSQL (Neon serverless)**
- ORM: **Drizzle ORM + drizzle-kit** for type-safe schema & migrations
- AI LLM: **Google Gemini** via `@google/genai`
- Image Generation: External API (`https://aigurulab.tech/api/generate-image` with `flux` model)
- Video Enrichment: **YouTube Data API v3**

### Supporting Libraries (Usage) / Thư viện hỗ trợ (Mục đích)
- `axios`: HTTP requests to external AI/Image/YouTube APIs
- `uuid`: Generate unique course IDs (`cid`)
- `sonner`: Toast notifications
- `class-variance-authority`, `clsx`, `tailwind-merge`: Conditional & consistent styling patterns
- `@radix-ui/react-*`: Accessible UI primitives (dialog, select, accordion, tooltip, switch, progress, etc.)
- `react-youtube`: Embed YouTube video players
- `mime`: (Support for file type handling if extended) / xử lý MIME (dự phòng mở rộng)
- `dotenv`: Load environment variables (deployment/build pipeline)

### Dev / Development
- `drizzle-kit`: Generate & push SQL migrations
- `tsx`: Fast TypeScript execution in tooling scripts
- `typescript`: Static typing
- `tw-animate-css`: Animations utilities

---

## 5. Data Model / Mô hình dữ liệu

| Table | Fields | Description (EN) | Mô tả (VI) |
|-------|--------|------------------|------------|
| `users` | `id`, `name`, `email (unique)`, `subscriptionId` | Registered user profile; `subscriptionId` placeholder for plan linkage | Thông tin người dùng; `subscriptionId` dự phòng liên kết gói |
| `courses` | `id`, `cid (uuid)`, `name`, `description`, `noOfChapters`, `includeVideo`, `level`, `category`, `courseJson`, `bannerImageUrl`, `courseContent`, `userEmail` | Generated course & final content JSON | Khóa học và nội dung cuối ở dạng JSON |
| `enrollCourse` | `id`, `cid`, `userEmail`, `completedChapters` | Enrollment mapping + progress structure | Liên kết ghi danh + cấu trúc tiến độ |

`courseJson` stores the raw outline returned from first Gemini call; `courseContent` is an array of objects: `{ youtubeVideo: [...], courseData: { chapterName, topics:[{topic, content(html)}] } }`.

---

## 6. API Endpoints / Các endpoint API

| Method & Path | Purpose (EN) | Mục đích (VI) |
|---------------|--------------|---------------|
| `POST /api/user` | Upsert user on first login | Thêm user lần đầu |
| `GET /api/courses?courseId=...` | Get course by `cid`; if `courseId=0` list only courses with generated content; default: current user's courses | Lấy khóa học; 0 = tất cả khóa đã có content; mặc định: khóa của user |
| `POST /api/generate-course-layout` | Generate outline & banner image; enforce subscription rule | Sinh cấu trúc + ảnh banner; kiểm tra gói |
| `POST /api/generate-course-content` | Expand each chapter to HTML + retrieve YouTube videos | Sinh nội dung HTML + video liên quan |
| `POST /api/enroll-course` | Enroll current user if not already | Ghi danh nếu chưa tồn tại |
| `GET /api/enroll-course?courseId=...` | Get enrollment & course data for a specific `cid` or list all enrolled | Lấy thông tin ghi danh / danh sách |

Error handling: Each AI route sanitizes fenced code blocks (removes ```json) before `JSON.parse`. Fail-safe returns 500 with message if content absent.

---

## 7. AI Workflow Details / Chi tiết luồng AI

1. Prompt engineering: Strict JSON schema; instructs single quotes inside HTML to preserve JSON integrity.
2. Response normalization: Strip markdown fences, `trim()`, parse to JS object.
3. Image prompt usage: Takes `bannerImagePrompt` field → external API returns hosted image URL → stored in `bannerImageUrl`.
4. Secondary generation per chapter: Minimizes token usage vs generating entire course content at once.
5. YouTube enrichment: Query = chapterName (`q` param) limited to 4 results → store videoId + title.
6. Persistence: Partial save after layout generation enables incremental UX.
7. Extensibility: Could add caching, moderation filters, content versioning, or streaming.

---

## 8. Subscription Logic / Logic gói
English: Free users (no `has({plan:'started'})`) can only create one course (checked by counting existing `courses` for their email). Premium plan removes limit. Currently `subscriptionId` + Clerk billing integration can be extended.

Tiếng Việt: User free (không `has({plan:'started'})`) chỉ tạo được 1 khóa. Khi nâng cấp (plan `'started'`) giới hạn được gỡ bỏ. Có thể mở rộng thêm tích hợp thanh toán thực tế và đồng bộ `subscriptionId`.

---

## 9. Directory Structure (Excerpt) / Cấu trúc thư mục

```
app/
	api/
		generate-course-layout/route.jsx
		generate-course-content/route.jsx
		enroll-course/route.jsx
		courses/route.jsx
		user/route.jsx
	workspace/ _components/* (course creation, listing, enrollment UI)
	course/[courseId]/* (learning view components)
config/
	schema.js  (Drizzle table definitions)
	db.jsx      (Neon + Drizzle client)
components/ui/* (Radix-based reusable UI primitives)
context/* (React contexts: selected chapter, user details)
```

---

## 10. Environment Variables / Biến môi trường

| Variable | Purpose (EN) | Mục đích (VI) |
|----------|--------------|---------------|
| `DATABASE_URL` | Neon Postgres connection string | Chuỗi kết nối Postgres Neon |
| `GEMINI_API_KEY` | Google Gemini model API key | API key của Gemini |
| `AI_GURU_LAB_API` | Key for external image generation | API key tạo ảnh |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key | Key API YouTube |
| `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk auth keys | Khóa xác thực Clerk |
| (Optional billing) | Future: Stripe/other keys | Tương lai: Stripe / thanh toán |

Create a `.env.local` file:
```
DATABASE_URL=postgres://...
GEMINI_API_KEY=xxx
AI_GURU_LAB_API=xxx
YOUTUBE_API_KEY=xxx
CLERK_PUBLISHABLE_KEY=xxx
CLERK_SECRET_KEY=xxx
```

---

## 11. Setup & Run / Cài đặt & Chạy

### English
```
git clone <repo>
cd AI-Online-Learning-Platform
npm install
cp .env.example .env.local  # (create if needed)
# Fill environment variables

# (Optional) Generate migrations if schema changed
npx drizzle-kit generate
npx drizzle-kit push

npm run dev
```
Visit: `http://localhost:3000`

### Tiếng Việt
```
git clone <repo>
cd AI-Online-Learning-Platform
npm install
cp .env.example .env.local  # (tạo file nếu chưa có)
# Điền các biến môi trường

# (Tuỳ chọn) Sinh & apply migration nếu đổi schema
npx drizzle-kit generate
npx drizzle-kit push

npm run dev
```
Truy cập: `http://localhost:3000`

---

## 12. Example API Usage / Ví dụ gọi API

```bash
curl -X POST http://localhost:3000/api/generate-course-layout \
	-H "Content-Type: application/json" \
	-d '{
		"courseId":"<uuid>",
		"name":"Intro to UX",
		"description":"Learn fundamentals",
		"includeVideo":true,
		"noOfChapters":3,
		"level":"Beginner",
		"category":"Design"
	}'
```

---

## 13. Possible Enhancements / Hướng phát triển

| English | Tiếng Việt |
|---------|-----------|
| Chapter progress tracking & analytics dashboard | Theo dõi tiến độ chi tiết + dashboard |
| Rich editor for manual chapter edits | Trình soạn thảo chỉnh sửa nội dung |
| Content versioning / rollback | Phiên bản hóa & rollback |
| Streaming AI generation (edge runtime) | Streaming nội dung AI (edge runtime) |
| Caching of outline prompts to lower cost | Cache prompt để giảm chi phí |
| Multi-language content generation | Sinh nội dung đa ngôn ngữ |
| Payment integration (Stripe) | Tích hợp thanh toán (Stripe) |

---

## 14. Limitations / Giới hạn
English: Relies on external APIs (Gemini, image generation, YouTube). Latency can stack when generating many chapters sequentially. No retry/backoff logic yet. Basic subscription gating without real billing backend. Minimal error UI.

Tiếng Việt: Phụ thuộc API ngoài → độ trễ có thể tăng nếu nhiều chương. Chưa có logic retry. Giới hạn gói chỉ ở mức kiểm tra đơn giản, chưa tích hợp thanh toán. UI xử lý lỗi còn đơn giản.

---

## 15. License
Educational / personal demonstration project. Add an explicit LICENSE file if distributing broadly.

## 16. Author / Tác giả
- Developer: @lenguyentime16

Feel free to open issues or propose enhancements.

---

> If you build upon this project, crediting the original structure & idea is appreciated. / Nếu bạn phát triển tiếp, vui lòng ghi nguồn tham khảo.

