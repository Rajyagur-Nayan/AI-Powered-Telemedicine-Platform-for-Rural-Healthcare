const initialProtocol = "http";
const host = "localhost";
const port = 4000;
const baseUrl = `${initialProtocol}://${host}:${port}/api`;

const email = `testpatient${Math.floor(Math.random() * 10000)}@example.com`;
const password = "password123";

let cookie = "";

async function runTests() {
  console.log("🚀 Starting API Verification...");

  // 1. Register
  console.log("\n--- 1. Registering ---");
  try {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name: "Test Patient",
        role: "PATIENT",
      }),
    });

    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);

    if (res.status === 201) {
      // Extract cookie
      const setCookie = res.headers.get("set-cookie");
      if (setCookie) {
        cookie = setCookie.split(";")[0];
        console.log("✅ Cookie received:", cookie);
      } else {
        console.warn("⚠️ No cookie received in register response");
        // Try to fallback to token if needed, but middleware needs cookie.
        // If no cookie, we might manually set it if we have token
        if (data.token) {
          cookie = `token=${data.token}`;
          console.log("✅ constructed cookie from token:", cookie);
        }
      }
    } else {
      console.error("❌ Register failed");
      return;
    }
  } catch (err) {
    console.error("❌ Register error:", err);
    return;
  }

  // 2. Get Profile
  console.log("\n--- 2. Get Profile ---");
  try {
    const res = await fetch(`${baseUrl}/users/profile`, {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", data);
  } catch (err) {
    console.error("❌ Get Profile error:", err);
  }

  // 3. Update Profile
  console.log("\n--- 3. Update Profile ---");
  try {
    const res = await fetch(`${baseUrl}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify({
        age: 30,
        gender: "Male",
        address: "123 Village Road",
      }),
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", data);
  } catch (err) {
    console.error("❌ Update Profile error:", err);
  }

  // 4. List Doctors
  console.log("\n--- 4. List Doctors ---");
  try {
    const res = await fetch(`${baseUrl}/users/doctors`);
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data (count):", data.length);
  } catch (err) {
    console.error("❌ List doctors error:", err);
  }

  // 5. List Appointments
  console.log("\n--- 5. List Appointments ---");
  try {
    const res = await fetch(`${baseUrl}/appointments`, {
      headers: { Cookie: cookie },
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", data);
  } catch (err) {
    console.error("❌ List appointments error:", err);
  }

  console.log("\n✅ Verification Completed.");
}

runTests();
