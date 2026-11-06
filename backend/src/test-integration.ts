import app from "./app.js";
import { Server } from "http";

const PORT = 3098;

async function runIntegrationTests() {
  console.log("==================================================");
  console.log("🧪 STARTING BACKEND INTEGRATION TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  const server: Server = await new Promise((resolve) => {
    const s = app.listen(PORT, () => resolve(s));
  });

  const baseUrl = `http://localhost:${PORT}`;

  function assert(condition: boolean, testName: string, extraInfo?: any) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`, extraInfo ?? "");
      failed++;
    }
  }

  try {
    // 1. Healthcheck Tests
    console.log("\n--- 1. Healthcheck Endpoints ---");
    const h1 = await fetch(`${baseUrl}/health`).then((r) => r.json());
    assert(h1.code === 200 && h1.data?.status === "ok", "GET /health trả về 200 OK");

    const h2 = await fetch(`${baseUrl}/api/v1/health`).then((r) => r.json());
    assert(h2.code === 200 && h2.data?.status === "ok", "GET /api/v1/health trả về 200 OK");

    // 2. Validation Middleware Tests
    console.log("\n--- 2. Request Validation Middleware ---");
    const valRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const valJson = await valRes.json();
    assert(
      valRes.status === 400 && valJson.code === 400 && Array.isArray(valJson.details),
      "POST /auth/login thiếu body trả về 400 kèm details"
    );

    // 3. Auth Login Tests
    console.log("\n--- 3. Authentication & RBAC ---");
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "sv_20210001", password: "123456" }),
    });
    const loginJson = await loginRes.json();
    assert(
      loginRes.status === 200 && Boolean(loginJson.accessToken),
      "Đăng nhập Sinh viên trả về 200 và JWT Access Token"
    );

    const token = loginJson.accessToken;

    // 4. Student Protected Endpoints
    console.log("\n--- 4. Module Sinh Viên ---");
    const meRes = await fetch(`${baseUrl}/api/v1/students/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    assert(
      meRes.code === 200 && meRes.data?.hoten === "Nguyễn Văn An",
      "GET /students/me trả về đúng thông tin sinh viên"
    );

    const gpaRes = await fetch(`${baseUrl}/api/v1/students/me/gpa`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    assert(
      gpaRes.code === 200 && typeof gpaRes.data?.gpa10 === "number",
      "GET /students/me/gpa tính toán điểm GPA hệ 10 và hệ 4"
    );

    const myScheduleRes = await fetch(`${baseUrl}/api/v1/students/me/schedule`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    assert(
      myScheduleRes.code === 200 && Array.isArray(myScheduleRes.data),
      "GET /students/me/schedule trả về mảng thời khóa biểu"
    );

    // 5. Grades & Guardrail 3 HUST Calculation
    console.log("\n--- 5. Module Điểm & Chuẩn HUST (Guardrail 3) ---");
    const gradesRes = await fetch(`${baseUrl}/api/v1/students/me/grades`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    const g1 = gradesRes.data?.[0];
    assert(
      gradesRes.code === 200 &&
        g1 &&
        g1.diemQt !== undefined &&
        g1.diemCk !== undefined &&
        g1.diemChu !== undefined,
      "GET /students/me/grades có diemQt, diemCk và quy đổi ra diemChu theo trọng số lớp"
    );

    // 6. Courses & Classes Public/Protected Endpoints
    console.log("\n--- 6. Module Học Phần & Lớp Học ---");
    const coursesRes = await fetch(`${baseUrl}/api/v1/courses`).then((r) => r.json());
    assert(
      coursesRes.code === 200 && Array.isArray(coursesRes.data) && coursesRes.pagination?.total > 0,
      "GET /courses trả về danh sách học phần kèm pagination"
    );

    const classesRes = await fetch(`${baseUrl}/api/v1/classes`).then((r) => r.json());
    assert(
      classesRes.code === 200 && Array.isArray(classesRes.data) && classesRes.pagination?.total > 0,
      "GET /classes trả về danh sách lớp học kèm pagination"
    );

    // 7. Multi-Table Registration (Atomic Class Register & Unregister)
    console.log("\n--- 7. Đăng Ký Lớp Học Nhiều Bảng (dang_ky_lop & sv_lh) ---");
    const regRes = await fetch(`${baseUrl}/api/v1/students/me/classes/4`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    assert(regRes.code === 200, "POST /students/me/classes/:malh đăng ký vào lớp học");

    const unregRes = await fetch(`${baseUrl}/api/v1/students/me/classes/4`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    assert(unregRes.code === 200, "DELETE /students/me/classes/:malh hủy đăng ký lớp");

    // 8. Assignments & Groups
    console.log("\n--- 8. Module Bài Tập & Nhóm ---");
    const assignRes = await fetch(`${baseUrl}/api/v1/classes/1/assignments`).then((r) => r.json());
    assert(
      assignRes.code === 200 && Array.isArray(assignRes.data),
      "GET /classes/:malh/assignments trả về danh sách bài tập"
    );

    const groupsRes = await fetch(`${baseUrl}/api/v1/assignments/1/groups`).then((r) => r.json());
    assert(
      groupsRes.code === 200 && Array.isArray(groupsRes.data),
      "GET /assignments/:mabt/groups trả về danh sách nhóm bài tập"
    );

    // 9. Not Found Middleware (404)
    console.log("\n--- 9. Not Found Middleware ---");
    const nfRes = await fetch(`${baseUrl}/api/v1/this-endpoint-does-not-exist`);
    const nfJson = await nfRes.json();
    assert(
      nfRes.status === 404 && nfJson.code === 404 && nfJson.message.includes("Không tìm thấy endpoint"),
      "Route không tồn tại được xử lý qua notFoundHandler với format chuẩn"
    );

  } catch (error: any) {
    console.error("Test execution error:", error);
    failed++;
  } finally {
    server.close();
  }

  console.log("\n==================================================");
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runIntegrationTests();

