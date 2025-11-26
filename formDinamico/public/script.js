const ADMIN_PASSWORD = "Admin123"; 
//br:let usuarios = [];
let tipoSeleccionado = null; 
let usuarioActual = null;
let mapa = null;
let marcadorTemporal = null; // Necesario para el mapa

// Intentar cargar datos de localStorage al inicio
/*if (localStorage.getItem('usuarios_data')) {
    usuarios = JSON.parse(localStorage.getItem('usuarios_data'));
}

// Función para guardar datos en localStorage (simulando base de datos)
function guardarUsuarios() {
    localStorage.setItem('usuarios_data', JSON.stringify(usuarios));
}
(MODIFICADOxbr)*/
function ocultarTodo() {
    document.querySelectorAll(".card").forEach(c => c.classList.add("hidden"));
}

function volverInicio() {
  // 1. Eliminar clases de estilo completo del body y del contenedor del mapa
    document.body.classList.remove("map-view");
    document.getElementById("mapaContainer").classList.remove("full-map-container");
  
    ocultarTodo();
    document.getElementById("inicio").classList.remove("hidden");
    document.getElementById("selectTipo").value = ""; 
    
    // Limpiar campos de registro
    document.getElementById("formUsuario").reset();
    usuarioActual = null;
    
    // Destruir el mapa si existe al volver al inicio
    if (mapa) {
        mapa.remove();
        mapa = null;
    }
}

// Lógica de selección inicial (Operador/Admin)
function seleccionarTipo() {
    tipoSeleccionado = document.getElementById("selectTipo").value;
    ocultarTodo();
    document.getElementById("inicio").classList.remove("hidden");
    
    // Ocultar el selector de rol al inicio
    document.getElementById("rolRegistroContainer").style.display = 'none';

    if (tipoSeleccionado === "operador") {
        document.getElementById("inicio").classList.add("hidden");
        document.getElementById("nombreUsuario").required = true; 
        mostrarFormularioRegistro();
    } else if (tipoSeleccionado === "admin") {
        document.getElementById("inicio").classList.add("hidden");
        document.getElementById("nombreUsuario").required = false; 
        document.getElementById("loginAdmin").classList.remove("hidden");
    }
}

// Lógica de verificación de administrador
function verificarAdmin() {
    const inputPassword = document.getElementById("adminPassword");
    if (inputPassword.value === ADMIN_PASSWORD) {
        ocultarTodo();
        document.getElementById("opcionesAdmin").classList.remove("hidden");
        inputPassword.value = "";

    } else {
        alert("Contraseña incorrecta.");
        inputPassword.value = "";
    }
}

// Muestra el formulario de registro (usado por Operador y Admin)
function mostrarFormularioRegistro() {
    ocultarTodo();
    document.getElementById("formUsuario").classList.remove("hidden");
    document.getElementById("fechaRegistro").textContent = new Date().toLocaleDateString('es-ES');
}

// Función que ejecuta el Admin si decide "Continuar con Registro"
function elegirContinuarRegistro() {
    // Si el admin está agregando, mostramos el selector de rol (Admin/Operador)
    if (tipoSeleccionado === 'admin') {
        document.getElementById("rolRegistroContainer").style.display = 'block';
        document.getElementById("nombreUsuario").required = true; // El admin debe nombrar al usuario a registrar
    } else {
        document.getElementById("nombreUsuario").required = true; // Es un operador
    }
    mostrarFormularioRegistro();
}

// Cancelar registro (vuelve al inicio)
function cancelarRegistro() {
    volverInicio();
}

// Lógica para la ubicación automática (Geolocalización)
function obtenerUbicacionAutomatica() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById("lat").value = position.coords.latitude;
                document.getElementById("lng").value = position.coords.longitude;
                alert("Ubicación obtenida automáticamente.");
            },
            (error) => {
                alert("Error al obtener la ubicación: " + error.message + ". Por favor, ingrésela manualmente.");
            }
        );
    } else {
        alert("Tu navegador no soporta la geolocalización. Por favor, ingresa la latitud y longitud manualmente.");
    }
}

function obtenerColorPorEnfermedad(enfermedad) {
    switch (enfermedad.toLowerCase()) {
        case 'dengue': return 'red';
        case 'leishmaniasis': return 'orange';
        case 'chikungunya': return 'purple';
        case 'otros': return 'gray';
        default: return 'blue';
    }
}

