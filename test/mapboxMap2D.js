// Установите ваш токен доступа Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuaXNhdmNoZW5rbyIsImEiOiJjbTJkcW9haXgxZ3ZsMmpyMnJvNWtiajk0In0.9VQSet50FTEZ0qMkQCMcsQ';

// Создайте карту
const myCustomMap = new mapboxgl.Map({
    container: 'mapmap-2d', // ID элемента, в который будет помещена карта
    style: 'mapbox://styles/denisavchenko/cm2b8if6p005w01pg9l404qgl', // Стиль карты
    center: [47.0856, 65.9707], // Долгота и широта (Мурманск)
    zoom: 4, // Начальный уровень масштабирования
    attributionControl: false, // Убирает водяные знаки
    dragRotate: false, // Отключает поворот карты
    pitchWithRotate: false, // Отключает наклон карты с поворотом
    scrollZoom: true, // Разрешает масштабирование при прокрутке
    interactive: true // Делает карту интерактивной
});

// Установите границы перемещения карты
const bounds = [
    [15.0, 55.0], // Южный-запад (долгота, широта)
    [80.0, 73.0]  // Северный-восток (долгота, широта)
];

myCustomMap.setMaxBounds(bounds);

// Создание infoBox
const infoBox = document.createElement('div');
infoBox.style.position = 'absolute';
infoBox.style.backgroundColor = 'white';
infoBox.style.padding = '5px 15px';
infoBox.style.borderRadius = '5px';
infoBox.style.boxShadow = '3px 3px 0px rgba(0, 71, 206, 1)';
infoBox.style.pointerEvents = 'none';
infoBox.style.display = 'none';
infoBox.style.fontSize = '20px';
infoBox.style.fontWeight = '500';
infoBox.style.color = '#000';
document.body.appendChild(infoBox);

// Кастомная иконка
const iconUrl = 'crs/shelter.png'; // Укажите путь к вашей иконке

// Загрузка GeoJSON
fetch('crs/main_geo.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(geojson => {
        // Добавление точек на карту из GeoJSON
        geojson.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;
            const name = feature.properties.name;

            // Установите ширину и высоту маркера
            const markerWidth = 20; // Ширина маркера в пикселях
            const markerHeight = 20; // Высота маркера в пикселях

            // Создание элемента маркера с кастомной иконкой
            const markerElement = document.createElement('div');
            markerElement.style.backgroundImage = `url(${iconUrl})`;
            markerElement.style.backgroundSize = 'contain';
            markerElement.style.width = `${markerWidth}px`; // Ширина маркера
            markerElement.style.height = `${markerHeight}px`; // Высота маркера

            const marker = new mapboxgl.Marker(markerElement)
                .setLngLat(coordinates)
                .addTo(myCustomMap);

            // Обработчик событий для показа infoBox при наведении
            marker.getElement().addEventListener('mouseenter', (e) => {
                infoBox.style.display = 'block';
                infoBox.innerText = name; // Устанавливаем текст в infoBox
                const rect = e.target.getBoundingClientRect();
                infoBox.style.left = `${rect.left + window.scrollX}px`;
                infoBox.style.top = `${rect.top + window.scrollY - infoBox.offsetHeight - 10}px`;
            });



            
            // Обработчик событий для скрытия infoBox при уходе курсора
            marker.getElement().addEventListener('mouseleave', () => {
                infoBox.style.display = 'none';
            });
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

