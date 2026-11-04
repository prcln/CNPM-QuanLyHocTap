import app from "./app.js";
import http from "http";

async function runTests() {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Test server running at ${baseUrl}`);

  try {
    // Test 1: Đăng nhập sai mật khẩu -> 401
    console.log("\n[Test 1] Đăng nhập sai mật khẩu...");
    const res1 = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "wrongpassword" }),
    });
    console.log(`Status: ${res1.status} (Expected: 401)`);
    if (res1.status !== 401) throw new Error("Test 1 Failed");

    // Test 2: Đăng nhập đúng thông tin -> 200 + Nhận Token & Cookie
    console.log("\n[Test 2] Đăng nhập thành công (admin/admin123)...");
    const res2 = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123" }),
    });
    console.log(`Status: ${res2.status} (Expected: 200)`);
    if (res2.status !== 200) throw new Error("Test 2 Failed");
    const data2 = await res2.json();
    console.log("Access Token nhận được:", data2.accessToken ? "Hợp lệ (JWT)" : "Không có");
    console.log("Account info:", data2.account);

    const setCookieHeader = res2.headers.get("set-cookie");
    console.log("Set-Cookie header:", setCookieHeader);
    if (!setCookieHeader || !setCookieHeader.includes("refreshToken=")) {
      throw new Error("Missing refreshToken in Set-Cookie header");
    }
    const cookieString = setCookieHeader.split(";")[0]; // "refreshToken=..."

    // Test 3: Truy cập Protected Route có Bearer Token -> 200
    console.log("\n[Test 3] Gọi GET /api/v1/accounts/me với Bearer Token...");
    const res3 = await fetch(`${baseUrl}/api/v1/accounts/me`, {
      headers: { Authorization: `Bearer ${data2.accessToken}` },
    });
    console.log(`Status: ${res3.status} (Expected: 200)`);
    const meData = await res3.json();
    console.log("Dữ liệu tài khoản hiện tại:", meData);
    if (res3.status !== 200 || meData.username !== "admin") throw new Error("Test 3 Failed");

    // Test 4: Truy cập Protected Route KHÔNG có Bearer Token -> 401
    console.log("\n[Test 4] Gọi GET /api/v1/accounts/me KHÔNG có Bearer Token...");
    const res4 = await fetch(`${baseUrl}/api/v1/accounts/me`);
    console.log(`Status: ${res4.status} (Expected: 401)`);
    if (res4.status !== 401) throw new Error("Test 4 Failed");

    // Test 5: Làm mới Token (Refresh Token Rotation) -> 200 + Cặp Token Mới
    console.log("\n[Test 5] Gọi POST /api/v1/auth/refresh với Cookie...");
    const res5 = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookieString },
    });
    console.log(`Status: ${res5.status} (Expected: 200)`);
    if (res5.status !== 200) throw new Error("Test 5 Failed");
    const data5 = await res5.json();
    console.log("Access Token mới nhận được:", data5.accessToken ? "Hợp lệ" : "Không có");
    const newCookieHeader = res5.headers.get("set-cookie");
    const newCookieString = newCookieHeader?.split(";")[0];

    // Test 6: Kiểm tra Access Token mới hoạt động
    console.log("\n[Test 6] Kiểm tra Access Token mới với GET /api/v1/accounts/me...");
    const res6 = await fetch(`${baseUrl}/api/v1/accounts/me`, {
      headers: { Authorization: `Bearer ${data5.accessToken}` },
    });
    console.log(`Status: ${res6.status} (Expected: 200)`);
    if (res6.status !== 200) throw new Error("Test 6 Failed");

    // Test 7: PHÁT HIỆN TÁI SỬ DỤNG (Reuse Detection) với token cũ đã bị thu hồi -> 403
    console.log("\n[Test 7] Gọi refresh với Refresh Token CŨ đã bị thu hồi (Kiểm tra chống trộm token)...");
    const res7 = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookieString },
    });
    console.log(`Status: ${res7.status} (Expected: 403)`);
    const data7 = await res7.json();
    console.log("Phản hồi bảo mật:", data7.message);
    if (res7.status !== 403) throw new Error("Test 7 Failed");

    // Test 8: Đăng xuất -> 200 + Xóa cookie
    console.log("\n[Test 8] Đăng xuất POST /api/v1/auth/logout...");
    const res8 = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: "POST",
      headers: { Cookie: newCookieString || "" },
    });
    console.log(`Status: ${res8.status} (Expected: 200)`);
    if (res8.status !== 200) throw new Error("Test 8 Failed");

    console.log("\n==========================================");
    console.log("🎉 TẤT CẢ 8 BÀI KIỂM THỬ XÁC THỰC ĐÃ THÀNH CÔNG RỰC RỠ!");
    console.log("==========================================");
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
