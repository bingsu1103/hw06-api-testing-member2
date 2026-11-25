import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { member2Cases } from "../data/member2-cases.mjs";

const folders = [
  ["register", "Pool A - Registration"],
  ["checkout", "Pool B - Checkout"],
  ["admin-order-status", "Pool C - Admin Order Status"],
];

export function selectVerifiedCases(cases, rows) {
  const observed = new Map(rows.map((row) => [row.id, row]));
  if (rows.length !== cases.length || observed.size !== cases.length) {
    throw new Error("The recorded run must contain exactly one result per canonical case.");
  }
  const selected = cases.filter(({id, api}) => {
    const result = observed.get(id);
    if (result?.api !== api || !["PASS", "FAIL"].includes(result.result)) {
      throw new Error(`No matching recorded outcome for ${id}`);
    }
    return result.result === "PASS";
  });
  if (folders.some(([api]) => !selected.some((entry) => entry.api === api))) {
    throw new Error("The regression selection must include all three APIs.");
  }
  return selected;
}
const event = (listen, source) => ({ listen, script: { type: "text/javascript", exec: source.trim().split("\n") } });
const send = `
function send(request) {
  return new Promise((resolve, reject) => {
    pm.sendRequest(request, (error, response) => error ? reject(error) : resolve(response));
  });
}
`;

const setup = `
const baseUrl = pm.variables.get("baseUrl");
const studentId = pm.variables.get("studentId");
const suffix = pm.variables.replaceIn("{{$guid}}");
const email = suffix + "@example.test";
const password = pm.variables.replaceIn("Aa1!{{$guid}}");
pm.variables.set("email", email);
pm.variables.set("alias", suffix + "+home@example.test");
pm.variables.set("mixedDomain", suffix + "@Example.test");
pm.variables.set("fixturePassword", password);
async function call(method, path, body, token) {
  const header = { "X-Student-Id": studentId, "Content-Type": "application/json" };
  if (token) header.Authorization = "Bearer " + token;
  const request = { url: baseUrl + path, method, header };
  if (body) request.body = { mode: "raw", raw: JSON.stringify(body) };
  const response = await send(request);
  pm.expect(response.code, "Fixture " + method + " " + path).to.equal(200);
  return response.json();
}
async function prepare() {
  const fixture = spec.request.fixture || {};
  if (spec.api === "register") {
    if (fixture === "duplicate") await call("POST", "/api/register", {name: "Fixture Member 2", email, password});
    return;
  }
  let token = "";
  if (spec.api === "checkout" || !fixture.id) {
    await call("POST", "/api/register", {name: "Checkout fixture", email, password});
    token = (await call("POST", "/api/login", {email, password})).token;
    pm.variables.set("member2UserToken", token);
  }
  if (spec.api === "checkout") {
    const products = await call("GET", "/api/products");
    const lines = fixture.empty ? [] : [[fixture.product || 1, fixture.qty || 1]];
    if (fixture.second) lines.push([2, fixture.second]);
    let total = 0;
    for (const [id, quantity] of lines) {
      const product = products.find((candidate) => candidate.id === id);
      await call("POST", "/api/cart", {id, name: product.name, price: product.price, quantity}, token);
      total += product.price * quantity;
    }
    pm.variables.set("cartTotal", String(total));
    const body = {...spec.request.body};
    if (body.total_amount !== undefined) body.total_amount = total;
    pm.request.body.update(JSON.stringify(body));
    if (!fixture.noAuth) pm.request.headers.upsert({key: "Authorization", value: "Bearer " + (fixture.invalidAuth ? "invalid.jwt.token" : token)});
    return;
  }
  const admin = (await call("POST", "/api/login", {
    email: pm.variables.get("adminEmail"), password: pm.variables.get("adminPassword")
  })).token;
  let orderId = fixture.id;
  if (!orderId) {
    const product = (await call("GET", "/api/products"))[0];
    await call("POST", "/api/cart", {id: product.id, name: product.name, price: product.price, quantity: 1}, token);
    orderId = (await call("POST", "/api/checkout", {total_amount: product.price, shipping_address: "HW06 test order"}, token)).orderId;
    const path = {confirmed: ["confirmed"], shipping: ["confirmed", "shipping"], delivered: ["confirmed", "shipping", "delivered"], canceled: ["canceled"]}[fixture.from] || [];
    for (const status of path) await call("PUT", "/api/admin/orders/" + orderId + "/status", {status}, admin);
  }
  pm.variables.set("orderId", String(orderId));
  if (!fixture.noAuth) pm.request.headers.upsert({key: "Authorization", value: "Bearer " + admin});
}
await prepare();
`;

