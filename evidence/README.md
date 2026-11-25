# Bằng chứng HW06 · Thành viên 2

- [Repo GitHub public](https://github.com/bingsu1103/hw06-api-testing-member2)
- [Báo cáo 6 issue kèm ảnh Newman](../reports/bugs/member2-functional-findings.md) · [Ảnh trang GitHub Issues](screenshots/github-issues.png)
- [Lượt CI, commit tương ứng và ảnh](../reports/cicd-report.md)
- `screenshots/newman-console-student.png` là ảnh Terminal gốc do sinh viên cung cấp. Ảnh có header `X-Student-Id: 23120205`, host `127.0.0.1:3000` và tổng kết Newman. File này đi cùng ZIP kỹ thuật local.

## Còn trước khi nộp

- AI audit, AI report và prompt AI do sinh viên hoàn thiện.
- Sơ đồ test-generator phải do sinh viên tự vẽ theo đề. [Pseudocode kỹ thuật](../docs/test-generator-pseudocode.md)
- Xác nhận điểm tự chấm cuối, bổ sung các phần trên và lưu ZIP theo mẫu đề. Bản kỹ thuật hiện dùng điểm tự chấm tạm 60/100.
- Yêu cầu một lượt CI xanh toàn bộ suite chưa đạt. Chế độ regression chỉ chạy 54 case đạt kỳ vọng trong lần thực thi đầy đủ. Lượt đủ 120 case ghi nhận sai lệch và giả định cần đối chiếu.
