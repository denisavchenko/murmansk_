mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuaXNhdmNoZW5rbyIsImEiOiJjbTJkcW9haXgxZ3ZsMmpyMnJvNWtiajk0In0.9VQSet50FTEZ0qMkQCMcsQ';

const mapSearch = new mapboxgl.Map({
    container: 'map-search', // ID элемента, в котором будет отображаться карта
    style: 'mapbox://styles/denisavchenko/cm2b4x7in00pi01pgdw2l07yu', // стиль карты
    center: [60, 60], // начальная координата [долгота, широта]
    zoom: 1, // начальный уровень масштабирования
    pitch: 0, // наклон
    bearing: 0, // поворот
    antialias: true // сглаживание краев
});

mapSearch.on('load', () => {
    // Настройка 3D глобуса
    mapSearch.setTerrain({ source: 'composite', exaggeration: 1.5 });
    mapSearch.setProjection('globe');

    // Данные для точек с ссылками
    const points = [
        { coordinates: [33.0878, 69.0061], name: 'Мурманск', url: 'https://example.com/murmansk' },
        { coordinates: [40.5412, 64.5379], name: 'Архангельск', url: 'https://example.com/arkhangelsk' },
        { coordinates: [158.6531, 53.0225], name: 'Петропавловск-Камчатский', url: 'https://example.com/petropavlovsk' }
    ];

    // Создание источника данных
    mapSearch.addSource('points', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: points.map(point => ({
                type: 'Feature',
                properties: {
                    title: point.name,
                    url: point.url // Добавляем URL в свойства
                },
                geometry: {
                    type: 'Point',
                    coordinates: point.coordinates
                }
            }))
        }
    });

    // Добавление кластеризации
    mapSearch.addSource('clusters', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: points.map(point => ({
                type: 'Feature',
                properties: {
                    title: point.name,
                    url: point.url // Добавляем URL в свойства
                },
                geometry: {
                    type: 'Point',
                    coordinates: point.coordinates
                }
            }))
        },
        cluster: true,
        clusterMaxZoom: 14, // максимальный уровень зума для кластеров
        clusterRadius: 50 // радиус кластеризации
    });

    // Стиль для кластеров
    mapSearch.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'clusters',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': '#0047ce', // цвет кластеров
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                10, // радиус для 1 точки
                10, 30, // радиус для 10 точек
                30, 50 // радиус для 30 точек
            ]
        }
    });

    // Стиль для единичных точек
    mapSearch.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'clusters',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#0047ce', // цвет точек
            'circle-radius': 5 // радиус точек
        }
    });

    // Добавление текста для точек, который будет отображаться при зуме 2 и выше
    mapSearch.addLayer({
        id: 'point-labels',
        type: 'symbol',
        source: 'points',
        layout: {
            'text-field': ['get', 'title'], // Получаем название точки
            'text-size': 12,
            'text-anchor': 'top',
            'text-offset': [0, 0.6]
        },
        filter: ['>=', ['zoom'], 2.5] // Показать только при зуме 2 и выше
    });

    // Обработчик клика на точки
    mapSearch.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const url = e.features[0].properties.url; // Получаем URL из свойств

        // Переход по ссылке
        if (url) {
            window.open(url, '_blank'); // Открываем ссылку в новой вкладке
        }
    });
});