const assertions = `
pm.test(spec.id + " HTTP contract", () => {
  const expected = spec.expected.status;
  if (expected === 400 && spec.api !== "admin-order-status") pm.expect(pm.response.code).to.be.within(400, 499);
  else pm.response.to.have.status(expected);
});
pm.test(spec.id + " response schema", () => {
  pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
  const body = pm.response.json();
  if (!spec.expected.success) {
    pm.expect(body).to.have.property("error").that.is.a("string");
  } else if (spec.api === "register") {
    pm.expect(body).to.have.all.keys("message", "id");
    pm.expect(body.message).to.equal("User registered successfully");
    pm.expect(body.id).to.be.a("number").above(0);
  } else if (spec.api === "checkout") {
    pm.expect(body).to.have.all.keys("message", "orderId");
    pm.expect(body.message).to.equal("Checkout successful");
    pm.expect(body.orderId).to.be.a("number").above(0);
  } else {
    pm.expect(body).to.deep.equal({message: "Order status updated"});
  }
});
if (spec.expected.success && spec.api === "checkout" && pm.response.code === 200) {
  const header = {Authorization: "Bearer " + pm.variables.get("member2UserToken"), "X-Student-Id": pm.variables.get("studentId")};
  const baseUrl = pm.variables.get("baseUrl");
  const orderId = pm.response.json().orderId;
  const history = await send({url: baseUrl + "/api/orders/my-orders", method: "GET", header});
  const order = history.json().find(candidate => candidate.id === orderId);
  pm.test(spec.id + " stored pending order, cart total and address", () => {
    pm.expect(history.code).to.equal(200);
    pm.expect(order).to.include({
      status: "pending", total_amount: Number(pm.variables.get("cartTotal")),
      shipping_address: spec.request.body.shipping_address
    });
  });
  const cart = await send({url: baseUrl + "/api/cart", method: "GET", header});
  pm.test(spec.id + " cart cleared", () => {
    pm.expect(cart.code).to.equal(200);
    pm.expect(cart.json()).to.deep.equal([]);
  });
}
`;

export function buildCollection(cases) {
  return {
    info: { name: "23120205 - HW06 Member 2", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
    event: [event("prerequest", `
pm.request.headers.upsert({key: "X-Student-Id", value: pm.variables.get("studentId")});
console.log("X-Student-Id:", pm.request.headers.get("X-Student-Id"));
`)],
    variable: [
      { key: "baseUrl", value: "http://127.0.0.1:3000" },
      { key: "studentId", value: "23120205" },
      { key: "adminEmail", value: "admin@eshop.com" },
      { key: "adminPassword", value: "Admin123!" },
    ],
    item: folders.map(([api, name]) => ({ name, item: cases.filter((entry) => entry.api === api).map((entry) => {
      const { method, path, body } = entry.request;
      const definition = `const spec = ${JSON.stringify(entry)};\n` + send;
      const guarded = (script) => definition + "(async () => {" + script +
        "})().catch(error => pm.test(spec.id + ' fixture and follow-up success', () => { throw error; }));";
      return {
        name: `[${entry.id}] ${entry.title}`,
        request: { method, header: [{ key: "Content-Type", value: "application/json" }],
          body: { mode: "raw", raw: JSON.stringify(body), options: { raw: { language: "json" } } },
          url: { raw: `{{baseUrl}}${path}`, host: ["{{baseUrl}}"], path: path.slice(1).split("/") },
          description: `${entry.requirement} · ${entry.coverage.join(", ")}`,
        },
        event: [event("prerequest", guarded(setup)), event("test", guarded(assertions))],
      };
    }) })),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [mode, output] = process.argv.slice(2);
  if (mode === "regression") {
    const { rows } = JSON.parse(await readFile(new URL("../reports/member2-results.json", import.meta.url), "utf8"));
    const selected = selectVerifiedCases(member2Cases, rows);
    console.log(`Regression selection: ${selected.length} / ${member2Cases.length} canonical cases`);
    await writeFile(output, JSON.stringify(buildCollection(selected), null, 2) + "\n");
  } else if (mode === "baseline" || mode === "demonstrate-failure") {
    const ids = ["REG-G-001", "CHK-G-031", "ORD-G-002"];
    const cases = member2Cases.filter(({id}) => ids.includes(id)).map((entry) =>
      mode === "demonstrate-failure" && entry.id === ids[0]
        ? {...entry, expected: {...entry.expected, status: 201}}
        : entry);
    await writeFile(output, JSON.stringify(buildCollection(cases), null, 2) + "\n");
  } else {
    for (const [file, content] of [
      ["../data/test-cases.json", member2Cases],
      ["../postman/23120205_HW06.postman_collection.json", buildCollection(member2Cases)],
    ]) await writeFile(new URL(file, import.meta.url), JSON.stringify(content, null, 2) + "\n");
  }
}
