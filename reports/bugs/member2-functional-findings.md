# Sai lệch chức năng · Thành viên 2

Các kiểm tra chạy trên bản EShop local có fixture riêng. Đối chiếu số liệu tại [Newman HTML](../newman/report.html) và [kết quả theo mã case](../member2-results.json).

| Mã | API và mức độ | Case đại diện | Kỳ vọng | Quan sát |
| --- | --- | --- | --- | --- |
| M2-01 | Đăng ký · Cao | REG-E-001 | Email đã đăng ký bị từ chối theo FR-01 | Hai lượt đăng ký cùng email đều trả 200 |
| M2-02 | Đăng ký · Cao | REG-G-012, REG-G-025 | Mật khẩu đủ độ mạnh và email đúng định dạng theo FR-01 | Body với mật khẩu bảy ký tự hoặc email thiếu @ vẫn trả 200 |
| M2-03 | Đăng ký · Trung bình | REG-G-029, REG-G-030 | Họ tên là trường bắt buộc theo FR-01 | Tên rỗng hoặc thiếu tên vẫn trả 200 |
| M2-04 | Checkout · Cao | CHK-G-020 | Tổng tiền lưu bằng tổng giỏ hàng theo FR-08 | Đơn tạo thành công nhưng tổng tiền không bằng tổng giỏ khi bỏ trường tổng tiền client |
| M2-05 | Checkout · Cao | CHK-G-021 | Giỏ hàng trống sau checkout thành công theo FR-08 | Đơn được tạo nhưng giỏ vẫn còn sản phẩm |
| M2-06 | Admin đổi trạng thái · Cao | ORD-G-024 | Đơn đã hủy giữ nguyên trạng thái kết thúc theo FR-10 | API trả 200 và báo cập nhật thành công |

Các kỳ vọng về địa chỉ trống, giỏ trống và xác nhận mật khẩu ở tầng API được ghi là giả định kiểm thử khi đặc tả API chưa quy định đầy đủ.

| Mã | GitHub Issue | Ảnh assertion Newman |
| --- | --- | --- |
| M2-01 | [#1](https://github.com/bingsu1103/hw06-api-testing-member2/issues/1) | [PNG](../../evidence/screenshots/M2-01.png) |
| M2-02 | [#2](https://github.com/bingsu1103/hw06-api-testing-member2/issues/2) | [PNG](../../evidence/screenshots/M2-02.png) |
| M2-03 | [#3](https://github.com/bingsu1103/hw06-api-testing-member2/issues/3) | [PNG](../../evidence/screenshots/M2-03.png) |
| M2-04 | [#4](https://github.com/bingsu1103/hw06-api-testing-member2/issues/4) | [PNG](../../evidence/screenshots/M2-04.png) |
| M2-05 | [#5](https://github.com/bingsu1103/hw06-api-testing-member2/issues/5) | [PNG](../../evidence/screenshots/M2-05.png) |
| M2-06 | [#6](https://github.com/bingsu1103/hw06-api-testing-member2/issues/6) | [PNG](../../evidence/screenshots/M2-06.png) |
