document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorDiv = document.getElementById("error");

  try {
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) throw new Error("Credenciales inválidas");

    const data = await res.json();
    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("user", JSON.stringify(data)); 
    window.location.href = "./admin/index.html";
  } catch (err) {
    errorDiv.textContent = err.message;
  }
});



