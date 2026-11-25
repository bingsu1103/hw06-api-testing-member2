# CI/CD · Thành viên 2

Workflow `.github/workflows/api-tests.yml` dùng Node 22, npm ci và npm test, sau đó seed EShop theo commit đã khóa.

| Chế độ | Phạm vi |
| --- | --- |
| baseline | Ba case REG-G-001, CHK-G-031, ORD-G-002 |
| demonstrate-failure | Cùng ba case, thay kỳ vọng HTTP của REG-G-001 để tạo đúng một assertion fail |
| full | Toàn bộ 120 case, tải HTML đã ẩn body và Authorization |

Hai chế độ đầu có thể chạy bằng `./scripts/run-newman.sh baseline` và `./scripts/run-newman.sh demonstrate-failure`. Bài yêu cầu CI xanh cho toàn bộ suite. Điều kiện đó chưa đạt trên SUT gốc. Repo hiện tại chưa có remote, nên chưa có run URL, ảnh Actions hay hai commit public tương ứng.

Kiểm chứng local ngày 25/11/2026. Baseline pass 6/6 assertion. Bản minh họa có 5/6 assertion pass và trả mã thoát 1.
