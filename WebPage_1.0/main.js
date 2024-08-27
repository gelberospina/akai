// Mapa centrado en Cali
var map = L.map('map').setView([3.4516, -76.5319], 12);

// Capas de OpenStreetMap y Esri
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var esriLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri'
});

var baseMaps = {
    "OpenStreetMap": osmLayer,
    "Esri World Imagery": esriLayer
};

// Control para seleccionar capas
L.control.layers(baseMaps).addTo(map);

// Geocoder para la búsqueda de direcciones
var geocoder = L.Control.geocoder({
    collapsed: false,
    placeholder: "Buscar..."
}).addTo(map);

document.getElementById('create-capaPe').addEventListener('click', function() {
    initializeCapaPe(map);
});

// Botón para ocultar/mostrar el menú lateral derecho
document.getElementById('toggle-menu').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
    
    // Ocultar texto y dejar solo íconos
    const items = sidebar.querySelectorAll('ul li');
    items.forEach(item => {
        if (sidebar.classList.contains('collapsed')) {
            item.querySelector('span').style.display = 'none';
        } else {
            item.querySelector('span').style.display = 'inline';
        }
    });
});

// Reubicación de la opción de medir distancia
var measureControl = L.control.measure({
    position: 'topleft',
    primaryLengthUnit: 'meters',
    secondaryLengthUnit: 'kilometers',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: 'hectares',
    activeColor: '#db4a29',
    completedColor: '#9b2d14'
}).addTo(map);
