async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registered successfully. Please login.");
    window.location.href = "login.html";
  } else {
    document.getElementById("msg").innerText = data.message;
  }
}
