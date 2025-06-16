document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  window.location.href = "../login.html";
});
