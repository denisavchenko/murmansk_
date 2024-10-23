function scrollToSection(event) {
    event.preventDefault(); // Отменяем стандартное поведение
    const targetId = event.currentTarget.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    // Плавная прокрутка с использованием window.scrollTo
    window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth"
    });
}

// Добавляем обработчики событий после загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".section-link");
    links.forEach(link => {
        link.addEventListener("click", scrollToSection);
    });
});




const cities = ["Мурманск", "Карелию", "Архангельск"];
let currentIndex = 0;

function changeCity() {
    currentIndex = (currentIndex + 1) % cities.length;
    const header = document.querySelector('.header-search');
    header.textContent = `Поехали в ${cities[currentIndex]}`;
}

setInterval(changeCity, 2000); // меняем текст каждые 2 секунды






function filterItems() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const items = document.querySelectorAll('.search-item');
    let found = false;

    items.forEach(item => {
        const name = item.getAttribute('data-name').toLowerCase();
        // Проверяем, начинается ли название с введенного текста
        if (name.startsWith(searchValue)) {
            item.style.display = 'block'; // Отображаем элемент
            found = true;
        } else {
            item.style.display = 'none'; // Скрываем элемент
        }
    });

    // Управляем сообщением, если ничего не найдено
    const noResults = document.getElementById('noResults');
    if (!found && searchValue !== '') {
        noResults.style.display = 'block'; // Показываем сообщение
    } else {
        noResults.style.display = 'none'; // Скрываем сообщение
    }
}

// Показать секцию "Карта"
function showMap() {
    document.getElementById('galleryContainer').style.display = 'none'; // Скрываем галерею
    document.getElementById('mapContainer').style.display = 'block'; // Показываем глобус
}

// Показать элементы каталога
function showGallery() {
    document.getElementById('galleryContainer').style.display = 'flex'; // Отображаем галерею
    document.getElementById('mapContainer').style.display = 'none'; // Скрываем глобус
}

// Инициализация: скрываем сообщение и глобус при загрузке страницы
window.onload = function() {
    document.getElementById('noResults').style.display = 'none'; // Скрываем сообщение при загрузке
    document.getElementById('mapContainer').style.display = 'none'; // Скрываем глобус при загрузке
};





// Функция для фильтрации элементов
function filterItems() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const items = document.querySelectorAll('.search-item'); // Измените на правильный селектор
    let found = false;

    items.forEach(item => {
        const name = item.getAttribute('data-name').toLowerCase();
        if (name.startsWith(searchValue)) {
            item.style.display = 'block'; // Показываем элемент
            found = true; // Найден хотя бы один элемент
        } else {
            item.style.display = 'none'; // Скрываем элемент
        }
    });

    // Показать сообщение, если ничего не найдено
    const noResults = document.getElementById('noResults');
    if (!found && searchValue !== '') { // Проверяем, введено ли что-то в строку поиска
        noResults.style.display = 'flex'; // Показать сообщение
    } else {
        noResults.style.display = 'none'; // Скрыть сообщение
    }
}




