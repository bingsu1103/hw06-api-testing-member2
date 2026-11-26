# Bản EShop sửa lỗi phục vụ kiểm thử lại

Bản gốc ghim tại commit EShop `85af3ba875c88283615e22cb108f13e2fccaf0e9`. Chế độ mặc định `full` tiếp tục kiểm thử bản gốc và xuất bằng chứng lỗi. Chế độ `full-remediated` áp patch vào một bản sao riêng dưới `.cache/eshop-sut-remediated`, dựng lại dữ liệu fixture và dùng nguyên collection để kiểm thử lại.

| Phạm vi | Thay đổi |
| --- | --- |
| Đăng ký | Kiểm tra trường bắt buộc, định dạng email, tính duy nhất và độ mạnh mật khẩu. So khớp mật khẩu xác nhận khi client gửi. Hash mật khẩu bằng scrypt với salt riêng. |
| Checkout | Tính tổng từ giá sản phẩm phía server và số lượng trong giỏ. Yêu cầu địa chỉ hợp lệ và giỏ có sản phẩm. Xóa các dòng đã đặt sau khi đơn được lưu thành công. |
| Admin cập nhật trạng thái | Kiểm tra vai trò admin và giữ trạng thái hủy ở trạng thái kết thúc. Bảo vệ cập nhật đồng thời bằng điều kiện trạng thái hiện tại. |

Yêu cầu có địa chỉ và giỏ không rỗng được chọn làm giả định cho bản sửa nhằm kiểm thử lại các case khám phá tương ứng. Full green xác nhận 120 case hiện có trên bản sửa, không xác nhận tính phù hợp của giả định với mọi triển khai EShop. Kết quả nguyên bản 54 pass và 66 fail vẫn là bằng chứng của bài. Bản sửa phục vụ lab và không phải bản vá bảo mật toàn hệ thống.

```bash
./scripts/run-newman.sh full-remediated
node scripts/summarize-newman.mjs reports/newman/remediated/run.json reports/member2-remediated-results.json
```

Khi dùng bằng chứng CI để chấm, ghi rõ nền tảng là bản SUT sửa lỗi và đối chiếu với tiêu chí của giảng viên.
