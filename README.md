# Equipment Management System 🏢
## Hệ thống Quản lý Thiết bị

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey.svg)](https://expressjs.com/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-red.svg)](https://www.microsoft.com/sql-server)

Hệ thống quản lý thiết bị là một ứng dụng web full-stack hiện đại được xây dựng để giúp các tổ chức quản lý và theo dõi thiết bị, bảo trì, yêu cầu sửa chữa và báo cáo một cách hiệu quả.

## 🚀 Tính năng chính

- 🖥️ **Quản lý thiết bị**: Thêm, sửa, xóa và theo dõi thông tin thiết bị
- 🔧 **Quản lý bảo trì**: Lập lịch và theo dõi các hoạt động bảo trì
- 📋 **Xử lý yêu cầu**: Quản lý các yêu cầu sửa chữa và hỗ trợ  
- 📊 **Báo cáo**: Tạo và xuất báo cáo chi tiết (Excel)
- 👥 **Quản lý người dùng**: Hệ thống phân quyền Admin/User
- 🔐 **Xác thực an toàn**: Đăng nhập/đăng xuất với JWT
- 📧 **Email tích hợp**: Gửi thông báo và reset password
- 📈 **Dashboard**: Thống kê và phân tích trực quan

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18.3.1** với TypeScript
- **Vite** - Build tool nhanh và hiện đại
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Component library đẹp và tùy biến cao
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form handling
- **TanStack Query** - Data fetching và caching
- **Recharts** - Thư viện biểu đồ
- **Lucide React** - Icon library

### Backend
- **Node.js** với Express.js
- **SQL Server** - Relational database
- **JWT** - JSON Web Token authentication
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing
- **Excel4node** - Excel file generation

## 📦 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- SQL Server 2019 hoặc mới hơn
- npm hoặc yarn

### 1. Clone repository
```bash
git clone https://github.com/duongloc216/Management-Equipment.git
cd Management-Equipment
```

### 2. Install dependencies cho toàn bộ dự án
```bash
# Cài đặt concurrently để chạy cả server và client cùng lúc
npm install

# Cài đặt dependencies cho cả server và client
npm run install:all
```

### 3. Environment Setup
```bash
# Copy file cấu hình cho server
copy server\env.example server\.env

# Chỉnh sửa file server\.env với thông tin của bạn
```

#### Environment Variables (server/.env)
```env
# Database Configuration
DB_USER=your_sql_server_username
DB_PASSWORD=your_sql_server_password
DB_SERVER=your_sql_server_host
DB_DATABASE=equipment_management
DB_PORT=1433

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Chạy dự án
```bash
# Chạy cả server và client cùng lúc (recommended)
npm run dev

# Hoặc chạy riêng lẻ
# Terminal 1 - Server
npm run server:dev

# Terminal 2 - Client  
npm run client:dev
```

Sau khi chạy:
- Backend API: `http://localhost:5000`
- Frontend App: `http://localhost:5173`

## 📁 Cấu trúc dự án

```
Management-Equipment/
├── 📂 server/                      # Backend API (Node.js + Express)
│   ├── 📂 src/
│   │   ├── 📂 config/              # Cấu hình database và email
│   │   ├── 📂 controllers/         # Controllers xử lý logic API
│   │   ├── 📂 middleware/          # Middleware xác thực và ủy quyền
│   │   ├── 📂 models/              # Models tương tác với database
│   │   ├── 📂 routes/              # Định nghĩa API routes
│   │   └── 📄 app.js               # Khởi tạo Express app
│   ├── 📂 scripts/                 # Utility scripts
│   ├── 📄 server.js                # Entry point
│   ├── 📄 package.json
│   └── 📄 env.example              # Template file môi trường
├── 📂 client/                      # Frontend (React + TypeScript)
│   ├── 📂 src/
│   │   ├── 📂 components/          # React Components
│   │   │   ├── 📂 ui/              # Shadcn/ui components
│   │   │   ├── 📄 Layout.tsx       # Layout chính
│   │   │   ├── 📄 ProtectedRoute.tsx
│   │   │   └── 📄 ...Dialog.tsx    # Các dialog components
│   │   ├── 📂 pages/               # Page components
│   │   │   ├── 📄 Dashboard.tsx    # Trang chủ
│   │   │   ├── 📄 Equipment.tsx    # Quản lý thiết bị
│   │   │   ├── 📄 Maintenance.tsx  # Quản lý bảo trì
│   │   │   ├── 📄 Requests.tsx     # Quản lý yêu cầu
│   │   │   ├── 📄 Reports.tsx      # Báo cáo
│   │   │   └── 📄 Admin.tsx        # Trang admin
│   │   ├── 📂 contexts/            # React Context
│   │   ├── 📂 hooks/               # Custom hooks
│   │   ├── 📂 lib/                 # Utilities
│   │   └── 📄 main.tsx             # Entry point
│   ├── 📂 public/                  # Static assets
│   ├── 📄 package.json
│   ├── 📄 vite.config.ts
│   └── 📄 tailwind.config.ts
├── 📄 package.json                 # Root package.json với scripts
└── 📄 README.md                    # Documentation
```

## 🔗 API Endpoints

### 🔐 Authentication
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/user-info` - Lấy thông tin user hiện tại
- `POST /api/auth/change-password` - Đổi mật khẩu
- `POST /api/auth/forgot-password` - Quên mật khẩu (gửi email)

### 🖥️ Devices (Thiết bị)
- `GET /api/devices` - Lấy danh sách tất cả thiết bị
- `GET /api/devices/:id` - Lấy thông tin thiết bị theo ID
- `POST /api/devices` - Tạo thiết bị mới
- `PUT /api/devices/:id` - Cập nhật thông tin thiết bị
- `DELETE /api/devices/:id` - Xóa thiết bị
- `GET /api/devices/stats/overview` - Thống kê tổng quan thiết bị
- `GET /api/devices/stats/department` - Thống kê thiết bị theo phòng ban

### 📋 Requests (Yêu cầu sử dụng)
- `GET /api/requests` - Lấy danh sách tất cả yêu cầu
- `GET /api/requests/:id` - Lấy thông tin yêu cầu theo ID
- `POST /api/requests` - Tạo yêu cầu sử dụng mới
- `PUT /api/requests/:id` - Cập nhật trạng thái yêu cầu
- `DELETE /api/requests/:id` - Xóa yêu cầu
- `GET /api/requests/stats/monthly` - Thống kê số yêu cầu trong tháng

### 🔧 Maintenance (Bảo trì)
- `GET /api/maintenance` - Lấy danh sách tất cả lịch bảo trì
- `GET /api/maintenance/:id` - Lấy thông tin bảo trì theo ID
- `POST /api/maintenance` - Tạo lịch bảo trì mới
- `PUT /api/maintenance/:id` - Cập nhật thông tin bảo trì
- `DELETE /api/maintenance/:id` - Xóa lịch bảo trì
- `GET /api/maintenance/upcoming/list` - Danh sách bảo trì sắp tới
- `GET /api/maintenance/overdue/list` - Danh sách bảo trì quá hạn

### 👥 Users (Quản lý người dùng) - Admin only
- `GET /api/users` - Lấy danh sách tất cả người dùng
- `GET /api/users/:email` - Lấy thông tin người dùng theo email
- `POST /api/users` - Tạo người dùng mới
- `PUT /api/users/:email` - Cập nhật thông tin người dùng
- `DELETE /api/users/:email` - Xóa người dùng
- `GET /api/users/stats/overview` - Thống kê người dùng

### 📊 Reports (Báo cáo) - Admin only
- `GET /api/reports/overview` - Tổng quan báo cáo hệ thống
- `GET /api/reports/export?type=devices|requests|maintenance` - Xuất báo cáo Excel
- `GET /api/reports/logs` - Xem logs hoạt động hệ thống

## 🎨 Giao diện người dùng

### Dashboard
- 📈 Thống kê tổng quan (tổng số thiết bị, yêu cầu, bảo trì)
- 📊 Biểu đồ phân tích theo thời gian
- 🔔 Thông báo bảo trì sắp tới và quá hạn
- 📋 Danh sách hoạt động gần đây

### Quản lý thiết bị
- 📝 Thêm/sửa/xóa thiết bị
- 🔍 Tìm kiếm và lọc thiết bị
- 📊 Thống kê thiết bị theo trạng thái
- 🏷️ Quản lý theo danh mục và phòng ban

### Quản lý yêu cầu
- 📋 Tạo yêu cầu sử dụng thiết bị
- ✅ Duyệt/từ chối yêu cầu (Admin)
- 📊 Theo dõi trạng thái yêu cầu
- 📧 Thông báo email tự động

### Quản lý bảo trì
- 📅 Lập lịch bảo trì định kỳ
- 🔔 Cảnh báo bảo trì sắp tới/quá hạn
- 📝 Ghi chú và báo cáo bảo trì
- 📊 Thống kê chi phí bảo trì

## 🚦 Scripts có sẵn

### Root Project
```bash
npm run dev              # Chạy cả server và client cùng lúc
npm run start            # Chạy production cho cả server và client
npm run build            # Build client cho production
npm run install:all      # Cài đặt dependencies cho cả server và client
npm run install:server   # Cài đặt dependencies cho server
npm run install:client   # Cài đặt dependencies cho client
```

### Server (Backend)
```bash
npm run server:dev       # Chạy server development với nodemon
npm run server:start     # Chạy server production
cd server && npm test    # Chạy tests cho server
```

### Client (Frontend)
```bash
npm run client:dev       # Chạy client development server (http://localhost:5173)
npm run client:build     # Build client cho production
npm run client:start     # Preview production build
cd client && npm run lint # Kiểm tra code style với ESLint
```

## 👥 Phân quyền người dùng

### 🔧 User (Người dùng thường)
- Xem danh sách thiết bị
- Tạo yêu cầu sử dụng thiết bị
- Xem lịch bảo trì
- Cập nhật thông tin cá nhân
- Xem báo cáo cá nhân

### 👑 Admin (Quản trị viên)
- Tất cả quyền của User
- Quản lý người dùng (CRUD)
- Quản lý thiết bị (CRUD)
- Duyệt/từ chối yêu cầu
- Quản lý lịch bảo trì
- Xem báo cáo tổng quan
- Xuất báo cáo Excel
- Xem logs hệ thống

## 🗃️ Database Schema

Hệ thống sử dụng SQL Server với các bảng chính:

### Users
- `email` (PK) - Email người dùng
- `full_name` - Họ tên
- `password` - Mật khẩu (đã hash)
- `role` - Vai trò (admin/user)
- `department` - Phòng ban
- `created_at` - Ngày tạo

### Devices
- `device_id` (PK) - ID thiết bị
- `device_name` - Tên thiết bị
- `category` - Danh mục
- `status` - Trạng thái
- `department` - Phòng ban quản lý
- `purchase_date` - Ngày mua
- `warranty_expiry` - Hết hạn bảo hành

### Requests
- `request_id` (PK) - ID yêu cầu
- `user_email` (FK) - Email người yêu cầu
- `device_id` (FK) - ID thiết bị
- `request_type` - Loại yêu cầu
- `status` - Trạng thái
- `created_at` - Ngày tạo

### Maintenance
- `maintenance_id` (PK) - ID bảo trì
- `device_id` (FK) - ID thiết bị
- `maintenance_type` - Loại bảo trì
- `scheduled_date` - Ngày dự kiến
- `status` - Trạng thái
- `cost` - Chi phí

## 🛡️ Bảo mật

- **JWT Authentication**: Xác thực người dùng với token
- **Password Hashing**: Mã hóa mật khẩu với bcrypt
- **CORS Protection**: Bảo vệ cross-origin requests
- **Input Validation**: Kiểm tra dữ liệu đầu vào
- **Role-based Access**: Phân quyền theo vai trò
- **Error Handling**: Xử lý lỗi an toàn

## 📧 Tích hợp Email

Hệ thống gửi email tự động cho:
- 🔑 Reset mật khẩu
- ✅ Thông báo duyệt/từ chối yêu cầu
- 🔔 Nhắc nhở bảo trì sắp tới
- ⚠️ Cảnh báo thiết bị quá hạn bảo hành

## 🚀 Deployment

### Development (Recommended)
```bash
# Chạy toàn bộ dự án với một lệnh
npm run dev
```
Lệnh này sẽ chạy đồng thời:
- Backend server trên `http://localhost:5000`
- Frontend development server trên `http://localhost:5173`

### Production
```bash
# Build frontend
npm run build

# Start cả server và client
npm run start
```

### Manual Development (nếu cần)
```bash
# Terminal 1 - Server
npm run server:dev

# Terminal 2 - Client  
npm run client:dev
```

## � Dọn dẹp và tối ưu

Dự án đã được dọn dẹp và loại bỏ các file không cần thiết:

### ✅ Đã loại bỏ:
- File README.md trùng lặp trong server/
- File .gitignore trùng lặp trong client/
- File bun.lockb (dự án sử dụng npm)
- File test-user-report.js (test script cũ)
- Package lovable-tagger không cần thiết

### ✅ Đã cập nhật:
- Tên package.json nhất quán
- License thống nhất (MIT)
- Author information

## �🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm thông tin.

## 📞 Liên hệ

- **Developer**: [duongloc216](https://github.com/duongloc216)
- **Repository**: [Management-Equipment](https://github.com/duongloc216/Management-Equipment)
- **Email**: your-email@example.com

## 🎯 Roadmap

- [ ] 🔔 Thêm tính năng thông báo real-time với WebSocket
- [ ] 📱 Phát triển mobile app với React Native
- [ ] 🔍 Tích hợp hệ thống quét QR code cho thiết bị
- [ ] 📊 Dashboard analytics nâng cao với AI/ML
- [ ] 🌐 Đa ngôn ngữ (i18n)
- [ ] 🐳 Docker containerization
- [ ] 📚 API documentation với Swagger
- [ ] 🧪 Unit tests và integration tests
- [ ] ☁️ Cloud deployment (AWS/Azure)
- [ ] 🔄 Backup và recovery system

## 🐛 Báo lỗi

Nếu bạn phát hiện lỗi, vui lòng tạo issue trên GitHub với thông tin:
- Mô tả lỗi chi tiết
- Các bước tái hiện
- Screenshots (nếu có)
- Thông tin môi trường (OS, Browser, Node version)

---

⭐ **Đừng quên star repository nếu dự án này hữu ích cho bạn!**

Made with ❤️ by [duongloc216](https://github.com/duongloc216)
