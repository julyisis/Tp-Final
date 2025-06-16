const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("accessToken");

if (user == null || !token) {
            window.location.href = "../../login.html";
}else{    
     document.getElementById("userInfo").textContent = `Bienvenid@, ${user.firstName}`;
}