function centrarEnUbicacionActual() {
    if (navigator.geolocation && mapa) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentLat = position.coords.latitude;
                const currentLng = position.coords.longitude;
                mapa.setView([currentLat, currentLng], 13); 
                L.marker([currentLat, currentLng]).addTo(mapa).bindPopup("Mi ubicación actual").openPopup();
            },
            (error) => {
                console.warn('Geolocalización denegada o fallida.');
            }
        );
    }
}

// --- Lógica del Formulario y Conexión al Backend ---
document.getElementById("formUsuario").addEventListener("submit", async (e) =>{
    e.preventDefault();
    /*MODIFICADO
    const nombre = document.getElementById("nombreUsuario").value;
    const enfermedad = document.getElementById("enfermedad").value;
    const apreciaciones = document.getElementById("apreciaciones").value;
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    // email generado automáticamente para simplificar
    const fecha = document.getElementById("fechaRegistro").textContent;
    const rolRegistrado = tipoSeleccionado === 'admin' ? document.getElementById("rolRegistro").value : 'operador';
    */
    
    // --- NUEVA LÓGICA PARA MÚLTIPLES ENFERMEDADES ---
    const checkedBoxes = document.querySelectorAll('input[name="enfermedad_multiple"]:checked');
    
    if (checkedBoxes.length === 0) {
        alert('Debes seleccionar al menos una enfermedad.');
        return;
    }

    // Unir todas las enfermedades seleccionadas en una sola cadena separada por coma
    const enfermedadesSeleccionadas = Array.from(checkedBoxes).map(cb => cb.value).join(', '); 
    // Ahora 'enfermedadesSeleccionadas' contendrá algo como: "dengue, chikungunya"
    // -------------------------------------------------------------------------
    
    const nombre = document.getElementById("nombreUsuario").value.trim();
    const email = document.getElementById("emailUsuario").value.trim();
    // --- INICIO DEL CAMBIO ---
    const estadoInicial = document.getElementById("estadoInicial").value; 
    // --- FIN DEL CAMBIO ---
    const apreciaciones = document.getElementById("apreciaciones").value;
    const lat = document.getElementById("lat").value; // Dejar como string aquí
    const lng = document.getElementById("lng").value; // Dejar como string aquí
    const fotoFile = document.getElementById("foto").files[0]; // Obtener el archivo
    const rolRegistrado = tipoSeleccionado === 'admin' ? document.getElementById("rolRegistro").value : 'operador';
    const fecha = document.getElementById("fechaRegistro").textContent;
    //Inicializar FormData al inicio y validar
    const formData = new FormData()
    formData.append('nombre', nombre);
    formData.append('estado', estadoInicial);
    formData.append('email', email);

    /*if (fotoFile) {
        formData.append('foto', fotoFile);
    }*/

    /*preparar datos para enviar
    if (!nombre || !email || isNaN(lat) || isNaN(lng) || !apreciaciones) {
    alert('Por favor completá todos los campos obligatorios.');
    return;
  }*/
    // Validaciones
    if (!nombre || !email || lat === "" || lng === "" || !apreciaciones) {
        alert('Por favor completá todos los campos obligatorios.');
        return;
    }
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
        alert('La Latitud y Longitud deben ser números válidos.');
        return;
    }
  
  formData.append('nombre', nombre);
  formData.append('email', email);
  formData.append('enfermedad', enfermedadesSeleccionadas);
  formData.append('apreciaciones', apreciaciones);
  formData.append('lat', lat); // 🚨 Envío de Latitud/Longitud
  formData.append('lng', lng); // 🚨 Envío de Latitud/Longitud
  formData.append('rol', rolRegistrado);
  formData.append('fecha', fecha);
    /*const rolRegistrado = tipoSeleccionado === 'admin' ? document.getElementById("rolRegistro").value : 'operador';
    usuarioActual = {
        nombre,
        email,// AHORA USAMOS EL EMAIL FIJO INGRESADO
        //string con lasselecciones multiples
        enfermedad: enfermedadesSeleccionadas,
        apreciaciones,
        latitud: lat,
        longitud: lng,
        rol: rolRegistrado,
        fechaRegistro: fecha
  };*/
    // Agregar la foto si existe (CRÍTICO: debe ir después de la inicialización de formData)
    if (fotoFile) {
        formData.append('foto', fotoFile);
    }
  // Guardar ubicación en localStorage
  //localStorage.setItem("ultimaUbicacion", JSON.stringify({ lat, lng }));  
  localStorage.setItem("ultimaUbicacion", JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) }));

  try {
    const res = await fetch('http://localhost:3000/registros', {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        body: formData//JSON.stringify(usuarioActual)
       
    });


    if (res.ok) {
      const data = await res.json(); //agregado a la lista
      //usuarioActual.id = data.id; //devuelve ID
      usuarioActual = { ...data, latitud: data.latitud, longitud: data.longitud };

      /*Actualizar usuarioActual con los nombres correctos de Sequelize
      usuarioActual.latitud = data.latitud;
      usuarioActual.longitud = data.longitud;*/

      document.getElementById("formUsuario").classList.add("hidden");
      mostrarResumen();   //muestra el panel
    } else {
      // Manejar error del servidor (ej. 400, 409)
            const errorData = await res.json();
            alert("Error al enviar el registro: " + (errorData.error || res.statusText));
            console.error("Error del servidor:", errorData);
    }
  } catch (error) {
    console.error("Error de conexión:", error);
  }
});

