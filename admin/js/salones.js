// salones.js
import { getSalones, saveSalones, deleteSalon, getServicios } from './storage.js';
let imagenBase64 = "";
// Renderiza la tabla de salones con filtros
export function renderTabla() {
    const salones = getSalones();
    const servicios = getServicios();

    const filtroNombre = document.getElementById("buscadorNombre").value.toLowerCase();
    const filtroCapacidad = parseInt(document.getElementById("filtroCapacidad").value);
    const filtroPrecio = parseFloat(document.getElementById("filtroPrecio").value);

    const tbody = document.getElementById("salonesBody");
    tbody.innerHTML = "";

    salones
        .filter(s => {
            return (!filtroNombre || s.nombre.toLowerCase().includes(filtroNombre)) &&
                   (!filtroCapacidad || s.capacidad >= filtroCapacidad) &&
                   (!filtroPrecio || s.precio <= filtroPrecio);
        })
        .forEach(salon => {
            const serviciosTexto = salon.servicios?.map(id => {
                const serv = servicios.find(s => s.id === id);
                return serv ? serv.nombre : "N/A";
            }).join(", ") || "";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${salon.nombre}</td>
                <td>${salon.capacidad}</td>
                <td>${salon.ubicacion}</td>
                <td>$${salon.precio.toFixed(2)}</td>
                <td>${serviciosTexto}</td>
                <td><img src="${salon.imagen}" alt="Imagen" style="max-width: 100px;"></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarSalon(${salon.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarSalon(${salon.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
}

function getBase64FromFile(file) {
    return new Promise((resolve, reject) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Maneja guardar salón
export function setupFormulario() {
    const form = document.getElementById("salonForm");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const id = document.getElementById("salonId").value;
        const nombre = document.getElementById("nombre").value;
        const capacidad = parseInt(document.getElementById("capacidad").value);
        const ubicacion = document.getElementById("ubicacion").value;
        const precio = parseFloat(document.getElementById("precio").value);
        const descripcion = document.getElementById("descripcion").value;
        const serviciosSeleccionados = Array.from(document.querySelectorAll('#serviciosCheckboxes input:checked')).map(cb => parseInt(cb.value));
        const imagenInput = document.getElementById("imagen");

        const nuevoSalon = {
            id: id ? parseInt(id) : Date.now(),
            nombre,
            capacidad,
            ubicacion,
            precio,
            descripcion,
            servicios: serviciosSeleccionados,
            imagen: imagenBase64 || ""
        };

        let salones = getSalones();
        if (id) {
            // Editar existente
            salones = salones.map(s => s.id === parseInt(id) ? nuevoSalon : s);
        } else {
            // Agregar nuevo
            salones.push(nuevoSalon);
        }
        saveSalones(salones);
        renderTabla();
        bootstrap.Modal.getInstance(document.getElementById("salonModal")).hide();
    });

    document.getElementById("imagen").addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            imagenBase64 = reader.result;
        };
        reader.readAsDataURL(file);
    } else {
        imagenBase64 = "";
    }
});
}

// Elimina un salón
window.eliminarSalon = function(id) {
    if (confirm("¿Estás seguro de eliminar este salón?")) {
        deleteSalon(id);
        renderTabla();
    }
};

// Edita un salón
window.editarSalon = function(id) {
    const salon = getSalones().find(s => s.id === id);
    if (!salon) return;

    document.getElementById("salonId").value = salon.id;
    document.getElementById("nombre").value = salon.nombre;
    document.getElementById("capacidad").value = salon.capacidad;
    document.getElementById("ubicacion").value = salon.ubicacion;
    document.getElementById("precio").value = salon.precio;
    document.getElementById("descripcion").value = salon.descripcion;

    const input = document.getElementById("imagen");
    const previewExistente = input.nextElementSibling;
    if (previewExistente && previewExistente.tagName === "IMG") {
        previewExistente.remove();
    }

    if (salon.imagen) {
    const preview = document.createElement("img");
    preview.src = salon.imagen;
    preview.style.maxWidth = "100px";
    const input = document.getElementById("imagen");
    input.insertAdjacentElement("afterend", preview);
}

    const checkboxes = document.querySelectorAll('#serviciosCheckboxes input');
    checkboxes.forEach(cb => {
        cb.checked = salon.servicios.includes(parseInt(cb.value));
    });

    const modal = new bootstrap.Modal(document.getElementById("salonModal"));
    modal.show();
};

// Inicializa checkboxes de servicios
export function renderServiciosCheckboxes() {
    const servicios = getServicios();
    const container = document.getElementById("serviciosCheckboxes");
    container.innerHTML = "";
    servicios.forEach(serv => {
        const div = document.createElement("div");
        div.className = "form-check";
        div.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${serv.id}" id="serv-${serv.id}">
            <label class="form-check-label" for="serv-${serv.id}">${serv.nombre}</label>
        `;
        container.appendChild(div);
    });
}

// Setup de filtros
export function setupFiltros() {
    document.getElementById("buscadorNombre").addEventListener("input", renderTabla);
    document.getElementById("filtroCapacidad").addEventListener("input", renderTabla);
    document.getElementById("filtroPrecio").addEventListener("input", renderTabla);
    document.getElementById("btnLimpiarFiltros").addEventListener("click", () => {
        document.getElementById("buscadorNombre").value = "";
        document.getElementById("filtroCapacidad").value = "";
        document.getElementById("filtroPrecio").value = "";
        renderTabla();
    });
}



// Inicializar todo
export function initSalones() {
    renderServiciosCheckboxes();
    setupFormulario();
    setupFiltros();
    renderTabla();
}
