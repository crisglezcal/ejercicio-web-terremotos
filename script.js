/*
ESTRUCTURA:
📚 13 - CONFIGURACIÓN DE FIREBASE - CONEXIÓN CON LA BASE DE DATOS
👩🏽 37 - SISTEMA DE USUARIOS - REGISTRO Y LOGIN
📍 146 - GESTIÓN DE BOTONES DE LOGIN/LOGOUT
⚙️ 169 - FUNCIONES GENERALES PARA LOS MAPAS
✨ 283 - SISTEMA DE FAVORITOS
🗺️ 587 - INICIALIZACIÓN DE MAPAS
🟢 753 - INICIALIZACIÓN GENERAL DE LA PÁGINA
🧔🏽‍♂️ 921 - DETECTOR DE CAMBIOS EN LA AUTENTICACIÓN
💻 932 - LOCAL STORAGE (PENDIENTE)
*/

// ======================================================================================================================================================================
// 📚 CONFIGURACIÓN DE FIREBASE - CONEXIÓN CON LA BASE DE DATOS
// ======================================================================================================================================================================

// 1. Datos de conexión para Firebase ("dirección" para encontrar la base de datos)

const firebaseConfig = {
    apiKey: "AIzaSyBs_lheYKONIW7zhYp6hUv9qQ0trbm35ws",          // Clave para acceder a la API
    authDomain: "fir-web-37175.firebaseapp.com",               // Dominio para autenticación
    projectId: "fir-web-37175",                                // ID del proyecto en Firebase
    storageBucket: "fir-web-37175.firebasestorage.app",        // Donde se guardan archivos
    messagingSenderId: "106997965105",                         // ID para enviar mensajes
    appId: "1:106997965105:web:66f4f7d5e5189ef2b19010"        // ID único de la aplicación
};

// 2. Conectar con Firebase (solo si no está ya conectado)

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);  // Iniciar la conexión
}
// 3. Obtener la base de datos Firestore para guardar y leer información

const db = firebase.firestore();

// ======================================================================================================================================================================
// 👩🏽 SISTEMA DE USUARIOS - REGISTRO Y LOGIN
// ======================================================================================================================================================================

// 1. Función para crear un nuevo usuario en la base de datos

const createUser = (user) => {
    db.collection("usersEarthquakes") // Guardar en la colección "usersEarthquakes" con el ID del usuario como documento
        .doc(user.uid)  // Usar el ID único de Firebase como nombre del documento
        .set({          // Guardar estos datos:
            email: user.email,                           // Email del usuario
            favorites: [],                               // Lista vacía de favoritos
            createdAt: firebase.firestore.FieldValue.serverTimestamp()  // Fecha de creación
        })
        .then(() => {
            console.log("Usuario creado con ID: ", user.uid);
            Swal.fire({  // Mostrar mensaje de éxito con SweetAlert
                icon: 'success',
                title: 'Te has registrado correctamente',
                text: `Se ha registrado ${user.email}`
            }).then(() => {
                window.location.href = "./index.html";  // Ir a la página principal una vez se ha registrado el nuevo usuario
            });
        })
        .catch((error) => { // Si hay error, mostrar mensaje con SweetAlert
            console.error("Error creando usuario: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error en registro',
                text: `Error: ${error.message}`
            });
        });
};

// **************************************************************************************************************************************************************

// 2. Función para registrar un nuevo usuario (Sign up)

const signUpUser = (email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password) // Pedir a Firebase que cree un usuario con email y contraseña
        .then((userCredential) => { // Si se crea correctamente:
            let user = userCredential.user;  // Obtener datos del usuario
            console.log(`Se ha registrado ${user.email} ID:${user.uid}`);
            createUser(user);  // Llamar a la función para guardar en base de datos
        })
        .catch((error) => { // Si hay error en el registro, mostrar SweetAlert:
            console.log("Error en el registro: " + error.message, "Código: " + error.code);
            Swal.fire({
                icon: 'error',
                title: 'Error en registro',
                text: `Error: ${error.message}`
            });
        });
};

// **************************************************************************************************************************************************************

