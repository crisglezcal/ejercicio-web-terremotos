// ###################################################################### MAPA 1 ######################################################################
// ================================================== COORDENADAS DE POSICIONES DONDE HAY TERREMOTOS ==================================================

// 1. Crea un mapa en el div con id "mapa1" utilizando Leaflet

let mapa1 = L.map('mapa1').setView([20, 0], 2); // => Centrado en latitud 20, longitud 0, con zoom nivel 2


// 2. Capa del mapa

let OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { //=> Capa de mapa topográfico
    maxZoom: 17, // => Máximo nivel de acercamiento permitido
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(mapa1); // => Añade la capa al mapa


// 3. Función para formatear fecha: convierte un número grande que devuelve la API (timestamp) a una fecha legible como "19/1/2025, 10:30:25"
function formatDate(timestamp) { 
    return new Date(timestamp).toLocaleString(); // => Convierte el número a objeto Date y lo formatea según tu idioma y zona horaria local
}

// 4. Función de llamada a la API para pintar todos los terremotos obtenidos de la API de terremotos
async function getEarthquakes() {
    try {
        const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
        const data = await res.json();
        return data.features;
    } catch (e) {
        console.log("Error fetching data:", e);
        return [];
    }
}

// 5. Función para obtener color según magnitud
function getColorByMagnitude(magnitude) {
    if (magnitude >= 7) return '#7B1FA2'; // Morado
    if (magnitude >= 6) return '#FF5722'; // Rojo
    if (magnitude >= 5) return '#FF9800'; // Naranja
    if (magnitude >= 4) return '#FFC107'; // Ámbar
    if (magnitude >= 3) return '#FFEB3B'; // Amarillo
    if (magnitude >= 2) return '#CDDC39'; // Lima
    if (magnitude >= 1) return '#8BC34A'; // Verde claro
    return '#4CAF50'; // Verde
}

// 6. Función para crear marcador personalizado
function createCustomIcon(magnitude) {
    const color = getColorByMagnitude(magnitude);
    return L.divIcon({ // => Crea un marcador circular de color según la maginitud
        className: 'custom-earthquake-marker',
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
        iconSize: [19, 19],
        iconAnchor: [9, 9]
    });
}

// 7. Llamada a la función principal y agregar popup al marcador
getEarthquakes().then(data => {
    console.log("Datos de terremotos:", data);

    data.forEach(earthquake => {
        // Para cada terremoto en la lista...
        const coordinates = [
            earthquake.geometry.coordinates[1], // latitud (posición norte-sur)
            earthquake.geometry.coordinates[0]  // longitud (posición este-oeste)
        ];
        
        // Extrae la información del terremoto
        const magnitude = earthquake.properties.mag;  
        const title = earthquake.properties.title;    
        const time = earthquake.properties.time;      
        const place = earthquake.properties.place;    
        const code = earthquake.properties.code;      
        const magType = earthquake.properties.magType; 

        // Crea un marcador en el mapa en la posición del terremoto y el marcador con el color según la magnitud
        const marker = L.marker(coordinates, {
            icon: createCustomIcon(magnitude)
        }).addTo(mapa1);

        // Crea el contenido de la ventana emergente
        const popupContent = `
            <div class="earthquake-popup">
                <h3>${title}</h3>
                <p><strong>Fecha:</strong> ${formatDate(time)}</p>
                <p><strong>Ubicación:</strong> ${place}</p>
                <p><strong>Código:</strong> ${code}</p>
                <p><strong>Magnitud:</strong> ${magnitude} (${magType})</p>
                <p><strong>Nivel:</strong> ${Math.floor(magnitude)}</p>
            </div>
        `;

        // Asocia la ventana emergente al marcador
        marker.bindPopup(popupContent);
    });
}).catch(error => {
    console.log("Error procesando datos:", error);
});


// ###################################################################### MAPA 2 ######################################################################
// ================================================== FILTRO DE MAGNITUD Y DE FECHA DE INICIO/FIN ==================================================

// 1. Crea un segundo mapa en el div con id "mapa2" utilizando Leaflet
let mapa2 = L.map('mapa2').setView([20, 0], 2);


// 2. Capa del mapa
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; OpenStreetMap contributors'
}).addTo(mapa2);


// 3. Función para limpiar el mapa 2: elimina todos los marcadores para que no se acumulen cuando aplicas nuevos filtros
function clearMap2() {
    mapa2.eachLayer(layer => { // => mapa2.eachLayer() = Recorre cada capa del mapa
        if (layer instanceof L.Marker) { // => if (layer instanceof L.Marker) = Pregunta: "¿Esta capa es un marcador?"
            mapa2.removeLayer(layer); // => Si mapa2.removeLayer(layer) = Si es un marcador, lo elimina del mapa
        }
    });
}

