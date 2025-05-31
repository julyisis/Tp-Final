const contenido = document.getElementById("contenido");
const links = document.querySelectorAll("#menu a");

async function cargarVista(vista) {
    const res = await fetch(`./admin/vistas/${vista}.html`);
    const html = await res.text();
    contenido.innerHTML = html;

    // Lógica específica por vista
    if (vista === "salones") {
        const { initSalones } = await import("./salones.js");
        initSalones();
    } else if (vista === "servicios") {
        const { initServicios } = await import("./servicios.js");
        initServicios();
    }
}

// Manejador de clicks del menú
links.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const vista = e.target.dataset.view;
        cargarVista(vista);
    });
});

// Carga inicial
cargarVista("salones");