// 3. Función para iniciar sesión (Log in)

const logInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password) // Pedir a Firebase que verifique el usuario
        .then((userCredential) => { // Si el login es correcto:
            let user = userCredential.user;
            console.log(`Se ha logado ${user.email} ID:${user.uid}`);
            Swal.fire({ // Mostrar mensaje de bienvenida con SweetAlert:
                icon: 'success',
                title: 'Bienvenido',
                text: `Bienvenido ${user.email}`,
                timer: 2000,              // Se cierra automáticamente después de 2 segundos
                showConfirmButton: false  // No mostrar botón "OK"
            }).then(() => {
                window.location.href = "./index.html";  // Ir a la página principal
            });
        })
        .catch((error) => { // Si hay error en el login, mostrar SweetAlert:
            console.log("Error en login: " + error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error en login',
                text: `Error: ${error.message}`
            });
        });
};

// **************************************************************************************************************************************************************

// 4. Función para cerrar sesión (Sign out)

const signOut = () => {
    firebase.auth().signOut() // Pedir a Firebase que cierre la sesión
        .then(() => {
            Swal.fire({ // Mostrar mensaje de éxito con SweetAlert
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Sesión cerrada correctamente',
                timer: 2000,              // Se cierra automáticamente
                showConfirmButton: false  // Sin botón "OK"
            });
        })
        .catch((error) => { // Si hay error al cerrar sesión, mostrar SweetAlert:
            console.log("Error al cerrar sesión: " + error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cerrar sesión'
            });
        });
};

// ======================================================================================================================================================================
// 📍GESTIÓN DE BOTONES DE LOGIN/LOGOUT
// ======================================================================================================================================================================

// 1. Función para actualizar qué botones mostrar según si hay usuario logeado o no
function updateAuthButtons() {
    const user = firebase.auth().currentUser;  // Verificar si hay usuario conectado
    const loginButton = document.getElementById("login");      // Botón "Log in"
    const signoutButton = document.getElementById("sign-out"); // Botón "Cerrar sesión"

    console.log("Actualizando botones - Usuario:", user);

    if (loginButton && signoutButton) { // Si ambos botones existen en la página:
        if (user) { // USUARIO LOGEADO: ocultar "Log in", mostrar "Cerrar sesión"
            loginButton.style.display = "none";
            signoutButton.style.display = "block";
        } else { // USUARIO NO LOGEADO: mostrar "Log in", ocultar "Cerrar sesión"
            loginButton.style.display = "block";
            signoutButton.style.display = "none";
        }
    }
};

// ======================================================================================================================================================================
// ⚙️ FUNCIONES GENERALES PARA LOS MAPAS
// ======================================================================================================================================================================

// 1. Función para convertir fecha de números a texto legible

function formatDate(timestamp) { 
    return new Date(timestamp).toLocaleString();  // Ej: "15/01/2025, 10:30:25"
}

// **************************************************************************************************************************************************************

// 2. Función para elegir color según la magnitud del terremoto

function getColorByMagnitude(magnitude) {
    if (magnitude >= 7) return '#7B1FA2';  // Morado - Muy fuerte
    if (magnitude >= 6) return '#FF5722';  // Naranja oscuro - Fuerte
    if (magnitude >= 5) return '#FF9800';  // Naranja - Moderado
    if (magnitude >= 4) return '#FFC107';  // Amarillo oscuro
    if (magnitude >= 3) return '#FFEB3B';  // Amarillo
    if (magnitude >= 2) return '#CDDC39';  // Verde claro
    if (magnitude >= 1) return '#8BC34A';  // Verde
    return '#4CAF50';                      // Verde oscuro - Muy débil
}

// **************************************************************************************************************************************************************

// 3. Función para crear icono personalizado para los marcadores del mapa

function createCustomIcon(magnitude) {
    const color = getColorByMagnitude(magnitude);  // Obtener color según magnitud
    return L.divIcon({
        className: 'custom-earthquake-marker',
        // Crear un círculo de color con borde blanco
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
        iconSize: [19, 19],    // Tamaño del icono
        iconAnchor: [9, 9]     // Punto de anclaje (centro)
    });
}

