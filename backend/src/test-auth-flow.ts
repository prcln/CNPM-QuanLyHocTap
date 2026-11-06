import app from "./app.js";
import http from "http";
import jwt from "jsonwebtoken";
import { jwtConfig } from "./config/jwt.config.js";

async function runTests() {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Test server running at ${baseUrl}`);

  try {
    // -------------------------------------------------------------
    // Test 1: Đăng nhập sai mật khẩu -> 401 Unauthorized
    // -------------------------------------------------------------
    console.log("\n[Test 1] Đăng nhập sai mật khẩu -> 401...");
    const res1 = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "wrongpassword" }),
    });
    console.log(`Status: ${res1.status} (Expected: 401)`);
    if (res1.status !== 401) throw new Error("Test 1 Failed: Expected 401");

    // -------------------------------------------------------------
    // Test 2: Đăng nhập AD thành công -> 200 + Nhận Token & Cookie (Không lộ password)
    // -------------------------------------------------------------
    console.log("\n[Test 2] Đăng nhập thành công Admin (admin/admin123)...");
    const res2 = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123" }),
    });
    console.log(`Status: ${res2.status} (Expected: 200)`);
    if (res2.status !== 200) throw new Error("Test 2 Failed: Expected 200");
    const data2 = await res2.json();
    if (!data2.accessToken) throw new Error("Test 2 Failed: Missing accessToken");
    if ("password" in data2.account) throw new Error("Test 2 Failed: Password leaked in login response!");
    console.log("Account info (an toàn, không có password):", data2.account);

    const setCookieHeader = res2.headers.get("set-cookie");
    if (!setCookieHeader || !setCookieHeader.includes("refreshToken=")) {
      throw new Error("Test 2 Failed: Missing refreshToken in Set-Cookie header");
    }
    const adminAccessToken = data2.accessToken;
    const cookieString = setCookieHeader.split(";")[0]; // "refreshToken=..."

    // -------------------------------------------------------------
    // Test 3: Truy cập Protected Route KHÔNG có Bearer Token -> 401
    // -------------------------------------------------------------
    console.log("\n[Test 3] Truy cập /students/me KHÔNG có token -> 401...");
    const res3 = await fetch(`${baseUrl}/api/v1/students/me`);
    console.log(`Status: ${res3.status} (Expected: 401)`);
    if (res3.status !== 401) throw new Error("Test 3 Failed: Expected 401 for unauthenticated request");

    // -------------------------------------------------------------
    // Test 4: Truy cập Protected Route với Bearer Token HẾT HẠN / SAI -> 401
    // -------------------------------------------------------------
    console.log("\n[Test 4] Truy cập với Token sai / hết hạn -> 401...");
    const expiredToken = jwt.sign(
      { matk: 1, username: "admin", role: "AD" },
      jwtConfig.accessSecret,
      { expiresIn: "-10s" } // Đã hết hạn trong quá khứ
    );
    const res4Expired = await fetch(`${baseUrl}/api/v1/accounts/me`, {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    console.log(`Status với Expired Token: ${res4Expired.status} (Expected: 401)`);
    if (res4Expired.status !== 401) throw new Error("Test 4 Failed: Expected 401 for expired token");

    const res4Invalid = await fetch(`${baseUrl}/api/v1/accounts/me`, {
      headers: { Authorization: "Bearer malformed.invalid.token" },
    });
    console.log(`Status với Malformed Token: ${res4Invalid.status} (Expected: 401)`);
    if (res4Invalid.status !== 401) throw new Error("Test 4 Failed: Expected 401 for malformed token");

    // -------------------------------------------------------------
    // Test 5: Đăng nhập Sinh viên (sv_20210001) và Giảng viên (gv_huong)
    // -------------------------------------------------------------
    console.log("\n[Test 5] Đăng nhập Sinh viên (SV) & Giảng viên (GV)...");
    const svLogin = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "sv_20210001", password: "123456" }),
    });
    const svData = await svLogin.json();
    const svToken = svData.accessToken;
    if ("password" in svData.account) throw new Error("Test 5 Failed: Password leaked in SV login!");

    const gvLogin = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "gv_huong", password: "123456" }),
    });
    const gvData = await gvLogin.json();
    const gvToken = gvData.accessToken;
    if ("password" in gvData.account) throw new Error("Test 5 Failed: Password leaked in GV login!");

    // -------------------------------------------------------------
    // Test 6: Role Guard & Chặn truy cập chéo dữ liệu (SV gọi route AD) -> 403
    // -------------------------------------------------------------
    console.log("\n[Test 6] Sinh viên (SV) truy cập endpoint AD (/accounts) -> 403 Forbidden...");
    const res6 = await fetch(`${baseUrl}/api/v1/accounts`, {
      headers: { Authorization: `Bearer ${svToken}` },
    });
    console.log(`Status: ${res6.status} (Expected: 403)`);
    if (res6.status !== 403) throw new Error("Test 6 Failed: SV was able to access AD accounts list!");

    // -------------------------------------------------------------
    // Test 7: Chặn SV xem trộm dữ liệu sinh viên khác (/students/20210002/grades) -> 403
    // -------------------------------------------------------------
    console.log("\n[Test 7] SV truy cập điểm của SV khác (/students/20210002/grades) -> 403...");
    const res7 = await fetch(`${baseUrl}/api/v1/students/20210002/grades`, {
      headers: { Authorization: `Bearer ${svToken}` },
    });
    console.log(`Status: ${res7.status} (Expected: 403)`);
    if (res7.status !== 403) throw new Error("Test 7 Failed: SV accessed another student's grades!");

    // -------------------------------------------------------------
    // Test 8: Chặn GV gọi endpoint riêng của SV (/students/me) -> 403
    // -------------------------------------------------------------
    console.log("\n[Test 8] Giảng viên gọi endpoint SV (/students/me) -> 403...");
    const res8 = await fetch(`${baseUrl}/api/v1/students/me`, {
      headers: { Authorization: `Bearer ${gvToken}` },
    });
    console.log(`Status: ${res8.status} (Expected: 403)`);
    if (res8.status !== 403) throw new Error("Test 8 Failed: GV should not be allowed on /students/me");

    // -------------------------------------------------------------
    // Test 9: Giới hạn dữ liệu theo user hiện tại (Dữ liệu cá nhân lấy từ token)
    // -------------------------------------------------------------
    console.log("\n[Test 9] SV gọi /students/me lấy đúng hồ sơ của chính mình...");
    const res9 = await fetch(`${baseUrl}/api/v1/students/me`, {
      headers: { Authorization: `Bearer ${svToken}` },
    });
    console.log(`Status: ${res9.status} (Expected: 200)`);
    if (res9.status !== 200) throw new Error("Test 9 Failed: SV could not access /students/me");
    const svProfile = await res9.json();
    console.log("SV Profile nhận được:", svProfile.data?.hoten || svProfile.data?.username || svProfile.data);

    // Không tin masv/matk lấy từ client khi cập nhật thông tin
    console.log("\n[Test 9b] SV thử gửi body giả mạo { masv: 99999, matk: 99999 } khi update...");
    const res9b = await fetch(`${baseUrl}/api/v1/students/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${svToken}`,
      },
      body: JSON.stringify({
        masv: 99999,
        matk: 99999,
        email: "verified.an@hust.edu.vn",
      }),
    });
    const updatedProfile = await res9b.json();
    if (updatedProfile.data?.masv === 99999 || updatedProfile.data?.matk === 99999) {
      throw new Error("Test 9b Failed: masv or matk was altered by client request!");
    }
    console.log("Xác nhận: masv/matk không bị thay đổi bởi client.");

    // -------------------------------------------------------------
    // Test 10: Kiểm tra API Account theo hợp đồng & Không lộ password
    // -------------------------------------------------------------
    console.log("\n[Test 10] Admin gọi danh sách tài khoản GET /accounts (Kiểm tra bảo mật mật khẩu)...");
    const res10 = await fetch(`${baseUrl}/api/v1/accounts`, {
      headers: { Authorization: `Bearer ${adminAccessToken}` },
    });
    console.log(`Status: ${res10.status} (Expected: 200)`);
    if (res10.status !== 200) throw new Error("Test 10 Failed: Admin cannot read /accounts");
    const accountsData = await res10.json();
    for (const acc of accountsData.data || []) {
      if ("password" in acc) {
        throw new Error(`Test 10 Failed: Password found in account record for ${acc.username}!`);
      }
    }
    console.log(`Đã kiểm tra ${accountsData.data?.length || 0} tài khoản: Không có trường password nào bị lộ.`);

    // -------------------------------------------------------------
    // Test 11: GET /accounts/me và GET /auth/me theo hợp đồng
    // -------------------------------------------------------------
    console.log("\n[Test 11] Kiểm tra GET /accounts/me và GET /auth/me...");
    const res11a = await fetch(`${baseUrl}/api/v1/accounts/me`, {
      headers: { Authorization: `Bearer ${svToken}` },
    });
    const res11b = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${svToken}` },
    });
    if (res11a.status !== 200 || res11b.status !== 200) throw new Error("Test 11 Failed: /accounts/me or /auth/me failed");
    const me1 = await res11a.json();
    const me2 = await res11b.json();
    if ("password" in me1.data || "password" in me2.data) throw new Error("Test 11 Failed: Password in me response!");
    console.log("GET /accounts/me và /auth/me hợp chuẩn và an toàn.");

    // -------------------------------------------------------------
    // Test 12: Làm mới Token (Refresh Token Rotation) -> 200 + Cặp Token Mới
    // -------------------------------------------------------------
    console.log("\n[Test 12] Gọi POST /api/v1/auth/refresh với Cookie...");
    const res12 = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookieString },
    });
    console.log(`Status: ${res12.status} (Expected: 200)`);
    if (res12.status !== 200) throw new Error("Test 12 Failed");
    const data12 = await res12.json();
    const newCookieHeader = res12.headers.get("set-cookie");
    const newCookieString = newCookieHeader?.split(";")[0];

    // -------------------------------------------------------------
    // Test 13: PHÁT HIỆN TÁI SỬ DỤNG (Reuse Detection) -> 403
    // -------------------------------------------------------------
    console.log("\n[Test 13] Gọi refresh với Refresh Token CŨ đã bị thu hồi -> 403...");
    const res13 = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookieString },
    });
    console.log(`Status: ${res13.status} (Expected: 403)`);
    if (res13.status !== 403) throw new Error("Test 13 Failed: Reused token should be rejected with 403");

    // -------------------------------------------------------------
    // Test 14: Đăng xuất (Logout) -> 200 + Xóa Cookie
    // -------------------------------------------------------------
    console.log("\n[Test 14] Đăng xuất POST /api/v1/auth/logout...");
    const res14 = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: "POST",
      headers: { Cookie: newCookieString || "" },
    });
    console.log(`Status: ${res14.status} (Expected: 200)`);
    if (res14.status !== 200) throw new Error("Test 14 Failed");

    console.log("\n=============================================================");
    console.log("🎉 TẤT CẢ 14 BÀI KIỂM THỬ XÁC THỰC & BẢO MẬT ĐÃ THÀNH CÔNG RỰC RỠ!");
    console.log("=============================================================");
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("❌ Test failed with error:", err);
  process.exit(1);
});
