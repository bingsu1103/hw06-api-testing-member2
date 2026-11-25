# Đối chiếu phạm vi kiểm thử · Thành viên 2

Nguồn yêu cầu là EShop tại commit `85af3ba875c88283615e22cb108f13e2fccaf0e9`. Bảng dưới phân biệt bằng chứng Newman, rà soát mã nguồn và yêu cầu ngoài phạm vi. [Đặc tả nghiệp vụ](https://github.com/ttbhanh/eshop-sut/blob/85af3ba875c88283615e22cb108f13e2fccaf0e9/README.md) · [Đặc tả API](https://github.com/ttbhanh/eshop-sut/blob/85af3ba875c88283615e22cb108f13e2fccaf0e9/api_specification.md)

| Yêu cầu | Áp dụng cho thành viên 2 | Bằng chứng và giới hạn |
| --- | --- | --- |
| SEC-01 · Lưu mật khẩu an toàn | Đăng ký | Rà soát mã nguồn ghi nhận đường lưu mật khẩu ở dạng rõ. Newman kiểm tra phản hồi đăng ký không trả trường mật khẩu. Hai kiểm tra đo hai thuộc tính khác nhau. |
| SEC-02 · JWT hợp lệ | Checkout, đổi trạng thái đơn | Newman có case thiếu xác thực trên cả hai API và token không hợp lệ ở Checkout. Rà soát mã nguồn cho thấy hai API dùng middleware xác thực JWT. |
| SEC-03 · Quyền admin | Đổi trạng thái đơn | Rà soát mã nguồn ghi nhận route dùng middleware xác thực chung và thiếu bước xác minh vai trò admin. Đây là nhận xét tĩnh. |
| SEC-04 · Escape dữ liệu trên UI | Giao diện hiển thị dữ liệu người dùng | Cần suite giao diện riêng để xác nhận cách trang render. JSON hợp lệ không chứng minh thuộc tính này. |
| SEC-05 · Truy vấn tham số hóa | Cả ba API | Rà soát câu truy vấn trong ba handler đích cho thấy giá trị được truyền qua tham số. Kết luận chỉ áp dụng cho các truy vấn đã xem. |
| SEC-06 · Khóa thay đổi vai trò qua hồ sơ | API hồ sơ | Ngoài ba API được phân công. |
| SEC-07 · Vòng đời OTP | API quên/đặt lại mật khẩu | Ngoài ba API được phân công. |

Nguồn rà soát tĩnh: [EShop backend tại commit ghim](https://github.com/ttbhanh/eshop-sut/blob/85af3ba875c88283615e22cb108f13e2fccaf0e9/backend/server.js).

## Kỳ vọng và giả định

| Chủ đề | Căn cứ | Cách đọc kết quả |
| --- | --- | --- |
| Register thành công | Đặc tả API nêu HTTP 200 với `message` và `id`. | Assert hai field và kiểu giá trị. |
| Email duy nhất, hợp lệ và mật khẩu mạnh | FR-01 | Dùng miền HTTP 4xx cho dữ liệu bị từ chối khi API không quy định một mã cụ thể. |
| `confirmPassword` | FR-01 nêu hành vi xác nhận. API spec chỉ liệt kê `name`, `email`, `password`. | Case có trường xác nhận là giả định về hợp đồng tầng API. |
| Checkout | FR-08 yêu cầu tổng từ giỏ và xóa giỏ sau khi đặt hàng. | Kiểm tra tổng được lưu, trạng thái pending và giỏ sau checkout. Tên field của response thành công là hợp đồng quan sát được, do API spec không có mẫu response. |
| Địa chỉ rỗng/sai kiểu, giỏ rỗng | API spec có địa chỉ mẫu nhưng thiếu quy tắc validation chi tiết. | Kết quả được ghi nhận như kiểm thử khám phá. |
| Trạng thái đơn | FR-10 và FR-18 | Ma trận 25 cặp dựa vào sơ đồ nghiệp vụ. Mã lỗi chính xác và cấu trúc `error` là kỳ vọng kiểm thử, không được mô tả đầy đủ trong API spec. |

Các phát hiện tĩnh không cộng vào số lỗi xác nhận qua Newman. Bảng này là truy vết kỹ thuật theo yêu cầu, chưa thay cho phần sinh viên đánh giá từng case.
