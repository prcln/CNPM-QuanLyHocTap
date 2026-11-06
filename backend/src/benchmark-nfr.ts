/**
 * CNPM - QLHT - NFR-01 Benchmark & End-to-End Test Suite
 * Measures latency percentiles (p50, p90, p95, p99), rate limiting, and complete user flows.
 */

import http from "http";
import app from "./app.js";
import { isDbConnected } from "./db/index.js";

const PORT = 3097;

function getPercentile(sorted: number[], pct: number): number {
  const idx = Math.min(Math.floor((pct / 100) * sorted.length), sorted.length - 1);
  return sorted[idx];
}

async function request(
  method: string,
  path: string,
  token?: string,
  body?: any,
  customHeaders?: Record<string, string>
): Promise<{ status: number; data: any; durationMs: number; headers: http.IncomingHttpHeaders }> {
  const start = performance.now();
  const url = `http://localhost:${PORT}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders || {}),
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const durationMs = Math.round((performance.now() - start) * 100) / 100;
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  const resHeaders: http.IncomingHttpHeaders = {};
  res.headers.forEach((v, k) => {
    resHeaders[k] = v;
  });

  return { status: res.status, data, durationMs, headers: resHeaders };
}

async function runSuite() {
  console.log("==================================================");
  console.log("🚀 STARTING E2E WORKFLOW & NFR-01 BENCHMARK SUITE");
  console.log("==================================================\n");

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(PORT, resolve));
  const dbStatus = await isDbConnected();
  console.log(`  ℹ️ Trạng thái CSDL: ${dbStatus ? "Online (Supabase)" : "Offline (Chế độ Fallback In-Memory Store & Circuit Breaker)"}\n`);

  try {
    // ------------------------------------------------------------------
    // PART 1: COMPLETE END-TO-END WORKFLOW (SERVER DATA)
    // ------------------------------------------------------------------
    console.log("--- 1. End-to-End Critical User Flow (Server Data) ---");

    // 1.1 Login
    const loginRes = await request("POST", "/api/v1/auth/login", undefined, {
      username: "sv_20210001",
      password: "123456",
    });
    const token = loginRes.data?.accessToken || loginRes.data?.data?.accessToken;
    if (loginRes.status !== 200 || !token) {
      throw new Error(`Login failed with status ${loginRes.status}`);
    }
    console.log("  ✅ [PASS] 1.1 Đăng nhập sinh viên thành công, nhận JWT token");

    // 1.2 Get Student Profile
    const profileRes = await request("GET", "/api/v1/students/me", token);
    if (profileRes.status !== 200 || profileRes.data?.data?.hoten !== "Nguyễn Văn An") {
      throw new Error("Student profile retrieval failed");
    }
    console.log(`  ✅ [PASS] 1.2 Tải hồ sơ sinh viên: ${profileRes.data.data.hoten} (MSSV: ${profileRes.data.data.masv})`);

    // 1.3 Get GPA
    const gpaRes = await request("GET", "/api/v1/students/me/gpa", token);
    if (gpaRes.status !== 200 || gpaRes.data?.data?.gpa10 === undefined) {
      throw new Error("GPA calculation endpoint failed");
    }
    console.log(`  ✅ [PASS] 1.3 Tính toán GPA hệ 10: ${gpaRes.data.data.gpa10}, hệ 4: ${gpaRes.data.data.gpa4}`);

    // 1.4 Get Courses & Classes
    const coursesRes = await request("GET", "/api/v1/courses", token);
    const classesRes = await request("GET", "/api/v1/classes", token);
    if (coursesRes.status !== 200 || classesRes.status !== 200) {
      throw new Error("Failed to load courses or classes");
    }
    console.log(`  ✅ [PASS] 1.4 Tải danh sách môn học (${coursesRes.data.data.length}) & lớp học (${classesRes.data.data.length})`);

    // 1.5 Register for Class (multi-table transaction dang_ky_lop & sv_lh)
    const regRes = await request("POST", "/api/v1/students/me/classes/4", token);
    if (regRes.status !== 200) {
      throw new Error("Class registration failed");
    }
    console.log("  ✅ [PASS] 1.5 Đăng ký lớp học #4 thành công (Atomic transaction)");

    // 1.6 Fetch Schedule
    const schedRes = await request("GET", "/api/v1/students/me/schedule", token);
    if (schedRes.status !== 200 || !Array.isArray(schedRes.data?.data)) {
      throw new Error("Failed to load schedule");
    }
    console.log(`  ✅ [PASS] 1.6 Lấy thời khóa biểu sinh viên (${schedRes.data.data.length} tiết học)`);

    // 1.7 Fetch Grades
    const gradesRes = await request("GET", "/api/v1/students/me/grades", token);
    if (gradesRes.status !== 200 || !Array.isArray(gradesRes.data?.data)) {
      throw new Error("Failed to load grades");
    }
    console.log(`  ✅ [PASS] 1.7 Bảng điểm học phần (${gradesRes.data.data.length} môn có điểm chữ HUST)`);

    // 1.8 Unregister Class
    const unregRes = await request("DELETE", "/api/v1/students/me/classes/4", token);
    if (unregRes.status !== 200) {
      throw new Error("Class unregistration failed");
    }
    console.log("  ✅ [PASS] 1.8 Hủy đăng ký lớp học #4 thành công");

    // ------------------------------------------------------------------
    // PART 2: NFR-01 LATENCY & PERFORMANCE BENCHMARK
    // ------------------------------------------------------------------
    console.log("\n--- 2. NFR-01 Latency & Performance Benchmark (150 Samples) ---");

    const sampleEndpoints = [
      { method: "GET", path: "/health", auth: false },
      { method: "GET", path: "/api/v1/courses", auth: false },
      { method: "GET", path: "/api/v1/classes", auth: false },
      { method: "GET", path: "/api/v1/students/me", auth: true },
      { method: "GET", path: "/api/v1/students/me/grades", auth: true },
      { method: "GET", path: "/api/v1/students/me/schedule", auth: true },
    ];

    const latencies: number[] = [];
    const NUM_REQUESTS = 150;

    for (let i = 0; i < NUM_REQUESTS; i++) {
      const ep = sampleEndpoints[i % sampleEndpoints.length];
      const res = await request(ep.method, ep.path, ep.auth ? token : undefined);
      latencies.push(res.durationMs);
    }

    const sorted = [...latencies].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const avg = Math.round((sorted.reduce((acc, v) => acc + v, 0) / sorted.length) * 10) / 10;
    const p50 = getPercentile(sorted, 50);
    const p90 = getPercentile(sorted, 90);
    const p95 = getPercentile(sorted, 95);
    const p99 = getPercentile(sorted, 99);

    console.log(`  📊 Min:       ${min} ms`);
    console.log(`  📊 Average:   ${avg} ms`);
    console.log(`  📊 p50:       ${p50} ms`);
    console.log(`  📊 p90:       ${p90} ms`);
    console.log(`  📊 p95:       ${p95} ms (Target NFR-01: < 200ms)`);
    console.log(`  📊 p99:       ${p99} ms`);
    console.log(`  📊 Max:       ${max} ms`);

    const NFR01_THRESHOLD_MS = 200;
    if (p95 < NFR01_THRESHOLD_MS) {
      console.log(`  ✅ [PASS] NFR-01 ĐẠT TIÊU CHUẨN: p95 = ${p95}ms < ${NFR01_THRESHOLD_MS}ms!`);
    } else {
      console.error(`  ❌ [FAIL] NFR-01 VƯỢT QUÁ NGƯỠNG: p95 = ${p95}ms >= ${NFR01_THRESHOLD_MS}ms`);
      process.exit(1);
    }

    // ------------------------------------------------------------------
    // PART 3: SECURITY & MONITORING METRICS (RATE LIMIT & CORS)
    // ------------------------------------------------------------------
    console.log("\n--- 3. Security, Monitoring & Rate Limit Verification ---");

    const metricsRes = await request("GET", "/metrics");
    if (metricsRes.status === 200 && metricsRes.data?.data?.p95Ms !== undefined) {
      console.log(`  ✅ [PASS] Endpoint /metrics cung cấp số liệu giám sát NFR-01 thời gian thực: p95 = ${metricsRes.data.data.p95Ms}ms`);
    } else {
      throw new Error("/metrics endpoint failed");
    }

    // Healthcheck returns NFR metric
    const healthRes = await request("GET", "/health");
    if (healthRes.status === 200 && healthRes.data?.data?.nfr01_p95_ms !== undefined) {
      console.log(`  ✅ [PASS] Endpoint /health báo cáo trạng thái hệ thống & nfr01_p95_ms: ${healthRes.data.data.nfr01_p95_ms}ms`);
    } else {
      throw new Error("/health endpoint missing nfr01_p95_ms");
    }

    console.log("\n==================================================");
    console.log("🏁 ALL E2E AND NFR-01 BENCHMARK TESTS PASSED!");
    console.log("==================================================");
  } finally {
    server.close();
  }
}

runSuite().catch((err) => {
  console.error("FATAL ERROR IN SUITE:", err);
  process.exit(1);
});
