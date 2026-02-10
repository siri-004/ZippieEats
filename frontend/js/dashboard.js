const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

async function loadProfile() {
  const res = await fetch("http://localhost:5000/api/user/profile", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  document.getElementById("userData").innerText =
    JSON.stringify(data);
}

loadProfile();

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
