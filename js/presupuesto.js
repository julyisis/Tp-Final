import { getSalones, getServicios, guardarPresupuesto } from "../admin/js/storage.js";

export function configurarPresupuestoModal() {
  const salones = getSalones();
  const servicios = getServicios();
  const selectSalon = document.getElementById('selectSalon');
  const selectTematica = document.getElementById('selectTematica');
  const serviciosContainer = document.getElementById('serviciosContainer');
  const calcularBtn = document.getElementById('calcularBtn');
  
  // Verificar existencia de elementos críticos
  const resumenPresupuesto = document.getElementById('resumenPresupuesto');
  const detallePresupuesto = document.getElementById('detallePresupuesto');
  const totalPresupuesto = document.getElementById('totalPresupuesto');

  if (!selectSalon || !selectTematica || !serviciosContainer || !calcularBtn || 
     !resumenPresupuesto || !detallePresupuesto || !totalPresupuesto) {
    console.error('Error: Elementos críticos del formulario no encontrados');
    return;
  }

  salones.forEach(salon => {
    const option = document.createElement('option');
    option.value = salon.id;
    option.textContent = salon.nombre;
    selectSalon.appendChild(option);
  });

  const tematicas = ['Infantil', 'Adultos', 'Fiesta Blanca', 'Casamiento', 'Cumpleaños', 'Otro'];
  tematicas.forEach(tematica => {
    const option = document.createElement('option');
    option.value = tematica;
    option.textContent = tematica;
    selectTematica.appendChild(option);
  });

  // Función para actualizar servicios disponibles según salón seleccionado
  function actualizarServiciosDisponibles() {
    const salonId = parseInt(selectSalon.value);
    const salon = salones.find(s => s.id === salonId);
    
    // Limpiar contenedor de servicios
    serviciosContainer.innerHTML = '';
    
    if (!salon || !salon.servicios) {
      serviciosContainer.innerHTML = '<p>Este salón no tiene servicios disponibles</p>';
      return;
    }
    
    // Filtrar servicios y mostrar solo los disponibles para este salón
    const serviciosDisponibles = servicios.filter(servicio => 
      salon.servicios.includes(servicio.id)
    );
    
    if (serviciosDisponibles.length === 0) {
      serviciosContainer.innerHTML = '<p>Este salón no tiene servicios disponibles</p>';
      return;
    }
    
    serviciosDisponibles.forEach(servicio => {
      const div = document.createElement('div');
      div.className = 'form-check mb-2';
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${servicio.id}" id="servicio-${servicio.id}">
        <label class="form-check-label" for="servicio-${servicio.id}">
          ${servicio.nombre} - $${servicio.precio}
        </label>
      `;
      serviciosContainer.appendChild(div);
    });
  }

  selectSalon.addEventListener('change', actualizarServiciosDisponibles);
  
  if (salones.length > 0) {
    actualizarServiciosDisponibles();
  }

  //Evento de cálculo
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
        .filter(servicio => servicio !== undefined);
      
      const fechaEvento = document.getElementById('fechaEvento')?.value;
      const nombreCliente = document.getElementById('nombreCliente')?.value;
      const apellidoCliente = document.getElementById('apellidoCliente')?.value;
      
      if (!salon || !fechaEvento || !nombreCliente || !apellidoCliente || !tematica) {
        alert('Por favor complete todos los campos obligatorios');
        return;
      }

      let total = salon.precio;
      serviciosSeleccionados.forEach(serv => total += serv.precio);
      
      detallePresupuesto.innerHTML = `
        <p><strong>Cliente:</strong> ${apellidoCliente}, ${nombreCliente}</p>
        <p><strong>Salón:</strong> ${salon.nombre} - $${salon.precio}</p>
        <p><strong>Temática:</strong> ${tematica}</p>
        <p><strong>Fecha:</strong> ${fechaEvento}</p>
        ${serviciosSeleccionados.length > 0 ? 
          `<p><strong>Servicios:</strong></p><ul>${
            serviciosSeleccionados.map(s => `<li>${s.nombre} - $${s.precio}</li>`).join('')
          }</ul>` : '<p>No se seleccionaron servicios adicionales</p>'}
      `;
      
      totalPresupuesto.textContent = `$${total}`;
      
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