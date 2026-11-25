# Thuật toán chuẩn bị test case

Đầu vào là đặc tả API, quy tắc nghiệp vụ và giới hạn phạm vi thành viên 2. Công cụ nhận tập case nháp, kiểm tra cấu trúc rồi xuất collection có thể lặp lại.

```text
read API contracts and business rules
pick the three routes from member 2's assignment
for each selected route:
    list required, optional and typed request fields
    draft ordinary equivalence partitions and boundary values
    for an explicit state machine, enumerate each source-target pair
    record fixture, expected response and observable postcondition
    flag unspecified status codes or rules for human review
    assign stable case IDs
validate coverage, unique IDs and the method/path allowlist
export case catalog and Postman collection
join real Newman results by case ID
```

Hiện thực phần xác thực cấu trúc và xuất collection nằm trong `scripts/`. Sơ đồ yêu cầu sinh viên tự thiết kế và vẽ theo đề.
