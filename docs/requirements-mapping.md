# Phạm vi thành viên 2

Theo hàng số 2 của bảng phân công, bộ test bao gồm Đăng ký FR-01, Checkout FR-08 và Admin đổi trạng thái đơn FR-18, với các chuyển trạng thái của FR-10. Login, Cart, Products và lịch sử đơn chỉ phục vụ tạo dữ liệu hoặc kiểm tra hậu điều kiện.

| Yêu cầu | Artifact |
| --- | --- |
| Thiết kế dữ liệu kiểm thử | `data/member2-cases.mjs`, Postman collection và workbook |
| Thực thi và đối chiếu | Newman HTML, `reports/member2-results.json`, báo cáo kỹ thuật |
| Lỗi chức năng | `reports/bugs/member2-functional-findings.md` |
| CI | `.github/workflows/api-tests.yml`, `reports/cicd-report.md` |
| Chứng cứ và phần sinh viên hoàn thiện | `evidence/README.md` |
