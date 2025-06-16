const user = JSON.parse(sessionStorage.getItem("user"));
if (user) {
    document.getElementById("userInfo").textContent = `Bienvenid@, ${user.firstName}`;
}