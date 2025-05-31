import {
    getServicios,
    addServicio,
    updateServicio,
    deleteServicio
} from "./storage.js";

function renderServicios() {
    const servicios = getServicios();
    const tbody = document.getElementById("serviciosBody");
    tbody.innerHTML = "";

    servicios.forEach(servicio => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${servicio.nombre}</td>
            <td>$${servicio.precio.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2 editar-servicio" data-id="${servicio.id}">Editar</button>
                <button class="btn btn-sm btn-danger eliminar-servicio" data-id="${servicio.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Agregar eventos
    document.querySelectorAll(".editar-servicio").forEach(btn =>
        btn.addEventListener("click", () => cargarServicioEnFormulario(Number(btn.dataset.id)))
    );
    document.querySelectorAll(".eliminar-servicio").forEach(btn =>
        btn.addEventListener("click", () => {
            if (confirm("¿Seguro que deseas eliminar este servicio?")) {
                deleteServicio(Number(btn.dataset.id));
                renderServicios();
            }
        })
    );
}

function guardarServicio() {
    const nombre = document.getElementById("nombreServicio").value.trim();
    const precio = parseFloat(document.getElementById("precioServicio").value);
    const id = document.getElementById("servicioId").value;

    if (!nombre || isNaN(precio)) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    if (id) {
        updateServicio(Number(id), { nombre, precio });
    } else {
        addServicio({ nombre, precio });
    }

    renderServicios();
    bootstrap.Modal.getOrCreateInstance(document.getElementById("servicioModal")).hide();
    document.getElementById("servicioForm").reset();
    document.getElementById("servicioId").value = "";
    document.getElementById("modalTitleServicio").textContent = "Agregar Servicio";
}

function cargarServicioEnFormulario(id) {
    const servicio = getServicios().find(s => s.id === id);
    if (servicio) {
        document.getElementById("servicioId").value = servicio.id;
        document.getElementById("nombreServicio").value = servicio.nombre;
        document.getElementById("precioServicio").value = servicio.precio;
        document.getElementById("modalTitleServicio").textContent = "Editar Servicio";
        bootstrap.Modal.getOrCreateInstance(document.getElementById("servicioModal")).show();
    }
}

export  function initServicios() {
    document.getElementById("saveServicio").addEventListener("click", guardarServicio);
    renderServicios();
}
