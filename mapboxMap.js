// Ваш Access Token от Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuaXNhdmNoZW5rbyIsImEiOiJjbTJkcW9haXgxZ3ZsMmpyMnJvNWtiajk0In0.9VQSet50FTEZ0qMkQCMcsQ';

// Создаем карту Mapbox
const mapboxMap = new mapboxgl.Map({
    container: 'map', // ID контейнера
    style: 'mapbox://styles/denisavchenko/cm2b4x7in00pi01pgdw2l07yu', // Стиль карты
    center: [-20, 20], // Долгота и широта
    zoom: 1.7, // Начальный масштаб
    minZoom: 1, // Минимальный масштаб
    maxZoom: 3, // Максимальный масштаб
    pitch: 0, // Угол наклона
    bearing: 0, // Поворот
    antialias: true // Для улучшения качества
});

// Загружаем GeoJSON из файла
const geojsonUrl = '5sub.geojson'; // Укажите путь к вашему файлу

// Создаем элемент для всплывающего бокса
const hoverBox = document.createElement('div');
hoverBox.style.position = 'absolute';
hoverBox.style.backgroundColor = 'white';
hoverBox.style.padding = '5px 15px'; // Увеличиваем отступы для лучшего внешнего вида
hoverBox.style.borderRadius = '5px';
hoverBox.style.boxShadow = '3px 3px 0px rgba(0, 71, 206, 1)';
hoverBox.style.pointerEvents = 'none'; // Отключаем взаимодействие
hoverBox.style.display = 'none'; // Скрываем по умолчанию
hoverBox.style.fontSize = '20px'; // Увеличиваем размер шрифта
hoverBox.style.fontWeight = '500'; // Можно добавить полужирный шрифт
hoverBox.style.color = '#000'; // Цвет текста (по желанию)
document.body.appendChild(hoverBox);


mapboxMap.on('load', () => {
    fetch(geojsonUrl)
        .then(response => response.json())
        .then(data => {
            // Добавляем источник данных
            mapboxMap.addSource('geojson-source', {
                'type': 'geojson',
                'data': data
            });

            // Добавляем слой для выдавливания
            mapboxMap.addLayer({
                'id': 'extrusion-layer',
                'type': 'fill-extrusion',
                'source': 'geojson-source',
                'paint': {
                    'fill-extrusion-color': '#0047ce',
                    'fill-extrusion-height': [
                        'interpolate', ['linear'], ['zoom'],
                        2, 0, // При масштабе 4 высота 0 (полигон не выдавлен)
                        3, 150000 // При масштабе 5 высота 1000
                    ],
                    'fill-extrusion-opacity': [
                        'interpolate', ['linear'], ['zoom'],
                        2, 0, // При масштабе 4 полигон полностью прозрачный
                        3, 0.7 // При масштабе 5 полигон непрозрачен на 70%
                    ]
                }
            });
        })
        .catch(error => console.error('Ошибка загрузки GeoJSON:', error));
});

// Обработчик наведения мыши на полигон
mapboxMap.on('mousemove', 'extrusion-layer', (e) => {
    // Получаем название из свойств GeoJSON
    const name = e.features[0].properties.name || 'Север России';
    
    // Устанавливаем текст и показываем бокс
    hoverBox.textContent = name;
    hoverBox.style.display = 'block';
    
    // Перемещаем бокс к позиции мыши
    hoverBox.style.left = `${e.originalEvent.pageX + 10}px`; // Смещение на 10px вправо
    hoverBox.style.top = `${e.originalEvent.pageY + 10}px`; // Смещение на 10px вниз
});

// Событие, когда мышь покидает полигон
mapboxMap.on('mouseleave', 'extrusion-layer', () => {
    // Скрываем бокс
    hoverBox.style.display = 'none';
});

// Переменные для отслеживания направления скроллинга
let lastScrollTop = 0;
let animationStarted = false;
let currentTarget = 'initial'; // Текущее состояние — 'initial' или 'murmansk'

// Обработчик события скроллинга
window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop && !animationStarted && currentTarget === 'initial') {
        // Скроллим вниз и целевая позиция — Мурманск
        animationStarted = true;
        currentTarget = 'murmansk';

        // Анимация полета к Мурманску
        mapboxMap.flyTo({
            center: [47.0856, 65.9707], // Координаты Мурманска
            zoom: 5, // Целевой масштаб
            speed: 0.8, // Скорость анимации
            curve: 1.5, // Кривая полета
            pitch: 20, // Угол наклона
            easing: (t) => t, // Линейное затухание
            essential: true
        });

    } else if (currentScrollTop < lastScrollTop && !animationStarted && currentTarget === 'murmansk') {
        // Скроллим вверх и возвращаемся к начальному состоянию
        animationStarted = true;
        currentTarget = 'initial';

        // Анимация полета обратно к начальному положению
        mapboxMap.flyTo({
            center: [-20, 20], // Начальные координаты
            zoom: 1.7, // Начальный масштаб
            speed: 0.8, // Скорость анимации
            curve: 1.5, // Кривая полета
            pitch: 0, // Угол наклона
            easing: (t) => t, // Линейное затухание
            essential: true
        });
    }

    // Сбрасываем флаг анимации после завершения
    mapboxMap.once('moveend', () => {
        animationStarted = false;
    });

    // Обновляем позицию скроллинга
    lastScrollTop = currentScrollTop;
});