//MODIFICADO
    /*const fotoInput = document.getElementById("foto");
  if (fotoInput.files.length > 0) {
    formData.append("foto", fotoInput.files[0]);
  }

    // Determinar el rol final del usuario a registrar
    let rolRegistrado;
    if (tipoSeleccionado === 'admin') {
        // Si el admin está agregando, toma el valor del selector de rol (Admin/Operador)
        rolRegistrado = document.getElementById("rolRegistro").value;
    } else {
        // Si es un operador usando el formulario, su rol es 'operador'.
        rolRegistrado = 'operador';
    }

    // Validación manual para el campo nombre
    if (!nombre) {
        alert("El nombre es obligatorio para este registro.");
        return; 
    }
    
    if (fotoInput.files.length > 0) {
        const file = fotoInput.files[0];
        fotoURL = URL.createObjectURL(file);
    }
    usuarioActual = {
        id: Date.now(),
        nombre,
        enfermedad,
        apreciaciones,
        lat,
        lng,
        fotoURL,
        fecha,
        // Guardamos el rol de la persona registrada
        rol: rolRegistrado 
    };

    document.getElementById("formUsuario").classList.add("hidden");
    mostrarResumen();
    } else {
      alert("Error al enviar el registro.");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
  }
});
*/
function mostrarResumen() {
    //const resumenDiv = document.getElementById("resumen");
    
    // CORREGIDO: Uso de backticks (`)
    const mensaje = (usuarioActual.rol === 'operador' && tipoSeleccionado === 'operador') ? 
        "Tu información está siendo procesada. ¡Gracias por tu colaboración!" :
        `Registro para ${usuarioActual.nombre} completado. Verificando ubicación...`;

    document.getElementById("resumenTexto").innerHTML = mensaje;
   
    ocultarTodo();
    document.getElementById("resumen").classList.remove("hidden");

    //resumenDiv.classList.remove("hidden");
    
}
//MostrarMapa modiciadoxbr
async function mostrarMapaSolo() {
    document.getElementById("resumen").classList.add("hidden");
    const mapaContainer= document.getElementById("mapaContainer");
    
    // 1. Aplicar clase de estilo completo al body y al contenedor del mapa
    document.body.classList.add("map-view");
    mapaContainer.classList.add("full-map-container");
    
    mapaContainer.classList.remove("hidden");
    document.getElementById("map").innerHTML = "";

    /*
    usuarios.push(usuarioActual);
    guardarUsuarios(); 

    cargarMapa();
}*/

    // ✨ SOLUCIÓN ANTICACHÉ
    const urlConTimestamp = `http://localhost:3000/registros?_t=${new Date().getTime()}`;
    
    try {
        //const res = await fetch('http://localhost:3000/registros');
        //const todosUsuarios = await res.json();
        //  Validar que la respuesta sea exitosa (res.ok es true para status 200-299)
        const res = await fetch(urlConTimestamp);
        
        if (!res.ok) {
            throw new Error(`Error al obtener registros: ${res.status} ${res.statusText}`);
        }
        const todosRegistros = await res.json();

        // Filtramos solo los casos activos
        const casosActivos = todosRegistros.filter(u => u.estado === 'activo'); 
        
        // Usar el ID de mapa simple
        cargarMapa(casosActivos, 'map' );

        // Forzar el re-dibujo del mapa después de que se cargan los datos y se muestra el contenedor.
        setTimeout(() => {
            if (mapa) {
                mapa.invalidateSize();
            }
        }, 50); // Reducido el tiempo de espera a 50ms para más rapidez
    
    } catch (error) {
        console.error("Error al cargar mapa:", error);
    }
}

