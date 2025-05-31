import { getSalones, getServicios } from "../admin/js/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("salones");

  if (!container) return;

  const salones = getSalones();

  const row = document.createElement("div");
  row.className = "row g-4";

  salones.forEach((salon) => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-3";

    col.innerHTML = `
      <div class="card h-100">
        <img src="${salon.id == 1 || salon.id == 2 || salon.id == 3 ? './admin'+salon.imagen.slice(1) : ''}" class="card-img-top h-50" alt="imagen ${salon.nombre}">
        <div class="card-body text-center">
          <p class="card-text">${salon.nombre}</p>
          <a href="#" class="btn btn-primary" onclick="mostrarSalon(${salon.id})">Mostrar</a>
        </div>
      </div>
    `;

    row.appendChild(col);
  });

  // Limpiar el contenedor y agregar el nuevo contenido
  container.innerHTML = `<h2 class="text-center mb-5">Salones para tus Fiestas</h2>`;
  container.appendChild(row);
});


window.mostrarSalon = function(id) {
    const salon = getSalones().find(s => s.id === id);
    const servicios = getServicios();
    if (!salon) return;

    const serviciosTexto = salon.servicios.map(sid => {
        const serv = servicios.find(s => s.id === sid);
        return serv ? `<li>${serv.nombre} - $${serv.precio}</li>` : '';
    }).join("");

    const html = `
        <div class="row">
            <div class="col-md-6">
                <img src="${salon.imagen}" alt="Imagen de ${salon.nombre}" class="img-fluid rounded">
            </div>
            <div class="col-md-6">
                <h4>${salon.nombre}</h4>
                <p><strong>Ubicación:</strong> ${salon.ubicacion}</p>
                <p><strong>Capacidad:</strong> ${salon.capacidad} personas</p>
                <p><strong>Precio:</strong> $${salon.precio}</p>
                <p><strong>Descripción:</strong> ${salon.descripcion}</p>
                <p><strong>Servicios incluidos:</strong></p>
                <ul>${serviciosTexto}</ul>
            </div>
        </div>
    `;

    document.getElementById("infoSalonBody").innerHTML = html;
    const modal = new bootstrap.Modal(document.getElementById("infoSalonModal"));
    modal.show();
};
