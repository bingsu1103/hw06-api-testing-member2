# Kết quả Newman · Thành viên 2

Chạy ngày 25/11/2026 tại `http://127.0.0.1:3000` với header `X-Student-Id: 23120205`. SUT dùng commit `85af3ba875c88283615e22cb108f13e2fccaf0e9`.

| API | Case | Pass | Fail |
| --- | ---: | ---: | ---: |
| Đăng ký | 40 | 13 | 27 |
| Checkout | 40 | 2 | 38 |
| Admin đổi trạng thái đơn | 40 | 39 | 1 |
| Tổng | 120 | 54 | 66 |

Newman ghi nhận 600 HTTP request tính cả fixture và hậu điều kiện, 0 lỗi truyền tải, 298 assertion và 106 assertion fail. Một case có thể fail nhiều assertion. Kết quả chi tiết ghi mã case, HTTP status và tên assertion thất bại. [Dữ liệu kết quả](member2-results.json) · [Newman HTML](newman/report.html)