function cargarMapa(casosActivos, mapId = 'mapAdmin') {
    if (mapa) { //si exite un mapa lo eliminamos
        mapa.remove();
        mapa = null;

    }
     
    // Crear el mapa centrado en Salta
    mapa = L.map(mapId).setView([-24.8, -65.4], 6)
    
    // Cargar tiles de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapa);

  // Permitir marcar una ubicación con clic en el mapa
  mapa.on('click', function(e) {
    document.getElementById("lat").value = e.latlng.lat.toFixed(6);
    document.getElementById("lng").value = e.latlng.lng.toFixed(6);

    // Limpiar marcador temporal anterior
    if(marcadorTemporal) {
      mapa.removeLayer(marcadorTemporal);
    }

    // Agregar nuevo marcador temporal
    marcadorTemporal = L.marker(e.latlng).addTo(mapa)
        .bindPopup("Ubicación seleccionada para el registro").openPopup();
      
      alert(`Ubicación seleccionada: Lat ${e.latlng.lat.toFixed(4)}, Lng ${e.latlng.lng.toFixed(4)}. Presiona el botón de Geolocalización si quieres usar tu ubicación actual.`);
    });


    // Bucle para agregar marcadores de casos activos
    casosActivos.forEach(caso => {
        const lat = parseFloat(caso.latitud);
        const lng = parseFloat(caso.longitud);

        if (isNaN(lat) || isNaN(lng)) return;

        const nombre = caso.nombre || 'Sin nombre';
        const rol = caso.rol || 'Sin rol';
        const enfermedad = caso.enfermedad;
        const color = obtenerColorPorEnfermedad(enfermedad);
        const fecha = new Date(caso.createdAt).toLocaleDateString('es-AR');
        const id = caso.id;

        const marcador = L.circleMarker([lat, lng], {
            radius: 8,
            color,
            fillColor: color,
            fillOpacity: 0.7
        }).addTo(mapa);

        //poup usa el ID
        marcador.bindPopup(`
            <strong>ID: ${id} | ${nombre}</strong><br>
            Enfermedad: ${enfermedad}<br>
            Apreciaciones: ${caso.apreciaciones || 'N/A'}<br>
            Rol: ${rol} (${fecha})
            ${(tipoSeleccionado === 'admin' && caso.estado === 'activo') ? 
                `<br><button onclick="marcarComoTratado(${id})">Marcar como Tratado</button>` : ''}
        `);
    });

  // SOLUCIÓN AL TAMAÑO DEL MAPA
    setTimeout(() => {
      if (mapa) {
            mapa.invalidateSize();
            // Centrar el mapa en la última ubicación registrada o ubicación predeterminada
            if (casosActivos.length > 0) {
                 const firstCase = casosActivos[0];
                 mapa.setView([parseFloat(firstCase.latitud), parseFloat(firstCase.longitud)], 12);
            } else {
                 mapa.setView([-24.8, -65.4], 6); // Centro en Salta
            }
        }
    }, 200);
}
            // Centrar el mapa en la última ubicación registrada o en la ubicación del navegador
            /*if (usuarioActual && usuarioActual.latitud && usuarioActual.longitud) {
                mapa.setView([usuarioActual.latitud, usuarioActual.longitud], 13);
            } else {
                centrarEnUbicacionActual();
            }
        }
    }, 200);
}*/

     /*} catch (err) {
    console.error(err);
    alert("Error al cargar el mapa.");
  }*/
// --- Lógica del Administrador ---

