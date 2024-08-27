document.addEventListener('DOMContentLoaded', (event) => {
    const map = L.map('map').setView([3.4516, -76.5320], 13); // Coordenadas de Cali, Colombia

    const baseLayers = {
        'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }),
        'Topográfico': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
        }),
        'Satelital': L.esri.basemapLayer('Imagery')
    };

    baseLayers['OpenStreetMap'].addTo(map);

    L.control.layers(baseLayers).addTo(map);

    const measureControl = new L.Control.Measure({
        position: 'bottomleft',
        primaryLengthUnit: 'kilometers',
        secondaryLengthUnit: 'meters',
        primaryAreaUnit: 'hectares',
        secondaryAreaUnit: 'sqmeters',
        activeColor: '#FF7F00',
        completedColor: '#FFA500'
    });
    measureControl.addTo(map);

    const input = document.getElementById('search-field');
    const searchButton = document.getElementById('send-button');
    const altitudeToggle = document.getElementById('altitude-toggle');

    let altitudeMarker;

    function searchLocation() {
        const query = input.value;
        if (query) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const firstResult = data[0];
                        const latLng = [firstResult.lat, firstResult.lon];
                        map.setView(latLng, 13);

                        L.marker(latLng).addTo(map)
                            .bindPopup(firstResult.display_name)
                            .openPopup();
                    } else {
                        alert('No se encontraron resultados');
                    }
                });
        }
    }

    function toggleAltitude() {
        if (altitudeToggle.checked) {
            map.on('click', onMapClick);
        } else {
            map.off('click', onMapClick);
            if (altitudeMarker) {
                map.removeLayer(altitudeMarker);
            }
        }
    }

    function onMapClick(e) {
        if (altitudeMarker) {
            map.removeLayer(altitudeMarker);
        }
        fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${e.latlng.lat},${e.latlng.lng}`)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results[0]) {
                    altitudeMarker = L.marker(e.latlng)
                        .addTo(map)
                        .bindPopup(`Altitud: ${data.results[0].elevation} m`)
                        .openPopup();
                    
                    // Mostrar en el cuadro de información
                    document.getElementById('chart-container').innerHTML = `
                        <p>Altitud: ${data.results[0].elevation} m</p>
                    `;
                }
            });
    }

    function fetchWeatherData(lat, lon) {
        const apiKey = 'TU_API_KEY';
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                const temperature = data.main.temp;
                const windSpeed = data.wind.speed;
                const cloudiness = data.clouds.all;

                // Agregar datos al cuadro de información de la API
                document.getElementById('chart-container').innerHTML += `
                    <p>Temperatura: ${temperature} °C</p>
                    <p>Velocidad del Viento: ${windSpeed} m/s</p>
                    <p>Nubosidad: ${cloudiness} %</p>
                `;
            });
    }

    searchButton.addEventListener('click', searchLocation);
    altitudeToggle.addEventListener('change', toggleAltitude);

    map.on('measurefinish', function(evt) {
        const results = evt.results;
        const area = results.area;
        const perimeter = results.length;

        document.getElementById('polygon-data').innerHTML = `
            <p>Área: ${(area / 10000).toFixed(2)} ha</p>
            <p>Perímetro: ${(perimeter / 1000).toFixed(2)} km</p>
        `;
    });

    // Botón para ocultar/mostrar menú
    const toggleMenuButton = document.getElementById('toggle-menu');
    toggleMenuButton.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('collapsed');
    });

    // Obtener datos de la API para la ubicación inicial
    fetchWeatherData(3.4516, -76.5320);
});
