async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  msg.innerText = ""; // clear old messages

  // ❗ Basic frontend validation
  if (!email || !password) {
    msg.innerText = "Please enter email and password";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    // ❌ login failed
    if (!res.ok) {
      msg.innerText = data.message || "Login failed";
      return;
    }

    // ✅ login success
    if (data.token) {
      localStorage.setItem("token", data.token);

      // 🔁 redirect to ZippieEats main page
      window.location.href = "index.html"; 
      // change to dashboard.html only if it exists
    } else {
      msg.innerText = "Invalid server response";
    }

  } catch (error) {
    console.error(error);
    msg.innerText = "Server error. Try again later.";
  }
}
