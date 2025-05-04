document.addEventListener('DOMContentLoaded', () => {
    const articleContent = document.getElementById('article-content');

    const urlParams = new URLSearchParams(window.location.search);
    const newsId = parseInt(urlParams.get('id'), 10);

    async function loadNewsData() {
        try {
            const response = await fetch('assets/data/media.xml');
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
            const items = xmlDoc.getElementsByTagName('item');
            const newsData = Array.from(items).map((item, index) => ({
                id: index + 1,
                title: item.getElementsByTagName('title')[0].textContent,
                date: item.getElementsByTagName('date')[0].textContent,
                image: item.getElementsByTagName('image')[0].textContent,
                content: item.getElementsByTagName('content')[0].textContent
            }));

            const newsItem = newsData.find(item => item.id === newsId);
            if (newsItem) {
                renderArticle(newsItem);
            } else {
                articleContent.innerHTML = '<p class="article-error">Новость не найдена</p>';
            }
        } catch (error) {
            console.error('Error loading news:', error);
            articleContent.innerHTML = '<p class="article-error">Ошибка загрузки новости</p>';
        }
    }

    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    }

    function renderArticle(item) {
        articleContent.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="article-image" loading="lazy">
            <span class="article-date">${formatDate(item.date)}</span>
            <h1 class="article-title">${item.title}</h1>
            <div class="article-text">${item.content}</div>
        `;
    }

    loadNewsData();
});