// **************************************************************************************************************************************************************

// 4. Función para obtener datos de terremotos desde la API

async function getEarthquakes() {
    try {
        // Hacer petición a la API de terremotos
        const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
        const data = await res.json();  // Convertir respuesta a JSON
        return data.features;           // Devolver solo la lista de terremotos
    } catch (e) { // Si hay error, mostrar en consola y devolver lista vacía
        console.log("Error fetching data:", e);
        return [];
    }
}

// **************************************************************************************************************************************************************

// 5. Función para crear contenido para la ventana emergente (popup) de cada terremoto

function createPopupContent(earthquake, isFavoriteView = false) {
    // Extraer información del terremoto
    const { properties, geometry } = earthquake;
    const { title, time, place, code, mag, url } = properties;
    
    let buttonHTML = '';  // Aquí guardaremos el botón o mensaje
    const earthquakeId = `${time}-${code}`;  // ID único del terremoto
    const user = firebase.auth().currentUser;  // Verificar si hay usuario logeado
    
    console.log("Creando popup - Usuario:", user); 
    
    if (!isFavoriteView) { // Si NO estamos en la vista de favoritos:
        if (user) { // USUARIO LOGEADO: mostrar botón "Añadir a favoritos"
            buttonHTML = `
                <button class="add-favorite-btn" onclick="addToFavorites(
                    '${time}',           
                    '${place.replace(/'/g, "\\'")}',  
                    '${code}',           
                    ${mag}
                    ${url}               
                )">
                    ★ Añadir a favoritos
                </button>
            `;
        } else { // USUARIO NO LOGEADO: mostrar mensaje informativo
            buttonHTML = `
                <p style="color: #666; font-style: italic; margin: 10px 0;">
                    No puedes añadir favoritos sin estar registrado
                </p>
            `;
        }
    } else { // VISTA DE FAVORITOS: mostrar botón "Eliminar de favoritos"
        buttonHTML = `
            <button class="remove-favorite-btn" onclick="removeFromFavorites('${earthquakeId}')">
                ✕ Eliminar de favoritos
            </button>
        `;
    }
    
    // Devolver el HTML completo del popup
    return `
    <div class="earthquake-popup">
        <h3>${title}</h3>
        <p><strong>Fecha:</strong> ${formatDate(time)}</p>
        <p><strong>Ubicación:</strong> ${place}</p>
        <p><strong>Código:</strong> ${code}</p>
        <p><strong>Magnitud:</strong> ${mag}</p>
        <a href="https://earthquake.usgs.gov/earthquakes/eventpage/${code}" target="_blank">Ver detalles completos</a>
        </p>
        ${buttonHTML}  <!-- Aquí va el botón o mensaje -->
    </div>
`
}

// ======================================================================================================================================================================
// ✨SISTEMA DE FAVORITOS
// ======================================================================================================================================================================

