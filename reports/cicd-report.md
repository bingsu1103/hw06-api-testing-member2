# CI/CD · Thành viên 2

Workflow `.github/workflows/api-tests.yml` dùng Node 22, npm ci và npm test, sau đó seed EShop theo commit đã khóa.

| Chế độ | Phạm vi |
| --- | --- |
| regression | Chạy lại 54 case đã pass trong kết quả full ghi nhận. Đây là chế độ mặc định cho push/PR thông thường. |
| baseline | Ba case REG-G-001, CHK-G-031, ORD-G-002 |
| demonstrate-failure | Cùng ba case, thay kỳ vọng HTTP của REG-G-001 để tạo đúng một assertion fail |
| full | Toàn bộ 120 case, tải HTML đã ẩn body và Authorization |
| full-remediated | Cùng 120 case trên bản sao EShop đã sửa, tải HTML riêng đã ẩn body và Authorization |

| Lượt chạy GitHub Actions | Commit public | Kết quả | Bằng chứng |
| --- | --- | --- | --- |
| [Full trên bản sửa](https://github.com/bingsu1103/hw06-api-testing-member2/actions/runs/45778378537) | `6b14db7` | 120/120 case, 298/298 assertion pass | [Ảnh](../evidence/screenshots/ci-full-remediated.png) · [HTML chạy local](newman/remediated/report.html) |
| [Regression](https://github.com/bingsu1103/hw06-api-testing-member2/actions/runs/45595451236) | `0b1cb8b` | 54 case, 108/108 assertion pass | [Ảnh](../evidence/screenshots/ci-regression.png) |
| [Baseline](https://github.com/bingsu1103/hw06-api-testing-member2/actions/runs/45592500000) | `3465cac` | 3 case, 6/6 assertion pass | [Ảnh](../evidence/screenshots/ci-baseline.png) |
| [Minh họa failure](https://github.com/bingsu1103/hw06-api-testing-member2/actions/runs/45592526384) | `98d5f27` | 3 case, đúng 1/6 assertion fail, exit 1 | [Ảnh](../evidence/screenshots/ci-failure-demo.png) |
| [Full](https://github.com/bingsu1103/hw06-api-testing-member2/actions/runs/45592636406) | `3465cac` | 120 case, 106/298 assertion fail, exit 1 | [Ảnh](../evidence/screenshots/ci-full.png) |

Baseline và bản minh họa có thể chạy bằng `./scripts/run-newman.sh baseline` và `./scripts/run-newman.sh demonstrate-failure`. Baseline là tập con có một case cho mỗi API đích.

### Đối chiếu với yêu cầu đề bài về hai lượt chạy mẫu:
- **Lượt mẫu toàn bộ test case passing:** `full-remediated` chạy lại nguyên collection trên bản sao EShop áp dụng [patch sửa lỗi](../docs/sut-remediation.md). Lượt `full` trên SUT gốc vẫn ghi nhận 106 assertion fail, gồm lỗi đã xác nhận và sai lệch ở các case khám phá. Cần đối chiếu với giảng viên việc dùng bản đã vá cho lượt mẫu xanh.
- **Lượt mẫu đúng một test case failing:** Được minh họa chuẩn xác qua chế độ `demonstrate-failure` trên branch `ci/failure-demo` (commit `98d5f27`), ghi nhận đúng 1 assertion fail, exit code 1 kèm báo cáo Newman.

Chạy lại tập regression bằng `./scripts/run-newman.sh regression`. Bộ này giữ các assertion gốc. Phần 66 case fail vẫn có trong chế độ full và báo cáo Newman. Lượt full đã tải lên artifact `member2-newman-report`.
