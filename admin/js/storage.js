const INITIAL_DATA = {
    salones: [
        {
            id: 1,
            nombre: "Salón Principal",
            capacidad: 100,
            ubicacion: "Planta Baja",
            precio: 1500,
            descripcion: "Salón amplio con iluminación natural",
            servicios: [1, 2],
            imagen: "./admin/img/salon1.jpeg"
        },
        {
            id: 2,
            nombre: "Salón VIP",
            capacidad: 40,
            ubicacion: "Primer Piso",
            precio: 2500,
            descripcion: "Salón exclusivo con terraza privada",
            servicios: [2, 3],
            imagen: "./admin/img/salon2.jpeg"
        },
        {
            id: 3,
            nombre: "Salón Jardín",
            capacidad: 60,
            ubicacion: "Exterior",
            precio: 1800,
            descripcion: "Salón con vista al jardín y acceso al aire libre",
            servicios: [1, 3],
            imagen: "./admin/img/salon3.jpeg"
        }
    ],
    servicios: [
        {
            id: 1,
            nombre: "Catering básico",
            precio: 800
        },
        {
            id: 2,
            nombre: "Sonido profesional",
            precio: 1200
        },
        {
            id: 3,
            nombre: "Decoración personalizada",
            precio: 1000
        }
    ]
};


function initStorage() {
    if (!localStorage.getItem("salones")) {
        localStorage.setItem("salones", JSON.stringify(INITIAL_DATA.salones));
    }
    if (!localStorage.getItem("servicios")) {
        localStorage.setItem("servicios", JSON.stringify(INITIAL_DATA.servicios));
    }
}

// Salones
export function getSalones() {
    return JSON.parse(localStorage.getItem("salones") || "[]");
}
export function saveSalones(salones) {
    localStorage.setItem("salones", JSON.stringify(salones));
}
export function addSalon(salon) {
    const salones = getSalones();
    salon.id = Date.now();
    salones.push(salon);
    saveSalones(salones);
}
export function updateSalon(id, newSalon) {
    const salones = getSalones().map(s => s.id === id ? { ...newSalon, id } : s);
    saveSalones(salones);
}
export function deleteSalon(id) {
    const salones = getSalones().filter(s => s.id !== id);
    saveSalones(salones);
}

// Servicios
export function getServicios() {
    return JSON.parse(localStorage.getItem("servicios") || "[]");
}
export function saveServicios(servicios) {
    localStorage.setItem("servicios", JSON.stringify(servicios));
}
export function addServicio(servicio) {
    const servicios = getServicios();
    servicio.id = Date.now();
    servicios.push(servicio);
    saveServicios(servicios);
}
export function updateServicio(id, newData) {
    const servicios = getServicios().map(s => s.id === id ? { ...newData, id } : s);
    saveServicios(servicios);
}
export function deleteServicio(id) {
    const servicios = getServicios().filter(s => s.id !== id);
    saveServicios(servicios);
}

initStorage();