// 1. Función añadir terremoto a favoritos
function addToFavorites(time, place, code, magnitude) {
    const user = firebase.auth().currentUser;  // Verificar usuario logeado
    
    // Si no hay usuario logeado, mostrar SweetAlert de error y salir
    if (!user) {
        Swal.fire({
            icon: "error",
            title: "Error en Log In",
            text: "No puedes añadir favoritos sin estar registrado",
        });
        return;
    }

    // Crear ID único para el terremoto
    const earthquakeId = `${time}-${code}`;

    // Preparar datos del terremoto para guardar
    const pinData = {
        id: earthquakeId,
        title: `Terremoto ${magnitude} - ${place}`,
        place: place,
        mag: magnitude,
        time: time,
        code: code,
        url: url
    };

    // Referencia al documento del usuario en la base de datos
    const userRef = db.collection("usersEarthquakes").doc(user.uid);
    
    // Primero obtener los favoritos actuales del usuario
    userRef.get()
        .then(doc => {
            if (!doc.exists) { // Si el usuario no existe en la base de datos
                userRef.set({ // Crear nuevo documento con este terremoto como primer favorito
                    favorites: [pinData],
                    email: user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                    Swal.fire({ // Mostrar SweetAlert de éxito
                        icon: "success",
                        title: "Añadido a favoritos",
                        text: "Terremoto añadido a tus favoritos",
                        timer: 1500,              // Se cierra en 1.5 segundos
                        showConfirmButton: false  // Sin botón "OK"
                    });
                });
                return;
            }
            
            const favorites = doc.data().favorites || []; // Si el usuario ya existe, obtener su lista de favoritos
            
            const yaFavorito = favorites.some(fav => fav.id === pinData.id); // Verificar si el terremoto ya está en favoritos
            if (yaFavorito) {
                Swal.fire({ // Si ya existe, mostrar SweetAlert informativo y salir
                    icon: "info",
                    title: "Ya existe",
                    text: "Este terremoto ya está en tus favoritos",
                    timer: 1500,              // Se cierra automáticamente
                    showConfirmButton: false  // Sin botón "OK"
                });
                return;
            }
            
            userRef.update({ // Si no existe, añadirlo a la lista de favoritos
                favorites: firebase.firestore.FieldValue.arrayUnion(pinData)
            })
            .then(() => { // Mostrar SweetAlert de éxito
                Swal.fire({
                    icon: "success",
                    title: "Añadido a favoritos",
                    text: "Terremoto añadido a tus favoritos",
                    timer: 1500,              // Se cierra en 1.5 segundos
                    showConfirmButton: false  // Sin botón "OK"
                });
            })
            .catch(error => { // Si hay error al guardar, mostrar SweetAlert de error
                console.error("Error al añadir favorito:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error al guardar favorito"
                });
            });
        })
        .catch(error => { // Si hay error al leer la base de datos, mostrar SweetAlert de error
            console.error("Error al leer usuario:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al acceder a tus favoritos"
            });
        });
}

// **************************************************************************************************************************************************************

// 2. Función para eliminar terremoto de favoritos
function removeFromFavorites(earthquakeId) {
    const user = firebase.auth().currentUser;  // Verificar usuario logeado
    
    if (!user) { // Si no hay usuario logeado, mostrar SweetAlert de error
        Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "Debes estar logueado para eliminar favoritos",
        });
        return;
    }

    const userRef = db.collection("usersEarthquakes").doc(user.uid); // Referencia al documento del usuario
    
    userRef.get()
        .then(doc => { // Si el usuario no existe en la base de datos
            if (!doc.exists) {
                Swal.fire({
                    icon: "info",
                    title: "Sin favoritos",
                    text: "No tienes favoritos para eliminar"
                });
                return;
            }
            
            const favorites = doc.data().favorites || []; // Obtener lista de favoritos del usuario
            
            const favoriteToRemove = favorites.find(fav => fav.id === earthquakeId); // Buscar el terremoto que queremos eliminar
            
            if (!favoriteToRemove) { // Si no encontramos el terremoto en favoritos
                Swal.fire({
                    icon: "info",
                    title: "No encontrado",
                    text: "Este terremoto no está en tus favoritos"
                });
                return;
            }

            userRef.update({ // Eliminar el terremoto de la lista de favoritos
                favorites: firebase.firestore.FieldValue.arrayRemove(favoriteToRemove)
            })
            .then(() => { // Mostrar SweetAlert de éxito
                Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    text: "Terremoto eliminado de favoritos",
                    timer: 1500,              
                    showConfirmButton: false  
                });
                showFavorites(); // Recargar la vista de favoritos para actualizar el mapa
            })
            .catch(error => { // Si hay error al eliminar, mostrar SweetAlert de error
                console.error("Error eliminando de favoritos:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo eliminar de favoritos"
                });
            });
        })
        .catch(error => { // Si hay error general, mostrar SweetAlert de error
            console.error("Error eliminando de favoritos:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al eliminar de favoritos"
            });
        });
}

// **************************************************************************************************************************************************************

// 3. Función para mostrar favoritos en el mapa 1

