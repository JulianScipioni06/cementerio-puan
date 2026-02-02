//ENLACE DE GOOGLE SHEETS
var urlExcel = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaAtms3ZLNDMm1jjHczkPpxC-NA6YyI1-9G0g1uFB6dJORhs7iyyrnGqkSmQ9QGHfNZk37gjmVdwTl/pub?gid=0&single=true&output=csv"; 

var datosGlobales = [];

// LEER DATOS (pero NO mostrarlos)
Papa.parse(urlExcel, {
    download: true,
    header: true,
    dynamicTyping: false,
    complete: function(resultados) {
        console.log("Datos cargados:", resultados.data.length, "registros");
        datosGlobales = resultados.data;
        // NO llamamos a mostrarResultados aquí
    },
    error: function(error) {
        console.error("Error:", error);
    }
});

// FUNCIÓN PARA MOSTRAR RESULTADOS
function mostrarResultados(lista) {
    var panelLista = document.getElementById('lista-resultados');
    var contador = document.getElementById('contador-resultados');
    var seccionResultados = document.getElementById('resultados-section');
    
    if (!panelLista || !contador) return;
    
    // Si no hay búsqueda, ocultar resultados
    if (lista.length === 0) {
        seccionResultados.classList.remove('show');
        return;
    }
    
    // Mostrar la sección de resultados con animación
    seccionResultados.classList.add('show');
    
    // Actualizar contador
    contador.textContent = lista.length + ' resultado' + (lista.length !== 1 ? 's encontrado' + (lista.length !== 1 ? 's' : '') : ' encontrado');
    
    // Limpiar panel
    panelLista.innerHTML = '';
    
    // Agregar cada resultado
    lista.forEach(persona => {
        var div = document.createElement('div');
        div.className = 'resultado-item';
        div.innerHTML = `
            <h4>${persona.Nombre || 'Sin nombre'}</h4>
            <div class="ubicacion">
                <p><strong>Sector:</strong> ${persona.Sector || 'N/A'}</p>
                <p><strong>Fila:</strong> ${persona.Fila || 'N/A'} | <strong>Nicho:</strong> ${persona.Nicho || 'N/A'}</p>
            </div>
        `;
        
        panelLista.appendChild(div);
    });
}

// BUSCADOR
var input = document.getElementById('input-busqueda');
if(input) {
    input.addEventListener('input', function(evento) {
        var textoEscrito = evento.target.value.toLowerCase().trim();
        
        // Si el campo está vacío, ocultar resultados
        if (textoEscrito === '') {
            document.getElementById('resultados-section').classList.remove('show');
            return;
        }
        
        // Filtrar resultados solo si hay al menos 2 caracteres
        if (textoEscrito.length < 2) {
            return;
        }
        
        var resultadosFiltrados = datosGlobales.filter(persona => {
            var nombre = (persona.Nombre || "").toLowerCase();
            var dni = (persona.DNI || "").toString();
            return nombre.includes(textoEscrito) || dni.includes(textoEscrito);
        });

        mostrarResultados(resultadosFiltrados);
    });
}