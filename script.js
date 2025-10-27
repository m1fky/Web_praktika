let allNews = [];

async function loadNews() {
    try {
        const response = await fetch('content.txt');
        const text = await response.text();

        const lines = text.trim().split('\n');
        allNews = lines.map(line => {
            const parts = line.split(';');
            return {
                title: parts[0],
                date: parts[1],
                category: parts[2],
                preview: parts[3]
            };
        });

        displayMainNews(allNews.slice());
        displayTopNews(allNews.slice(0, 5));

    } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
        document.querySelector('.news-grid').innerHTML =
            '<p class="loading">Ошибка загрузки новостей. Убедитесь, что файл content.txt находится в той же папке.</p>';
    }
}

function displayMainNews(newsArray) {
    const newsGrid = document.querySelector('.news-grid');
    newsGrid.innerHTML = '';

    newsArray.forEach(news => {
        const article = document.createElement('article');
        article.className = 'news-card';

        const formattedDate = formatDate(news.date);
        const categoryClass = getCategoryClass(news.category);

        article.innerHTML = `
            <div class="news-header">
                <span class="category ${categoryClass}">${news.category}</span>
                <time datetime="${news.date}">${formattedDate}</time>
            </div>
            <div class="news-content">
                <h2>${news.title}</h2>
                <p class="preview-text">${news.preview}</p>
                <button class="read-more" onclick="togglePreview(this)">Читать далее</button>
            </div>
        `;

        newsGrid.appendChild(article);
    });
}

function displayTopNews(newsArray) {
    const topList = document.querySelector('aside ol');
    topList.innerHTML = '';

    newsArray.forEach(news => {
        const li = document.createElement('li');
        li.textContent = news.title;
        topList.appendChild(li);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

function getCategoryClass(category) {
    const categoryMap = {
        'Политика': 'politics',
        'Спорт': 'sports',
        'Технологии': 'tech',
        'Экономика': 'economy',
        'Культура': 'culture',
        'Наука': 'science',
        'Образование': 'education',
        'Недвижимость': 'realestate'
    };
    return categoryMap[category] || 'politics';
}

function togglePreview(button) {
    const preview = button.previousElementSibling;

    if (preview.style.maxHeight && preview.style.maxHeight !== '0px') {
        preview.style.maxHeight = '0';
        preview.style.opacity = '0';
        button.textContent = 'Читать далее';
    } else {
        preview.style.maxHeight = preview.scrollHeight + 'px';
        preview.style.opacity = '1';
        button.textContent = 'Свернуть';
    }
}





document.addEventListener('DOMContentLoaded', loadNews);
