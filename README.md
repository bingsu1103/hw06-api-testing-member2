# HW06 API Testing · Thành viên 2

Ngô Gia An · 23120205

| Pool | Phân công | API kiểm thử |
| --- | --- | --- |
| A | FR-01 Đăng ký | `POST /api/register` |
| B | FR-08 Checkout | `POST /api/checkout` |
| C | FR-18 / FR-10 Cập nhật trạng thái đơn | `PUT /api/admin/orders/:id/status` |

Mỗi API có 35 case nháp và 5 case mở rộng đề xuất. Newman đã chạy 120 case, 54 pass và 66 fail. Sáu nhóm sai lệch chức năng được mô tả trong bảng kết quả lỗi. [Tổng kết thực thi](reports/execution-summary.md) · [Báo cáo kỹ thuật](reports/main-report.md) · [Newman HTML](reports/newman/report.html)

```bash
npm ci
npm test
npm run generate
./scripts/run-newman.sh
node scripts/summarize-newman.mjs
```

Runner dùng bản EShop seed mới tại `127.0.0.1:3000`. Chế độ `baseline` chạy 3 case chọn lọc và `demonstrate-failure` minh họa một lỗi assertion. [Báo cáo CI](reports/cicd-report.md)

| Tiêu chí | Tối đa | Tự chấm |
| --- | ---: | --- |
| API 1 | 30 | Chờ sinh viên |
| API 2 | 30 | Chờ sinh viên |
| API 3 | 30 | Chờ sinh viên |
| Agent Skill | 10 | Chờ sinh viên |
| Tổng | 100 | Chờ sinh viên |

Phần AI audit, AI report và prompt AI do sinh viên thực hiện. [Checklist bằng chứng](evidence/README.md) · [Commit log](reports/git-commit-log.txt)

[Repository nộp bài](https://github.com/bingsu1103/hw06-api-testing-member2)
