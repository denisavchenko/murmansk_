// leafletMap.js

// Инициализация карты Leaflet
var leafletMap = L.map('map-leaflet-1', {
    center: [69.0079, 33.0686], // Координаты центра (Мурманск)
    zoom: 5, // Уровень масштабирования
    zoomControl: false, // Отключить контрол изменения масштаба
    attributionControl: false, // Отключить атрибуцию

});

// Добавление слоя карты (OpenStreetMap)
var myTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18, // Максимальный уровень масштабирования
    minZoom: 2,  // Минимальный уровень масштабирования
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // Атрибуция
}).addTo(leafletMap);
