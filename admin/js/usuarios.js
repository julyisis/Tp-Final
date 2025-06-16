export async function cargarUsuarios() {
  const tbody = document.getElementById("usuariosBody");

  try {
    const res = await fetch("https://dummyjson.com/users");
    const data = await res.json();

    tbody.innerHTML = ""; // Limpia antes de cargar

    data.users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.firstName} ${user.lastName}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td><img src="${user.image}" width="50" class="rounded-circle" /></td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger">Error al cargar usuarios</td></tr>`;
  }
}

