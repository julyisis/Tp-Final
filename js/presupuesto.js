import { getSalones, getServicios, guardarPresupuesto } from "../admin/js/storage.js";

export function configurarPresupuestoModal() {
  const salones = getSalones();
  const servicios = getServicios();
  const selectSalon = document.getElementById('selectSalon');
  const selectTematica = document.getElementById('selectTematica');
  const serviciosContainer = document.getElementById('serviciosContainer');
  const calcularBtn = document.getElementById('calcularBtn');
  
  // Verificar existencia de elementos críticos
  const descargarBtn = document.getElementById('descargarBtn');
  const resumenPresupuesto = document.getElementById('resumenPresupuesto');
  const detallePresupuesto = document.getElementById('detallePresupuesto');
  const totalPresupuesto = document.getElementById('totalPresupuesto');

  if (!selectSalon || !selectTematica || !serviciosContainer || !calcularBtn || 
     !resumenPresupuesto || !detallePresupuesto || !totalPresupuesto) {
    console.error('Error: Elementos críticos del formulario no encontrados');
    return;
  }

  // Llenar select de salones
  salones.forEach(salon => {
    const option = document.createElement('option');
    option.value = salon.id;
    option.textContent = salon.nombre;
    selectSalon.appendChild(option);
  });

  // Llenar select de temáticas
  const tematicas = ['Infantil', 'Adultos', 'Fiesta Blanca', 'Casamiento', 'Cumpleaños', 'Otro'];
  tematicas.forEach(tematica => {
    const option = document.createElement('option');
    option.value = tematica;
    option.textContent = tematica;
    selectTematica.appendChild(option);
  });

  // Llenar checkboxes de servicios
  servicios.forEach(servicio => {
    const div = document.createElement('div');
    div.className = 'form-check';
    div.innerHTML = `
      <input class="form-check-input" type="checkbox" value="${servicio.id}" id="servicio-${servicio.id}">
      <label class="form-check-label" for="servicio-${servicio.id}">
        ${servicio.nombre} - $${servicio.precio}
      </label>
    `;
    serviciosContainer.appendChild(div);
  });

  // Configurar evento de cálculo
  calcularBtn.addEventListener('click', () => {
    try {
      const salonId = parseInt(selectSalon.value);
      const salon = salones.find(s => s.id === salonId);
      const tematica = selectTematica.value;
      const serviciosSeleccionados = Array.from(document.querySelectorAll('#serviciosContainer input:checked'))
        .map(checkbox => {
          const servicioId = parseInt(checkbox.value);
          return servicios.find(s => s.id === servicioId);
        })
        .filter(servicio => servicio !== undefined); // Filtrar servicios no encontrados
      
      const fechaEvento = document.getElementById('fechaEvento')?.value;
      const nombreCliente = document.getElementById('nombreCliente')?.value;
      const apellidoCliente = document.getElementById('apellidoCliente')?.value;
      
      // Validación de campos
      if (!salon || !fechaEvento || !nombreCliente || !apellidoCliente || !tematica) {
        alert('Por favor complete todos los campos obligatorios');
        return;
      }

      // Calcular total
      let total = salon.precio;
      serviciosSeleccionados.forEach(serv => total += serv.precio);

      // Mostrar resumen
      detallePresupuesto.innerHTML = `
        <p><strong>Cliente:</strong> ${apellidoCliente}, ${nombreCliente}</p>
        <p><strong>Salón:</strong> ${salon.nombre} - $${salon.precio}</p>
        <p><strong>Temática:</strong> ${tematica}</p>
        <p><strong>Fecha:</strong> ${fechaEvento}</p>
        ${serviciosSeleccionados.length > 0 ? 
          `<p><strong>Servicios:</strong></p><ul>${
            serviciosSeleccionados.map(s => `<li>${s.nombre} - $${s.precio}</li>`).join('')
          }</ul>` : ''}
      `;
      
      totalPresupuesto.textContent = `$${total}`;
      
      // Mostrar elementos (con verificación adicional)
      if (resumenPresupuesto) resumenPresupuesto.classList.remove('d-none');
      
      // Crear y guardar presupuesto
      const nuevoPresupuesto = {
        id: Date.now(),
        apellidoNombre: `${apellidoCliente}, ${nombreCliente}`,
        fecha: fechaEvento,
        tematica: tematica,
        valorTotal: total,
        servicios: serviciosSeleccionados.map(s => s.nombre),
        salon: salon.nombre,
        fechaCreacion: new Date().toISOString()
      };
      
      guardarPresupuesto(nuevoPresupuesto);
      
    } catch (error) {
      console.error('Error al calcular presupuesto:', error);
      alert('Ocurrió un error al calcular el presupuesto');
    }
  });
}