function showFavorites() {
    const user = firebase.auth().currentUser;  // Verificar usuario logeado
    
    if (!user) { // Si no hay usuario logeado, mostrar SweetAlert de error
        Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "Debes estar logueado para ver tus favoritos",
        });
        return;
    }

    const userRef = db.collection("usersEarthquakes").doc(user.uid); // Referencia al documento del usuario
    
    userRef.get()
        .then(doc => { // Si el usuario no existe en la base de datos
            if (!doc.exists) {
                Swal.fire({
                    icon: "info",
                    title: "Sin favoritos",
                    text: "Aún no tienes terremotos favoritos"
                });
                return;
            }
            
            const favorites = doc.data().favorites || []; // Obtener lista de favoritos
            
            if (favorites.length === 0) { // Si no hay favoritos, mostrar SweetAlert informativo
                Swal.fire({
                    icon: "info",
                    title: "Sin favoritos",
                    text: "Aún no tienes terremotos favoritos"
                });
                return;
            }

            mapa1.eachLayer(layer => { // Limpiar el mapa 1: quitar todos los marcadores existentes
                if (layer instanceof L.Marker) {
                    mapa1.removeLayer(layer);  // Eliminar cada marcador
                }
            });
            
            favorites.forEach(favorite => { // Pintar cada favorito en el mapa 1
                const coordinates = favorite.coordinates || [20, 0]; // Usar coordenadas por defecto
                
                const marker = L.marker(coordinates, { // Crear marcador en el mapa
                    icon: createCustomIcon(favorite.mag) // Icono con color según magnitud
                }).addTo(mapa1);

                // Crear contenido del popup para favoritos
                const popupContent = `
                    <div class="earthquake-popup">
                        <h3>${favorite.title}</h3>
                        <p><strong>Fecha:</strong> ${new Date(parseInt(favorite.time)).toLocaleString()}</p>
                        <p><strong>Ubicación:</strong> ${favorite.place}</p>
                        <p><strong>Código:</strong> ${favorite.code}</p>
                        <p><strong>Magnitud:</strong> ${favorite.mag}</p>
                        <a href="https://earthquake.usgs.gov/earthquakes/eventpage/${code}" target="_blank">Ver detalles completos</a>
                        <button class="remove-favorite-btn" onclick="removeFromFavorites('${favorite.id}')">
                            ✕ Eliminar de favoritos
                        </button>
                    </div>
                `;
                
                marker.bindPopup(popupContent); // Asignar el popup al marcador
            });

            Swal.fire({ // Mostrar SweetAlert de éxito con la cantidad de favoritos
                icon: "success",
                title: "Favoritos cargados",
                text: `Se mostraron ${favorites.length} terremotos favoritos`,
                timer: 2000,              // Se cierra en 2 segundos
                showConfirmButton: false  // Sin botón "OK"
            });
        })
        .catch(error => { // Si hay error al cargar favoritos, mostrar SweetAlert de error
            console.error("Error al cargar favoritos:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al cargar tus favoritos"
            });
        });
}

// **************************************************************************************************************************************************************

// 4. Función para mostrar todos los terremotos de la API (vista normal)

function showAllEarthquakes() {
    mapa1.eachLayer(layer => { // Limpiar el mapa 1: quitar todos los marcadores
        if (layer instanceof L.Marker) {
            mapa1.removeLayer(layer);
        }
    });

    getEarthquakes().then(data => { // Recargar terremotos de la API
        console.log("Recargando terremotos de la API:", data.length);
        
        data.forEach(earthquake => { // Para cada terremoto, crear un marcador en el mapa
            const coordinates = [
                earthquake.geometry.coordinates[1], // Latitud
                earthquake.geometry.coordinates[0]  // Longitud
            ];
            const magnitude = earthquake.properties.mag; // Magnitud

            const marker = L.marker(coordinates, { // Crear marcador en el mapa
                icon: createCustomIcon(magnitude)  // Icono con color según magnitud
            }).addTo(mapa1);

            const popupContent = createPopupContent(earthquake, false); // Crear y asignar popup con información del terremoto
            marker.bindPopup(popupContent);
        });
        
        Swal.fire({ // Mostrar SweetAlert de éxito con la cantidad de terremotos
            icon: "success",
            title: "Terremotos cargados",
            text: `Se mostraron ${data.length} terremotos`,
            timer: 1500,              
            showConfirmButton: false  
        });
    }).catch(error => {
        console.log("Error recargando terremotos:", error);
    });
}