// NUEVA FUNCIÓN para desmarcar/tratar casos (Requiere la ruta PUT en el backend)
async function marcarComoTratado(id) {
    if (confirm("¿Marcar este caso como 'Tratado' (eliminado de la vista del mapa y lista)?")) {
        try {
            // Requiere la ruta PUT /usuarios/:id/tratar en el backend
            const res = await fetch(`http://localhost:3000/registros/${id}/tratar`, {
                method: "PUT"
            });
            if (res.ok) {
                alert("Caso actualizado y marcado como tratado.");
            
                mostrarAdminPanel();//Recargar el mapa para reflejar el cambio
            } else {
                alert("Error al marcar el registro como tratado. Revisa la ruta PUT en tu backend.");
            }
        } catch (err) {
            console.error("Error de conexión:", err);
            alert("Error de conexión al actualizar el estado del caso.");
        }
    }
}

// Lógica de gestión de administrador
async function mostrarAdminPanel() {
    ocultarTodo();
    document.getElementById("mapaContainer").classList.add("hidden");

    document.getElementById("adminPanel").classList.remove("hidden");
    const lista = document.getElementById("listaUsuarios");
    const filtro = document.getElementById("filtroEnfermedad").value;
    lista.innerHTML = "<li>Cargando registros...</li>";//mensaje
    
    // ✨ SOLUCIÓN ANTICACHÉ
    const urlConTimestamp = `http://localhost:3000/registros?_t=${new Date().getTime()}`;

    try {
        //const res = await fetch('http://localhost:3000/registros');
        //const usuarios = await res.json();
        const res = await fetch(urlConTimestamp); // Usar la URL con timestamp
        if (!res.ok) {
            throw new Error(`Error en el servidor: ${res.status}`);
        }
        const registros = await res.json(); 
        
        lista.innerHTML = ""; // Limpiar antes de llenar

        // **Lógica de Filtrado Corregida (para manejar todos/otros/específico)**
        const filtroLowerCase = filtro.toLowerCase();
        const enfermedadesConocidas = ['dengue', 'leishmaniasis', 'chikungunya'];
        let filtrados = [];

        if (filtroLowerCase === 'todos') {
            filtrados = registros;
        } else if (filtroLowerCase === 'otros') {
            filtrados = registros.filter(r => {
                const enfermedadTexto = r.enfermedad ? r.enfermedad.toLowerCase() : '';
                return !enfermedadesConocidas.some(enc => enfermedadTexto.includes(enc));
            });
        } else {
            filtrados = registros.filter(r => {
                const enfermedadTexto = r.enfermedad ? r.enfermedad.toLowerCase() : '';
                return enfermedadTexto.includes(filtroLowerCase);
            });
        }
        // **Fin Lógica de Filtrado**

        /*const esTodos = filtro.toLowerCase() === 'todos';
        // Filtrado y Ordenamiento
        const filtrados = esTodos//filtro === 'todos' 
        ? registros 
        //  Usar .includes() y .toLowerCase() para buscar el filtro dentro de la cadena de enfermedades
        : registros.filter(r =>
             r.enfermedad && r.enfermedad.toLowerCase().split(',').map(s => s.trim()).includes(filtro.toLowerCase()));*/

        // Mostrar casos activos primero, luego ordenarlos
        const ordenados = [...filtrados].sort((a, b) => {
            if (a.estado === 'activo' && b.estado !== 'activo') return -1;
            if (a.estado !== 'activo' && b.estado === 'activo') return 1;
            return a.enfermedad.localeCompare(b.enfermedad);
        });

         // Registrar la cantidad de casos encontrados
        console.log(`[Frontend Log] Registros filtrados y listos para pintar: ${filtrados.length}`);

        
  



  /*if (filtro !== "todos") {
    url += `?enfermedad=${filtro}`;
  }

  try {
    const res = await fetch(url);
    const registros = await res.json();//br

    const ordenados = registros.sort((a, b) => {
        const dateA = new Date(a.fecha.split('/').reverse().join('-'));
        const dateB = new Date(b.fecha.split('/').reverse().join('-'));
        if (dateB - dateA !== 0) {
            return dateB - dateA;
        }
        return a.enfermedad.localeCompare(b.enfermedad);
    });*/
    
   if (ordenados.length === 0) {
        lista.innerHTML = "<li>No hay registros que coincidan con el filtro.</li>";
    } else {
        ordenados.forEach(u => {
            const li = document.createElement("li");
            // Asegurar que u.estado existe, si no, usar 'activo' por defecto
            const estado = u.estado || 'activo';
            //clases y atributos
            li.className = `registro-item ${u.estado === 'activo' ? 'activo' : 'tratado'}`;
            li.setAttribute('id', `usuario-${u.id}`);
            //estilos y botones
            const estadoClase = estado === 'tratado' ? 'style="background-color: #f7e6e6; opacity: 0.6;"' : '';
            
            const botonesEstado = estado === 'activo' ? 
            `<button class="delete-btn" onclick="marcarComoTratado(${u.id})">Marcar Tratado</button>` : 
            `<span style="color: green; margin-right: 10px;">[TRATADO]</span>`;

                //li.setAttribute('id', `usuario-${u.id}`);
                li.innerHTML =`
            <strong ${estadoClase}>${u.nombre || 'N/A'} (${u.rol ? u.rol.toUpperCase() : 'N/A'}) - ${u.enfermedad || 'N/A'}</strong>
            <button class="delete-btn" data-id="${u.id}" onclick="eliminarRegistro(${u.id})">Eliminar</button>
            ${botonesEstado}
            <div class="detalle-registro">
                Lat: ${u.latitud || 'N/A'}, Lng: ${u.longitud || 'N/A'} | Apreciaciones: ${u.apreciaciones || 'N/A'}
            </div>
        `;
                 /*`
                    <strong ${estadoClase}>${u.nombre} (${u.rol.toUpperCase()}) - ${u.enfermedad}</strong>
                    <button class="delete-btn" data-id="${u.id}" onclick="eliminarRegistro(${u.id})">Eliminar</button>
                    ${u.estado === 'activo' ? 
                        `<button class="delete-btn" onclick="marcarComoTratado(${u.id})">Marcar Tratado</button>` : 
                        `<span style="color: green; margin-right: 10px;">[TRATADO]</span>`}
                    <div class="detalle-registro">
                        Lat: ${u.latitud || 'N/A'}, Lng: ${u.longitud || 'N/A'} | Apreciaciones: ${u.apreciaciones || 'N/A'}
                    </div>
                `;*/
                
                lista.appendChild(li);
            });
        }

        // Llama a cargarMapa con los registros *filtrados* y el nuevo ID 'mapAdmin'
        cargarMapa(ordenados, 'mapAdmin'); 
        
        // 4. Forzar el re-dibujo del mapa (necesario para Leaflet)
        setTimeout(() => {
            if (mapa) {
                mapa.invalidateSize();
            }
        }, 50);

    } catch (err) {
        console.error("Error al cargar registros.", err);
    }
}





            /* CORREGIDO: Uso de backticks (`)
            const etiqueta = u.rol === 'admin' ? 
                            `ADMIN: ${u.nombre}` : 
                            `OPERADOR: ${u.nombre}`;

             const fecha = new Date(u.createdAt).toLocaleDateString('es-AR');

            
            li.innerHTML = `
                <strong>${u.nombre}</strong> - ${u.enfermedad} - ${u.fecha}
                <button class="delete-btn" data-id="${u.id}" onclick="eliminarRegistro(${u.id})">Eliminar</button>
                <div class="detalle-registro">
                    Lat: ${u.lat}, Lng: ${u.lng} | Apreciaciones: ${u.apreciaciones || 'N/A'}
                </div>
            `;
             // Agregás la imagen si existe
             if (u.foto) {
                li.innerHTML += `<img src="/uploads/${u.foto}" alt="Foto de ${u.nombre}" style="max-width:100px; margin-top:8px;">`;
            }

            lista.appendChild(li);
        });
    }
}catch (err) {
console.error("Error al cargar registros.", err);
}}*/

// Lógica de eliminación de registro
async function eliminarRegistro(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
        try {
            // CORRECCIÓN: Agregar la barra diagonal (/) antes del ID
            const res = await fetch(`http://localhost:3000/registros/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                mostrarAdminPanel();

            } else {
                // Muestra un error más detallado si la eliminación falla por otra razón
                alert("Error al eliminar el registro. El servidor respondió con estado: " + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión con el backend. Asegúrate de que el servidor esté corriendo.");
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    volverInicio()// Lógica de carga inicial

    //  Listener para que al cambiar el filtro, se recargue el panel
    const filtroSelect = document.getElementById("filtroEnfermedad");
    if (filtroSelect) {
        filtroSelect.addEventListener('change', mostrarAdminPanel);
    }
}); 



