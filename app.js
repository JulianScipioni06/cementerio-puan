// 1. Inicializar mapa
var map = L.map('mapa-cementerio').setView([-37.550206, -62.742407], 18);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'OpenStreetMap'
}).addTo(map);

var capaMarcadores = L.layerGroup().addTo(map);

//ENLACE DE GOOGLE SHEETS
urlExcel = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaAtms3ZLNDMm1jjHczkPpxC-NA6YyI1-9G0g1uFB6dJORhs7iyyrnGqkSmQ9QGHfNZk37gjmVdwTl/pub?gid=0&single=true&output=csv"; 

datosGlobales = [];

// 2. FUNCIÓN MÁGICA: NORMALIZADOR ARGENTINO
function normalizarCoordenada(valor) {
    if (!valor) return null;
    if (typeof valor === 'number') return valor;
    var texto = valor.toString().replace(',', '.');
    return parseFloat(texto);
}

// 3. LEER DATOS
Papa.parse(urlExcel, {
    download: true,
    header: true,
    dynamicTyping: false,
    complete: function(resultados) {
        console.log("Datos crudos recibidos:", resultados.data);
        datosGlobales = resultados.data;
        dibujarMarcadores(datosGlobales);
    },
    error: function(error) {
        console.error("Error:", error);
    }
});

// 4. DIBUJAR MARCADORES Y ACTUALIZAR PANEL
function dibujarMarcadores(lista) {
    capaMarcadores.clearLayers();

    lista.forEach(difunto => {
        var lat = normalizarCoordenada(difunto.Latitud);
        var lng = normalizarCoordenada(difunto.Longitud);

        if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
            
            var marcador = L.marker([lat, lng]);
            
            marcador.bindPopup(`
                <div class="text-center">
                    <h4>${difunto.Nombre}</h4>
                    <b>Sector: ${difunto.Sector}</b><br>
                    Fila: ${difunto.Fila} | Nicho: ${difunto.Nicho}
                </div>
            `);

            marcador.addTo(capaMarcadores);
        }
    });
    
    // Actualizar el panel lateral
    actualizarPanelResultados(lista);
}

// 5. FUNCIÓN PARA ACTUALIZAR EL PANEL LATERAL
function actualizarPanelResultados(lista) {
    var panelLista = document.getElementById('lista-resultados');
    var contador = document.getElementById('contador-resultados');
    
    if (!panelLista || !contador) return;
    
    // Filtrar solo los que tienen coordenadas válidas
    var listaValida = lista.filter(difunto => {
        var lat = normalizarCoordenada(difunto.Latitud);
        var lng = normalizarCoordenada(difunto.Longitud);
        return lat && lng && !isNaN(lat) && !isNaN(lng);
    });
    
    // Actualizar contador
    contador.textContent = listaValida.length + ' resultado' + (listaValida.length !== 1 ? 's' : '');
    
    // Limpiar panel
    panelLista.innerHTML = '';
    
    // Si no hay resultados
    if (listaValida.length === 0) {
        panelLista.innerHTML = '<p class="mensaje-inicial">No se encontraron resultados</p>';
        return;
    }
    
    // Agregar cada resultado
    listaValida.forEach(difunto => {
        var lat = normalizarCoordenada(difunto.Latitud);
        var lng = normalizarCoordenada(difunto.Longitud);
        
        var div = document.createElement('div');
        div.className = 'resultado-item';
        div.innerHTML = `
            <h4>${difunto.Nombre}</h4>
            <p><strong>Sector:</strong> ${difunto.Sector}</p>
            <p><strong>Fila:</strong> ${difunto.Fila} | <strong>Nicho:</strong> ${difunto.Nicho}</p>
        `;
        
        // Al hacer click, centrar el mapa
        div.addEventListener('click', function() {
            map.setView([lat, lng], 19);
            // Abrir el popup del marcador
            capaMarcadores.eachLayer(function(layer) {
                if (layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) {
                    layer.openPopup();
                }
            });
        });
        
        panelLista.appendChild(div);
    });
}

// 6. BUSCADOR
var input = document.getElementById('input-busqueda');
if(input) {
    input.addEventListener('input', function(evento) {
        var textoEscrito = evento.target.value.toLowerCase();
        
        var resultadosFiltrados = datosGlobales.filter(persona => {
            var nombre = (persona.Nombre || "").toLowerCase();
            var dni = (persona.DNI || "").toString();
            return nombre.includes(textoEscrito) || dni.includes(textoEscrito);
        });

        dibujarMarcadores(resultadosFiltrados);
    });
}