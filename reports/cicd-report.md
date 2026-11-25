# CI/CD · Thành viên 2

Workflow `.github/workflows/api-tests.yml` dùng Node 22, npm ci và npm test, sau đó seed EShop theo commit đã khóa.

| Chế độ | Phạm vi |
| --- | --- |
| regression | Chạy lại 54 case đã pass trong kết quả full ghi nhận. Đây là chế độ mặc định cho push/PR thông thường. |
| baseline | Ba case REG-G-001, CHK-G-031, ORD-G-002 |
| demonstrate-failure | Cùng ba case, thay kỳ vọng HTTP của REG-G-001 để tạo đúng một assertion fail |
| full | Toàn bộ 120 case, tải HTML đã ẩn body và Authorization |

| Lượt chạy GitHub Actions | Commit public | Kết quả | Bằng chứng |
| --- | --- | --- | --- |
| [Regression](https://github.com/bingsu1103/hw06-api-testing-member2/actions/runs/45595451236) | `0b1cb8b` | 54 case, 108/108 assertion pass | [Ảnh](../evidence/screenshots/ci-regression.png) |
| [Baseline](https://github.com/bingsu1103/hw06-api-testing-member2/actions/runs/45592500000) | `3465cac` | 3 case, 6/6 assertion pass | [Ảnh](../evidence/screenshots/ci-baseline.png) |
| [Minh họa failure](https://github.com/bingsu1103/hw06-api-testing-member2/actions/runs/45592526384) | `98d5f27` | 3 case, đúng 1/6 assertion fail, exit 1 | [Ảnh](../evidence/screenshots/ci-failure-demo.png) |
| [Full](https://github.com/bingsu1103/hw06-api-testing-member2/actions/runs/45592636406) | `3465cac` | 120 case, 106/298 assertion fail, exit 1 | [Ảnh](../evidence/screenshots/ci-full.png) |

Baseline và bản minh họa có thể chạy bằng `./scripts/run-newman.sh baseline` và `./scripts/run-newman.sh demonstrate-failure`. Baseline là tập con có một case cho mỗi API đích. Kết quả CI xanh cho toàn bộ 120 case chưa đạt trên SUT gốc. Lượt full đã tải lên artifact `member2-newman-report`.

Chạy lại tập regression bằng `./scripts/run-newman.sh regression`. Bộ này giữ các assertion gốc. Phần 66 case fail vẫn có trong chế độ full và báo cáo Newman.