// ======================================================================================================================================================================
// 🗺️ INICIALIZACIÓN DE MAPAS
// ======================================================================================================================================================================

// 1. Variables globales para los mapas (accesibles desde cualquier función)
let mapa1, mapa2;

// 2. Función para inicializar y configurar los mapas
function initializeMaps() {
    console.log("Inicializando mapas...");
    
    // -----------> MAPA 1:

    if (document.getElementById('mapa1')) { // Crear mapa en el elemento HTML con ID 'mapa1'
        mapa1 = L.map('mapa1').setView([20, 0], 2);  // Vista centrada en [20,0] con zoom 2

        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { // Añadir capa de mapa base (imágenes del mapa)
            maxZoom: 17,  // Zoom máximo permitido
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }).addTo(mapa1);

        getEarthquakes().then(data => { // Cargar y mostrar terremotos en el mapa 1
            console.log("Datos de terremotos:", data);
            data.forEach(earthquake => { // Para cada terremoto, crear un marcador
                const coordinates = [
                    earthquake.geometry.coordinates[1],
                    earthquake.geometry.coordinates[0]  
                ];
                const magnitude = earthquake.properties.mag;
                
                const marker = L.marker(coordinates, { // Crear marcador en la posición del terremoto
                    icon: createCustomIcon(magnitude)  // Icono personalizado
                }).addTo(mapa1);

                const popupContent = createPopupContent(earthquake, false); // Crear contenido del popup y asignarlo al marcador
                marker.bindPopup(popupContent);
            });
        }).catch(error => {
            console.log("Error procesando datos:", error);
        });
    }

    // -----------> MAPA 2:
    
    if (document.getElementById('mapa2')) { 
        mapa2 = L.map('mapa2').setView([20, 0], 2); // Crear segundo mapa

        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { // Añadir misma capa de mapa base
            maxZoom: 17,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }).addTo(mapa2);

        // Función interna para limpiar todos los marcadores del mapa 2:
        function clearMap2() { 
            mapa2.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    mapa2.removeLayer(layer);  // Eliminar cada marcador
                }
            });
        }

        // Función interna para obtener terremotos filtrados por magnitud y fecha:
        async function getFilteredEarthquakes(magnitudeRange, startTime, endTime) {
            try {
                let url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"; // Construir URL de la API con los filtros
                
                if (magnitudeRange) { // Si hay filtro de magnitud, añadirlo a la URL
                    const [minMag, maxMag] = getMagnitudeRange(magnitudeRange);
                    url += `&minmagnitude=${minMag}&maxmagnitude=${maxMag}`;
                }
                
                if (startTime) { // Si hay fecha de inicio, añadirla
                    url += `&starttime=${startTime}T00:00:00`;
                }
                
                if (endTime) { // Si hay fecha de fin, añadirla
                    url += `&endtime=${endTime}T23:59:59`;
                }
                
                console.log("URL de búsqueda:", url);
                
                const res = await fetch(url); // Hacer petición a la API
                
                if (!res.ok) { // Si la respuesta no es exitosa, lanzar error
                    throw new Error(`Error HTTP: ${res.status}`);
                }
                
                const data = await res.json(); // Convertir respuesta a JSON y devolver terremotos
                console.log("Datos filtrados encontrados:", data.features.length);
                return data.features;
            } catch (e) { // Si hay error, mostrar en consola y devolver lista vacía
                console.log("Error fetching filtered data:", e);
                return [];
            }
        }

        // Función interna filtro de magnitud:
        function getMagnitudeRange(range) {
            switch(range) {
                case "0-1": return [0, 1];
                case "1-2": return [1, 2];
                case "2-3": return [2, 3];
                case "3-4": return [3, 4];
                case "4-5": return [4, 5];
                case "5-6": return [5, 6];
                case "6-7": return [6, 7];
                case "7+": return [7, 10];
                default: return [0, 10];  // Por defecto, todos los terremotos
            }
        }

        // Función interna para pintar terremotos filtrados en el mapa 2:
        function paintFilteredEarthquakes(magnitudeRange, startTime, endTime) {
            clearMap2();  // Limpiar mapa antes de añadir nuevos marcadores
            
            getFilteredEarthquakes(magnitudeRange, startTime, endTime).then(data => {
                if (data.length === 0) { // Si no se encontraron terremotos, mostrar alerta normal
                    alert("No se encontraron terremotos con esos filtros");
                    return;
                }

                data.forEach(earthquake => { // Para cada terremoto filtrado, crear marcador
                    const coordinates = [
                        earthquake.geometry.coordinates[1],
                        earthquake.geometry.coordinates[0]
                    ];
                    const magnitude = earthquake.properties.mag;

                    const marker = L.marker(coordinates, {
                        icon: createCustomIcon(magnitude)
                    }).addTo(mapa2);

                    const popupContent = createPopupContent(earthquake, false);
                    marker.bindPopup(popupContent);
                });
            }).catch(error => {
                console.log("Error procesando datos:", error);
            });
        }

        const aplicarFiltroBtn = document.getElementById('aplicarFiltro'); // Configurar evento para el botón "Aplicar filtros"
        if (aplicarFiltroBtn) {
            aplicarFiltroBtn.addEventListener('click', function() { // Obtener valores de los filtros
                const magnitudeRange = document.getElementById('filtro-magnitud').value;
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                
                console.log("Filtros aplicados:", { 
                    rangoMagnitud: magnitudeRange, 
                    fechaInicio: startDate, 
                    fechaFin: endDate 
                });
                
                paintFilteredEarthquakes(magnitudeRange, startDate, endDate); // Aplicar filtros y mostrar resultados
            });
        }
    }

    
    setTimeout(() => { // Forzar actualización del tamaño de los mapas después de un tiempo
        if (mapa1) mapa1.invalidateSize();  // Recalcular tamaño del mapa 1
        if (mapa2) mapa2.invalidateSize();  // Recalcular tamaño del mapa 2
        console.log("Mapas actualizados correctamente");
    }, 500);
}

