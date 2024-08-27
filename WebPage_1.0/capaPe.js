function initializeCapaPe(map) {
    // Crear un nuevo FeatureGroup para los puntos y polígonos
    var capaPeLayer = L.featureGroup().addTo(map);
    
    // Puntero de selección de puntos
    var selectPoint = document.getElementById('select-point');
    selectPoint.addEventListener('click', function() {
        map.once('click', function(e) {
            var latlng = e.latlng;
            L.marker(latlng).addTo(capaPeLayer);
            fetchData(latlng);
        });
    });

    // Puntero para crear polígono
    var createPolygon = document.getElementById('create-polygon');
    createPolygon.addEventListener('click', function() {
        var polygon = L.polygon([]).addTo(capaPeLayer);
        map.on('click', function(e) {
            polygon.addLatLng(e.latlng);
        });

        map.on('dblclick', function() {
            map.off('click');
            map.off('dblclick');
            fetchPolygonData(polygon);
        });
    });
    
    // Mostrar datos en el cuadro de Datos
    function fetchData(latlng) {
        // Simulación de obtención de datos
        document.querySelector('#data-container p:nth-child(1)').textContent = 'Altura: 1000 msnm';
        document.querySelector('#data-container p:nth-child(2)').textContent = 'Temperatura: 25 °C';
        document.querySelector('#data-container p:nth-child(3)').textContent = 'Velocidad del viento: 10 km/h';
        document.querySelector('#data-container p:nth-child(4)').textContent = 'Nubosidad: 20%';
    }

    function fetchPolygonData(polygon) {
        // Simulación de obtención de datos de polígono
        var area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]) / 1000000; // Área en km²
        var perimeter = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]) / 1000; // Perímetro en m²
        
        document.querySelector('#data-container p:nth-child(1)').textContent = 'Altura: ---';
        document.querySelector('#data-container p:nth-child(2)').textContent = 'Temperatura: 20 °C';
        document.querySelector('#data-container p:nth-child(3)').textContent = 'Velocidad del viento: 15 km/h';
        document.querySelector('#data-container p:nth-child(4)').textContent = 'Nubosidad: 10%';
        document.querySelector('#data-container p:nth-child(5)').textContent = 'Área: ' + area.toFixed(2) + ' km²';
        document.querySelector('#data-container p:nth-child(6)').textContent = 'Perímetro: ' + perimeter.toFixed(2) + ' m²';
    }
}