// 4. Función de llamada a la API con filtros - CORREGIDA PARA MAGNITUD EXACTA

async function getFilteredEarthquakes(filterMagnitude, startTime, endTime) {
    try {
        
        let url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson";
        
        
        // Si el usuario puso una magnitud, añade "magnitud exacta X" a la búsqueda
            // Ej: magnitude = 4 busca solo terremotos de magnitud 4
        if (filterMagnitude) {
            url += `&magnitude=${filterMagnitude}`;
        }
         
        // Añadir filtro de fechas y asegurar formato correcto de fecha
            // Si el usuario puso fecha inicio, añade "desde esta fecha a las 00:00:00"
        if (startTime) {
            url += `&starttime=${startTime}T00:00:00`;
        }

        // Si el usuario puso fecha fin, añade "hasta esta fecha a las 23:59:59"
        if (endTime) {
            url += `&endtime=${endTime}T23:59:59`;
        }
        
        console.log("URL de búsqueda:", url);
        
        // Hace la petición a la API con la URL construida
        const res = await fetch(url);
        
        // Si la respuesta no es exitosa (ej: error 404), lanza un error
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        // Convierte la respuesta a formato JSON
        const data = await res.json();
        
        console.log("Datos filtrados encontrados:", data.features.length);
        
        // Devuelve solo la lista de terremotos (no todo el objeto)
        return data.features;

    // Si hay algún error, lo muestra y devuelve lista vacía    
    } catch (e) {
        console.log("Error fetching filtered data:", e);
        return [];
    }
    
}

// 5. Función para pintar terremotos filtrados
function paintFilteredEarthquakes(filterMagnitude, startTime, endTime) {

    clearMap2(); // => Limpiar marcadores anteriores antes de pintar los nuevos
    
    getFilteredEarthquakes(filterMagnitude, startTime, endTime).then(data => { // => Obtiene los terremotos filtrados y luego...
        
        if (data.length === 0) { // => Si no se encontraron terremotos, muestra alerta y termina
            alert("No se encontraron terremotos con esos filtros");
            return;
        }
        
        data.forEach(earthquake => { // => Para cada terremoto en la lista...
            
            const coordinates = [ // => Extrae las coordenadas del terremoto
                earthquake.geometry.coordinates[1], 
                earthquake.geometry.coordinates[0] 
            ];
        
            // Extrae la información del terremoto
            const magnitude = earthquake.properties.mag;  
            const title = earthquake.properties.title;    
            const time = earthquake.properties.time;      
            const place = earthquake.properties.place;    
            const code = earthquake.properties.code;      
            const magType = earthquake.properties.magType; 

            
            const marker = L.marker(coordinates, { // => Crea un marcador en el mapa
                icon: createCustomIcon(magnitude)
            }).addTo(mapa2); // => Dibuja un punto en el mapa con el color según la magnitud

            
            const popupContent = `
                <div class="earthquake-popup">
                    <h3>${title}</h3>
                    <p>Fecha: ${formatDate(time)}</p>
                    <p>Ubicación: ${place}</p>
                    <p>Código: ${code}</p>
                    <p>Magnitud: ${magnitude} (${magType})</p>
                    <p>Nivel: ${Math.floor(magnitude)}</p>
                </div>
            `; // => Crea el contenido de la ventana emergente
            

            
            marker.bindPopup(popupContent); // => Asocia la ventana emergente al marcador

        });
    }).catch(error => {
        console.log("Error procesando datos:", error);
    });
}

// 6. Event listener

// Escucha cuando el usuario haga clic en el botón "Aplicar filtros"
document.getElementById('aplicarFiltro').addEventListener('click', function() {
    
    // Obtiene el valor del input de magnitud
    const magnitude = document.getElementById('magnitudFilter').value;
    
    // Obtiene el valor del input de fecha inicio
    const startDate = document.getElementById('startDate').value;
    
    // Obtiene el valor del input de fecha fin
    const endDate = document.getElementById('endDate').value;
    
    // Muestra en consola qué filtros se están aplicando
    console.log("Filtros aplicados:", { magnitude, startDate, endDate });
    
    // Ejecuta la función que pinta los terremotos con los filtros
    paintFilteredEarthquakes(magnitude, startDate, endDate);
    
});