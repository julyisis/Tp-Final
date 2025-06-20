export function cargarPresupuestos() {
    const presupuestos = JSON.parse(localStorage.getItem('presupuestos') || '[]');
    const tabla = document.getElementById('tablaPresupuestos');
    
    if (!tabla) {
        console.error('No se encontró la tabla de presupuestos');
        return;
    }

    tabla.innerHTML = '';
    
    if (presupuestos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    No hay presupuestos registrados
                </td>
            </tr>
        `;
        return;
    }

    presupuestos.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.apellidoNombre}</td>
            <td>${p.fecha}</td>
            <td>${p.tematica}</td>
            <td>${p.salon}</td>
            <td>${p.servicios}</td>
            <td>$${p.valorTotal}</td>
        `;
        tabla.appendChild(tr);
    });
}