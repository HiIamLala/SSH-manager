# Xây dựng Hệ quản trị SSH Tập trung

# Công nghệ sử dụng

- Môi trường chạy NodeJS 10.x LTS: https://nodejs.org/en/download/
- Các Node module sử dụng: 
  + Socket.io: https://socket.io/
  + Ssh2.js: https://www.npmjs.com/package/ssh2
  + Xterm.js: https://xtermjs.org/

- FrontEnd và BackEnd được triển khai trên AWS
  + Tạo Lambda function và đẩy code lên cấu hình run enviroment NodeJS 10.x
  + Tạo API Gateway trỏ đến Lambda function.
  + Sửa Endpoint của FrontEnd trỏ tới API Gateway vừa tạo.
  + Upload FrontEnd lên AWS S3.
  + Setup để public bucket vừa upload.