// ======================================================================================================================================================================
// 🟢 INICIALIZACIÓN GENERAL DE LA PÁGINA
// ======================================================================================================================================================================

// Esperar a que la página esté completamente cargada
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM completamente cargada");
    
    // Inicializar mapas si la librería Leaflet está disponible
    if (typeof L !== "undefined") {
        initializeMaps();
    }
    
    // -----------> FORMULARIOS
    
    // 1. Formulario 1: Registro de nuevo usuario
    const form1 = document.getElementById("form1");
    if (form1) {
        form1.addEventListener("submit", function (event) {
            event.preventDefault();  // Evitar que el formulario se envíe normalmente
            
            // Obtener valores del formulario
            let email = event.target.elements.email.value;
            let pass = event.target.elements.pass.value;
            let pass2 = event.target.elements.pass2.value;
            
            // VALIDACIÓN 1: Verificar que el email tenga formato válido usando REGEX
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            // Explicación del REGEX para email:
            // ^[a-zA-Z0-9._%+-]+  → Debe empezar con letras, números o caracteres especiales comunes en emails
            // @[a-zA-Z0-9.-]+     → Debe contener un @ seguido del dominio
            // \.[a-zA-Z]{2,}$     → Debe terminar con un punto y al menos 2 letras (.com, .es, etc.)
            
            if (!emailRegex.test(email)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Email inválido',
                    text: 'Por favor, introduce un email válido (ejemplo: usuario@dominio.com)'
                });
                return;  // Detener el proceso si el email no es válido
            }
            
            // VALIDACIÓN 2: Verificar que las contraseñas coincidan
            if (pass !== pass2) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Contraseñas no coinciden',
                    text: 'Las contraseñas no coinciden'
                });
                return;  // Detener el proceso
            }
            
            // VALIDACIÓN 3: Verificar longitud mínima de contraseña
            if (pass.length < 6) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Contraseña muy corta',
                    text: 'La contraseña debe tener al menos 6 caracteres'
                });
                return;  // Detener el proceso
            }
            
            // VALIDACIÓN 4: Verificar fortaleza de la contraseña usando REGEX
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
            // Explicación del REGEX para contraseña fuerte:
            // (?=.*[a-z])        → Debe contener al menos una letra minúscula
            // (?=.*[A-Z])        → Debe contener al menos una letra mayúscula  
            // (?=.*\d)           → Debe contener al menos un número
            // (?=.*[@$!%*?&])    → Debe contener al menos un caracter especial (@, $, !, %, *, ?, &)
            // [A-Za-z\d@$!%*?&]  → Solo permite estos caracteres (evita otros símbolos)
            
            if (!passwordRegex.test(pass)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Contraseña débil',
                    html: `La contraseña debe contener:<br>
                           • Al menos una letra mayúscula<br>
                           • Al menos una letra minúscula<br>
                           • Al menos un número<br>
                           • Al menos un caracter especial (@$!%*?&)`
                });
                return;  // Detener el proceso si la contraseña no cumple los requisitos
            }
            
            signUpUser(email, pass); // Si todas las validaciones pasan, registrar el usuario
            form1.reset();  // Limpiar formulario
        });
    }

    // 2. Formulario 2: Inicio de sesión
    const form2 = document.getElementById("form2");
    if (form2) {
        form2.addEventListener("submit", function(event) {
            event.preventDefault();  // Evitar envío normal del formulario
            
            // Obtener valores del formulario
            let email = event.target.elements.email2.value;
            let pass = event.target.elements.pass3.value;
            
            // VALIDACIÓN: Verificar que el email tenga formato válido usando REGEX
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            // Mismo REGEX que en el formulario de registro para consistencia
            
            if (!emailRegex.test(email)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Email inválido',
                    text: 'Por favor, introduce un email válido (ejemplo: usuario@dominio.com)'
                });
                return;  // Detener el proceso si el email no es válido
            }
            
            // VALIDACIÓN: Verificar que la contraseña no esté vacía
            if (pass.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Contraseña requerida',
                    text: 'Por favor, introduce tu contraseña'
                });
                return;  // Detener el proceso
            }
            
            logInUser(email, pass); // Si las validaciones pasan, hacer login
            form2.reset();  // Limpiar formulario
        });
    }
    
    // 3. Botón para limpiar formulario de registro
    const borrar1 = document.getElementById("borrar");
    if (borrar1) {
        borrar1.addEventListener("click", function() {
            document.getElementById("form1").reset();  // Limpiar todos los campos
        });
    }

    // 4. Botón para limpiar formulario de login
    const borrar2 = document.getElementById("borrar2");
    if (borrar2) {
        borrar2.addEventListener("click", function() {
            document.getElementById("form2").reset();  // Limpiar todos los campos
        });
    }

    // -----------> BOTÓN CERRAR SESIÓN (SIGN OUT)
    
    const signoutButton = document.getElementById("sign-out");
    if (signoutButton) {
        signoutButton.addEventListener("click", signOut);  // Asignar función de logout
    }

    // -----------> BOTONES DE FAVORITOS
    
    // 1. Botón "Ver todos los terremotos"
    const showAllBtn = document.getElementById('show-all-earthquakes');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', showAllEarthquakes);
    }
    
    // 2. Botón "Ver mis favoritos"
    const showFavoritesBtn = document.getElementById('show-favorites');
    if (showFavoritesBtn) {
        showFavoritesBtn.addEventListener('click', showFavorites);
    }

    // Inicializar estado de los botones de login/logout
    updateAuthButtons();
});

// ======================================================================================================================================================================
// 🧔🏽‍♂️DETECTOR DE CAMBIOS EN LA AUTENTICACIÓN
// =======================================================================================================================================================================

// Esta función se ejecuta automáticamente cuando el usuario inicia o cierra sesión
firebase.auth().onAuthStateChanged(function(user) {
    console.log("Estado de autenticación cambiado:", user);
    updateAuthButtons();
});


// ======================================================================================================================================================================
// 💻 LOCAL STORAGE
// ======================================================================================================================================================================
