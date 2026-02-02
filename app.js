//ENLACE DE GOOGLE SHEETS
var urlExcel = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaAtms3ZLNDMm1jjHczkPpxC-NA6YyI1-9G0g1uFB6dJORhs7iyyrnGqkSmQ9QGHfNZk37gjmVdwTl/pub?gid=0&single=true&output=csv"; 

var datosGlobales = [];

// LEER DATOS
Papa.parse(urlExcel, {
    download: true,
    header: true,
    dynamicTyping: false,
    complete: function(resultados) {
        console.log("Datos cargados:", resultados.data);
        datosGlobales = resultados.data;
        mostrarResultados(datosGlobales);
    },
    error: function(error) {
        console.error("Error:", error);
    }
});

// FUNCIÓN PARA MOSTRAR RESULTADOS
function mostrarResultados(lista) {
    var panelLista = document.getElementById('lista-resultados');
    var contador = document.getElementById('contador-resultados');
    
    if (!panelLista || !contador) return;
    
    // Actualizar contador
    contador.textContent = lista.length + ' resultado' + (lista.length !== 1 ? 's' : '');
    
    // Limpiar panel
    panelLista.innerHTML = '';
    
    // Si no hay resultados
    if (lista.length === 0) {
        panelLista.innerHTML = '<p class="mensaje-inicial">No se encontraron resultados</p>';
        return;
    }
    
    // Agregar cada resultado
    lista.forEach(persona => {
        var div = document.createElement('div');
        div.className = 'resultado-item';
        div.innerHTML = `
            <h4>${persona.Nombre || 'Sin nombre'}</h4>
            <p class="dni">DNI: ${persona.DNI || 'N/A'}</p>
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
        var textoEscrito = evento.target.value.toLowerCase();
        
        // Si el campo está vacío, mostrar todos los datos
        if (textoEscrito.trim() === '') {
            mostrarResultados(datosGlobales);
            return;
        }
        
        // Filtrar resultados
        var resultadosFiltrados = datosGlobales.filter(persona => {
            var nombre = (persona.Nombre || "").toLowerCase();
            var dni = (persona.DNI || "").toString();
            return nombre.includes(textoEscrito) || dni.includes(textoEscrito);
        });

        mostrarResultados(resultadosFiltrados);
    });
}