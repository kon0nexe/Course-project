document.addEventListener('DOMContentLoaded', () => {
    const newsGrid = document.getElementById('news-grid');
    const paginationPages = document.getElementById('pagination-pages');
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    const itemsPerPage = 6;
    let currentPage = 1;
    let newsData = [];

    async function loadNewsData() {
        try {
            const response = await fetch('assets/data/media.xml');
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
            const items = xmlDoc.getElementsByTagName('item');
            newsData = Array.from(items).map((item, index) => ({
                id: item.getElementsByTagName('id')[0]?.textContent || `${index + 1}`,
                title: item.getElementsByTagName('title')[0].textContent,
                date: item.getElementsByTagName('date')[0].textContent,
                excerpt: item.getElementsByTagName('excerpt')[0].textContent,
                image: item.getElementsByTagName('image')[0].textContent,
                link: item.getElementsByTagName('link')[0].textContent
            }));
            renderNews();
        } catch (error) {
            console.error('Error loading news:', error);
            newsGrid.innerHTML = '<p>Ошибка загрузки новостей</p>';
        }
    }

    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    }

    function renderNews() {
        newsGrid.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const currentItems = newsData.slice(start, end);

        currentItems.forEach((item, index) => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            newsItem.setAttribute('data-news-id', item.id);

            if (index % 3 === 0) newsItem.classList.add('tall');
            newsItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="news-image" loading="lazy">
                <div class="news-content">
                    <span class="news-date">${formatDate(item.date)}</span>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${item.excerpt}</p>
                    <a href="news.html?id=${item.id}" class="news-link">Читать далее</a>
                </div>
            `;
            newsGrid.appendChild(newsItem);
            setTimeout(() => {
                newsItem.classList.add('visible');
            }, index * 100); 
        });

        renderPagination();
    }

    function renderPagination() {
        const totalPages = Math.ceil(newsData.length / itemsPerPage);
        paginationPages.innerHTML = '';
        addPageButton(1, totalPages);

        if (totalPages > 3) {
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                endPage = Math.min(4, totalPages - 1);
            } else if (currentPage >= totalPages - 2) {
                startPage = Math.max(totalPages - 3, 2);
            }

            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.classList.add('pagination-ellipsis');
                ellipsis.textContent = '...';
                paginationPages.appendChild(ellipsis);
            }

            for (let i = startPage; i <= endPage; i++) {
                addPageButton(i, totalPages);
            }

            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.classList.add('pagination-ellipsis');
                ellipsis.textContent = '...';
                paginationPages.appendChild(ellipsis);
            }
        } else {
            for (let i = 2; i < totalPages; i++) {
                addPageButton(i, totalPages);
            }
        }

        if (totalPages > 1) {
            addPageButton(totalPages, totalPages);
        }

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    function addPageButton(pageNum, totalPages) {
        const pageBtn = document.createElement('button');
        pageBtn.classList.add('page-btn');
        if (pageNum === currentPage) pageBtn.classList.add('active');
        pageBtn.textContent = pageNum;
        pageBtn.addEventListener('click', () => {
            currentPage = pageNum;
            renderNews();
        });
        paginationPages.appendChild(pageBtn);
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderNews();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < Math.ceil(newsData.length / itemsPerPage)) {
            currentPage++;
            renderNews();
        }
    });

    loadNewsData();
});