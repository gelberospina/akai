document.addEventListener('DOMContentLoaded', (event) => {
    const map = L.map('map').setView([3.4516, -76.5320], 13); // Coordenadas de Cali, Colombia

    const baseLayers = {
        'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }),
        'Topográfico': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
        }),
        'Satelital': L.tileLayer('https://{s}.sat.owm.io/sql/{z}/{x}/{y}?appid={apiKey}', {
            attribution: 'Map data &copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
            apiKey: 'TU_API_KEY'
        })
    };

    baseLayers['OpenStreetMap'].addTo(map);

    L.control.layers(baseLayers).addTo(map);

    const measureControl = new L.Control.Measure({
        position: 'topleft',
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
        fetch(`https://api.opentopodata.org/v1/test-dataset?locations=${e.latlng.lat},${e.latlng.lng}`)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results[0]) {
                    altitudeMarker = L.marker(e.latlng)
                        .addTo(map)
                        .bindPopup(`Altitud: ${data.results[0].elevation} m`)
                        .openPopup();
                }
            });
    }

    searchButton.addEventListener('click', searchLocation);
    altitudeToggle.addEventListener('change', toggleAltitude);
});
