# 🌍 EJERCICIO: Web de terremotos

## 📋 Descripción del proyecto

![Diseño responsive](./assets/responsive.png.png)

Este proyecto es una dashboard interactiva de actividad sísmica que muestra datos de terremotos en tiempo real, interactuando con una API de terremotos. Integra la librería de mapas de Leaflet y sistema de usuarios con Firebase Authentication y gestión de favoritos con Firestore.

### 🔧 Funcionalidades principales:

- **Consulta terremotos en tiempo real** desde la API pública de terremotos
- Visualización geográfica en **Leaflet** con marcadores personalizados por magnitud
- **Popups informativos** con detalles del terremoto
- Segundo mapa con **filtros por magnitud y fecha**
- **Firebase Authentication**: registro e inicio de sesión
- **Sistema de favoritos vinculado a usuarios autenticados**
- **Firestore**: almacenamiento de favoritos de cada usuario
- **Local Storage** para mantener la sesión del usuario y otras preferencias

---

## 🎯 Objetivos alcanzados

| Estado | Funcionalidad | Descripción |
|--------|---------------|-------------|
| ✅ | Petición a API de terremotos | Obtener y mostrar datos sísmicos en el mapa |
| ✅ | Marcadores personalizados | Colores según magnitud |
| ✅ | Popups con info del evento | Título, fecha, código, ubicación, magnitud y url para más información |
| ✅ | Segundo mapa con filtros | Permite buscar terremotos por magnitud y fechas |
| ✅ | Firebase Auth | Registro, login y logout de usuarios |
| ✅ | Firebase Firestore | Guardar y leer favoritos de cada usuario |
| ✅ | Sistema de favoritos | Añadir, quitar y mostrar terremotos favoritos desde el mapa |
| ✅ | Filtro entre datos API/Favoritos | Dos botones: ver terremotos actuales o favoritos |
| ✅ | Prevención de duplicados en BBDD | No permite añadir terremotos repetidos a favoritos |
| ✅ | Local Storage | Gestión de datos de sesión y preferencias |
| ✅ | Mobile first | Diseño prioritario para móviles|
| ✅ | Responsive | Diseño adaptado|
| ✅ | Código limpio | Uso de ES6, funciones modulares y buenas prácticas |

---

## 🗂️ Estructura del proyecto (JS)

- 📚 **Configuración de Firebase** – Conexión a Auth y Firestore  
- 👩🏽 **Sistema de usuarios** – Registro, login y logout  
- 📍 **Botones de login/logout** – Visibilidad dinámica según el estado del usuario  
- ⚙️ **Funciones generales para mapas** – Carga y renderizado de mapas  
- ✨ **Sistema de favoritos** – Añadir y eliminar favoritos desde el mapa  
- 🗺️ **Inicialización de mapas** – Carga de datos API y favoritos  
- 🟢 **Inicialización general** – Carga de eventos y listeners al cargar la app  
- 🧔🏽‍♂️ **Gestor de autenticación** – Observador de cambios en sesión  
- 💻 **Local Storage** – Persistencia de datos no críticos  

---

## 🛠️ Tecnologías utilizadas

- **HTML5** 📝  
- **CSS3** 🎨  
- **JavaScript (ES6)** 💻  
- **Firebase** (Auth + Firestore) 🔐📁  
- **Librería de mapas Leaflet** 🗺️  
- **API de Earthquakes** 🌐  
- **Local Storage** 🗃️  

---

## 📑 Estructura de la web

### 👩🏽 Header
- Título principal y botones de login/logout dinámicos

### 🗺️ Mapa 1: Terremotos en tiempo real
- Visualización inicial con marcadores por magnitud
- Popups con información y botón para añadir a favoritos

### 🔍 Mapa 2: Búsqueda avanzada
- Filtros por magnitud y rango de fechas
- Marcadores con los resultados filtrados

### ⭐ Favoritos
- Visualización de terremotos guardados por el usuario autenticado
- Botón para eliminar terremotos favoritos

### 📋 Formulario de Login/Registro
- Interfaz de autenticación con validaciones (REGEX)

### 👟 Footer
- Información del bootcamp, título del proyecto y autor

---

## 🌐 Despliegue del proyecto

### 🚀 GitHub Pages:

🔗 https://crisglezcal.github.io/ejercicio-web-terremotos/

---

## 🪛 Mejoras a implementar

- 🎨 **Limpiar la hoja de script.js de estilos (que estén todos en el CSS)**
- 😻 **Incluir una animación mientras esperamos la carga del contenido** 
