const base = { name: "Nguyễn Gia An", email: "{{email}}", password: "{{fixturePassword}}" };
const bytes = (length) => "a".repeat(length);
const register = [
  ["Standard registration", {}, true],
  ["Vietnamese name", { name: "Trần Thị Ánh" }, true],
  ["One-character name", { name: "A" }, true],
  ["Hyphenated name", { name: "Anne-Marie" }, true],
  ["Apostrophe in a legitimate name", { name: "Anne O’Neil" }, true],
  ["Plus-addressed email", { email: "{{alias}}" }, true],
  ["Mixed-case domain", { email: "{{mixedDomain}}" }, true],
  ["Exactly eight valid password characters", { password: "Abcde1!x" }, true],
  ["Supported dollar symbol", { password: "Abcde1$x" }, true],
  ["Supported percent symbol", { password: "Abcde1%x" }, true],
  ["Matching explicit confirmation", { confirmPassword: "{{fixturePassword}}" }, true],
  ["Password length seven", { password: "Abcd1!x" }, false],
  ["Password lacks uppercase", { password: "abcdef1!" }, false],
  ["Password lacks lowercase", { password: "ABCDEF1!" }, false],
  ["Password lacks digit", { password: "Abcdefg!" }, false],
  ["Password lacks special character", { password: "Abcdefg1" }, false],
  ["Empty password", { password: "" }, false],
  ["Omitted password", { password: undefined }, false],
  ["Null password", { password: null }, false],
  ["Numeric password", { password: 12345678 }, false],
  ["Empty email", { email: "" }, false],
  ["Omitted email", { email: undefined }, false],
  ["Null email", { email: null }, false],
  ["Numeric email", { email: 123 }, false],
  ["Email lacks at sign", { email: "member2.example.test" }, false],
  ["Email lacks local part", { email: "@example.test" }, false],
  ["Email lacks domain", { email: "member2@" }, false],
  ["Email has internal whitespace", { email: "member 2@example.test" }, false],
  ["Empty name", { name: "" }, false],
  ["Omitted name", { name: undefined }, false],
  ["Null name", { name: null }, false],
  ["Name contains whitespace only", { name: "   " }, false],
  ["Numeric name", { name: 123 }, false],
  ["Long valid name", { name: bytes(80) }, true],
  ["Mismatched explicit confirmation", { confirmPassword: "Different1!" }, false],
  ["Duplicate email", {}, false, "duplicate"],
  ["Array name", { name: ["An"] }, false],
  ["Object email", { email: { value: "member2@example.test" } }, false],
  ["Array password", { password: ["Abcdef1!"] }, false],
  ["Success response excludes credential fields", {}, true, "safe-response"],
];

const addresses = ["12 Lê Lợi, TP.HCM", "8 Nguyễn Huệ", "Hà Nội", "A", "Apartment 4B / 17", "Khu phố 3, P. 2", "  12 Lê Lợi  ", "12 Lê Lợi\nTầng 2", "Phường 5 – Quận 3", "Tòa nhà O’Neil"];
const checkout = [
  ...addresses.map((address, i) => [`Address partition ${i + 1}`, { shipping_address: address }, true]),
  ...[2, 3, 5, 10, 20].map((qty) => [`Single line quantity ${qty}`, {}, true, { qty }]),
  ...[2, 3, 4, 5].map((second) => [`Two lines with second quantity ${second}`, {}, true, { second }]),
  ["Compute total when client omits it", { total_amount: undefined }, true],
  ["Standard submitted total matches cart", {}, true],
  ["Empty address", { shipping_address: "" }, false],
  ["Omitted address", { shipping_address: undefined }, false],
  ["Null address", { shipping_address: null }, false],
  ["Blank address", { shipping_address: "  " }, false],
  ["Numeric address", { shipping_address: 123 }, false],
  ["Array address", { shipping_address: [] }, false],
  ["Object address", { shipping_address: {} }, false],
  ["Boolean address", { shipping_address: false }, false],
  ["Checkout with empty cart", {}, false, { empty: true }],
  ["No Authorization header", {}, false, { noAuth: true }],
  ["Invalid opaque token", {}, false, { invalidAuth: true }],
  ["Long address", { shipping_address: "Building ".repeat(12).trim() }, true],
  ["Address with accents and slash", { shipping_address: "Hẻm 18/4, đường Võ Văn Tần" }, true],
  ["Two lines with both quantities greater than one", {}, true, { qty: 2, second: 2 }],
  ["Three units with no submitted total", { total_amount: undefined }, true, { qty: 3 }],
  ["Second product only", {}, true, { product: 2 }],
  ["Two lines and no submitted total", { total_amount: undefined }, true, { second: 1 }],
  ["Validate cart cleared after two-line checkout", {}, true, { second: 1 }],
  ["Check submitted address is retained", { shipping_address: "Tầng 3, phòng 305" }, true],
];

const statuses = ["pending", "confirmed", "shipping", "delivered", "canceled"];
const edges = { pending: ["confirmed", "canceled"], confirmed: ["shipping", "canceled"], shipping: ["delivered"] };
const order = statuses.flatMap((from) => statuses.map((to) => [
  `${from} to ${to}`, { status: to }, (edges[from] ?? []).includes(to), { from }
]));
order.push(
  ["Missing status", {}, false], ["Null status", { status: null }, false],
  ["Empty status", { status: "" }, false], ["Blank status", { status: " " }, false],
  ["Unknown status", { status: "returned" }, false], ["Uppercase status", { status: "CONFIRMED" }, false],
  ["Number status", { status: 1 }, false], ["Array status", { status: ["confirmed"] }, false],
  ["Object status", { status: { value: "confirmed" } }, false], ["Boolean status", { status: true }, false],
  ["Unknown order ID", { status: "confirmed" }, false, { id: "999999999" }],
  ["Zero order ID", { status: "confirmed" }, false, { id: "0" }],
  ["Negative order ID", { status: "confirmed" }, false, { id: "-1" }],
  ["Non-numeric order ID", { status: "confirmed" }, false, { id: "abc" }],
  ["Missing admin authentication", { status: "confirmed" }, false, { noAuth: true }],
);

const make = (rows, api, prefix, method, path, requirement, defaults) => rows.map(([title, fields, success, fixture], index) => ({
  id: `${prefix}-${index < 35 ? "G" : "E"}-${String(index < 35 ? index + 1 : index - 34).padStart(3, "0")}`,
  api, title, requirement, origin: index < 35 ? "generated" : "extension",
  coverage: api === "admin-order-status" && index < 25 ? ["state", "schema"] : fixture?.noAuth || fixture?.invalidAuth || fixture === "safe-response" ? ["security", "schema"] : ["domain", "schema"],
  request: { method, path, body: { ...defaults, ...fields }, fixture },
  expected: { status: success ? 200 : fixture?.noAuth ? 401 : fixture?.invalidAuth ? 403 : fixture?.id ? 404 : 400, success },
}));

export const member2Cases = [
  ...make(register, "register", "REG", "POST", "/api/register", "FR-01", base),
  ...make(checkout, "checkout", "CHK", "POST", "/api/checkout", "FR-08", { shipping_address: "12 Lê Lợi", total_amount: "{{cartTotal}}" }),
  ...make(order, "admin-order-status", "ORD", "PUT", "/api/admin/orders/{{orderId}}/status", "FR-10 / FR-18", {}),
];
