# Báo cáo kỹ thuật HW06 · Thành viên 2

Ngô Gia An · 23120205 · 25/11/2026

## Phạm vi

Hàng số 2 trong bảng phân công gồm FR-01 Đăng ký, FR-08 Checkout và FR-18 Admin đổi trạng thái đơn. API đích lần lượt là POST /api/register, POST /api/checkout và PUT /api/admin/orders/:id/status. FR-10 là nguồn quy tắc chuyển trạng thái. Các request lấy token, thêm giỏ và đọc lịch sử dùng trong fixture và hậu điều kiện.

## Thiết kế kiểm thử

Đăng ký bao phủ kiểu dữ liệu, trường bắt buộc, định dạng email, email trùng và biên độ dài mật khẩu. Checkout dùng giỏ riêng theo tài khoản, kiểm tra số lượng, địa chỉ, xác thực, tổng tiền từ giỏ và việc làm trống giỏ. API admin bao phủ ma trận 25 cặp chuyển trạng thái, miền giá trị status, ID đơn và trường hợp thiếu xác thực. Bộ test có 35 case nháp và 5 ứng viên mở rộng mỗi API. Các status lỗi không được đặc tả đầy đủ và các giả định đầu vào cần được đối chiếu trong phần đánh giá của sinh viên.

## Công cụ và kết quả

Postman dùng collection theo Pool, biến cấp collection và môi trường, script trước request, request phụ trợ và assertion sau response. Header X-Student-Id được gắn cho request đích và request phụ trợ. Newman chạy trên EShop local tại 127.0.0.1:3000 và xuất báo cáo HTML.

120 case đã thực thi. Đăng ký có 13 pass và 27 fail. Checkout có 2 pass và 38 fail. Admin đổi trạng thái đơn có 39 pass và 1 fail. Có 298 assertion với 106 thất bại và 0 lỗi truyền tải trên tổng số 600 HTTP request. Sáu nhóm sai lệch chức năng được ghi riêng theo mã case và yêu cầu tham chiếu.

## CI và chứng cứ

GitHub Actions có chế độ baseline gồm 3 case đại diện, chế độ minh họa một assertion thất bại và chế độ chạy đủ 120 case trên SUT thật. Baseline là tập con. Bộ đầy đủ hiện có lỗi chức năng. Ảnh console, URL và ảnh chạy GitHub Actions, GitHub Issues và các phần do sinh viên thực hiện được liệt kê trong evidence/README.md.

## Nguồn

Đề HW06 API Testing, bảng phân công thành viên 2 và đặc tả EShop từ https://github.com/ttbhanh/eshop-sut tại commit 85af3ba875c88283615e22cb108f13e2fccaf0e9.
