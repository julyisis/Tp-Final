if (!sessionStorage.getItem("accessToken")) {
            alert("Debes iniciar sesión para acceder.");
            window.location.href = "../login.html";
        }