# Equipment Management System - Backend API

Backend API cho hệ thống quản lý thiết bị được xây dựng với Node.js, Express và SQL Server.

## Cấu trúc dự án

```
backend/
├── src/
│   ├── config/           # Cấu hình database và email
│   ├── controllers/      # Controllers xử lý logic
│   ├── middleware/       # Middleware xác thực
│   ├── models/          # Models tương tác với database
│   ├── routes/          # Định nghĩa routes
│   └── app.js           # Khởi tạo Express app
├── server.js            # Khởi động server
├── package.json
└── README.md
```

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` với các biến môi trường:
```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SERVER=your_db_server
DB_DATABASE=your_db_name
DB_PORT=1433
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
PORT=5000
```

3. Khởi động server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/user-info` - Lấy thông tin user
- `POST /api/auth/change-password` - Đổi mật khẩu
- `POST /api/auth/forgot-password` - Quên mật khẩu

### Devices (Thiết bị)
- `GET /api/devices` - Lấy tất cả thiết bị
- `GET /api/devices/:id` - Lấy thiết bị theo ID
- `POST /api/devices` - Tạo thiết bị mới
- `PUT /api/devices/:id` - Cập nhật thiết bị
- `DELETE /api/devices/:id` - Xóa thiết bị
- `GET /api/devices/stats/overview` - Thống kê thiết bị
- `GET /api/devices/stats/department` - Thống kê theo phòng ban

### Requests (Yêu cầu)
- `GET /api/requests` - Lấy tất cả yêu cầu
- `GET /api/requests/:id` - Lấy yêu cầu theo ID
- `POST /api/requests` - Tạo yêu cầu mới
- `PUT /api/requests/:id` - Cập nhật yêu cầu
- `DELETE /api/requests/:id` - Xóa yêu cầu
- `GET /api/requests/stats/monthly` - Số yêu cầu tháng này

### Maintenance (Bảo trì)
- `GET /api/maintenance` - Lấy tất cả bảo trì
- `GET /api/maintenance/:id` - Lấy bảo trì theo ID
- `POST /api/maintenance` - Tạo bảo trì mới
- `PUT /api/maintenance/:id` - Cập nhật bảo trì
- `DELETE /api/maintenance/:id` - Xóa bảo trì
- `GET /api/maintenance/upcoming/list` - Bảo trì sắp tới
- `GET /api/maintenance/overdue/list` - Bảo trì quá hạn

### Users (Người dùng) - Admin only
- `GET /api/users` - Lấy tất cả người dùng
- `GET /api/users/:email` - Lấy thông tin người dùng
- `POST /api/users` - Tạo người dùng mới
- `PUT /api/users/:email` - Cập nhật người dùng
- `DELETE /api/users/:email` - Xóa người dùng
- `GET /api/users/stats/overview` - Thống kê người dùng

### Reports (Báo cáo) - Admin only
- `GET /api/reports/overview` - Tổng quan báo cáo
- `GET /api/reports/export?type=...` - Xuất báo cáo Excel
- `GET /api/reports/logs` - Logs hệ thống

## Tính năng

- **Authentication & Authorization**: Xác thực người dùng và phân quyền admin
- **CRUD Operations**: Đầy đủ các thao tác CRUD cho tất cả entities
- **Email Integration**: Gửi email thông báo và reset password
- **Excel Export**: Xuất báo cáo ra file Excel
- **Statistics**: Thống kê và báo cáo chi tiết
- **Logging**: Ghi log các hoạt động của người dùng
- **Error Handling**: Xử lý lỗi toàn diện
- **Database Connection Pool**: Tối ưu kết nối database

## Database Schema

Đảm bảo database có các bảng sau:
- `Users` - Thông tin người dùng
- `Devices` - Thông tin thiết bị
- `Requests` - Yêu cầu sử dụng
- `Maintenance` - Lịch bảo trì
- `Logs` - Log hoạt động

## Middleware

- **CORS**: Cho phép cross-origin requests
- **Authentication**: Kiểm tra xác thực người dùng
- **Authorization**: Kiểm tra quyền admin
- **Error Handling**: Xử lý lỗi toàn cục

## Development

Để phát triển, sử dụng:
```bash
npm run dev
```

Server sẽ chạy trên `http://localhost:5000` với hot reload. 