// script.js - TingNotes

// --- 匯入專案資料 ---
import { allProjectsData } from './data.js';

// --- Theme Switching ---
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    if (!themeIcon) return;

    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>';
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');

    body.setAttribute('data-theme', savedTheme);
    if (themeIcon) {
        if (savedTheme === 'dark') {
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>';
        } else {
            themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
    }
}
window.toggleTheme = toggleTheme;

// --- Content Loading Functions (內頁用) ---

// 產生卡片 HTML
function generateProjectCardHTML(projectId, project) {
    if (!project) return '';

    const statusClass = project.status === 'completed' ? 'status-completed' :
                       project.status === 'progress' ? 'status-progress' : 'status-planned';
    const statusText = project.status === 'completed' ? '已完成' :
                      project.status === 'progress' ? '進行中' : '規劃中';

    const useTearEffect = project.useTearEffect === true;
    const tearClass = useTearEffect ? 'tear-card' : '';
    const imageUrl = project.imageUrl || '/assets/images/placeholder.jpg';
    const imageStyle = useTearEffect ? `style="--card-image: url('${imageUrl}')"` : '';

    const clickHandler = useTearEffect
        ? `onclick="handleTearCardClick(event, '${projectId}', '${project.topic}')"`
        : `onclick="handleProjectClick('${projectId}', '${project.topic}')"`;

    if (useTearEffect) {
        return `
            <div class="project-card ${tearClass}"
                 data-topic="${project.topic}"
                 data-project-id="${projectId}"
                 ${imageStyle}
                 ${clickHandler}>
                <div class="card-mask">
                    <div class="project-header">
                        <div class="project-icon">${project.icon || '❓'}</div>
                        <div class="project-info">
                            <div class="project-title">${project.title || 'Untitled Project'}</div>
                            <div class="project-subtitle">${project.subtitle || ''}</div>
                        </div>
                    </div>
                    <div class="project-meta">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        ${project.publishDate ? `<span>📅 ${project.publishDate}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="project-card"
             data-topic="${project.topic}"
             ${clickHandler}>
            <div class="project-header">
                <div class="project-icon">${project.icon || '❓'}</div>
                <div class="project-info">
                    <div class="project-title">${project.title || 'Untitled Project'}</div>
                    <div class="project-subtitle">${project.subtitle || ''}</div>
                </div>
            </div>
            <div class="project-meta">
                <span class="status-badge ${statusClass}">${statusText}</span>
                ${project.publishDate ? `<span>📅 ${project.publishDate}</span>` : ''}
                ${project.estimatedTime ? `<span>⏱️ ${project.estimatedTime}</span>` : ''}
                ${project.difficulty ? `<span class="difficulty-badge">${project.difficulty}</span>` : ''}
            </div>
        </div>
    `;
}

// 載入特定主題與分類的專案卡片
function loadProjectsByCategory(topic, category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (typeof allProjectsData === 'undefined') return;

    const categoryProjects = Object.entries(allProjectsData)
        .filter(([id, project]) => project.topic === topic && project.category === category)
        .map(([id, project]) => ({ id, ...project }));

    if (categoryProjects.length === 0) {
        if (!container.innerHTML.trim()) container.innerHTML = '';
        return;
    }

    const emptyState = container.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    container.innerHTML = categoryProjects
        .map(project => generateProjectCardHTML(project.id, project))
        .join('');
}

// --- Zen Mode: Home Page Functions ---

// Zen Mode 全域變數
let cachedProjects = [];
let currentSortMode = 'latest';
let currentSearchTerm = '';
let currentTopicFilter = '';

const TOPIC_LABELS = {
    learning: '學習', travel: '旅遊',
    investment: '投資', others: '其他', career: '職涯'
};

// 1. 渲染幽靈列表 (Ghost List)
function renderGhostList(projects, containerId = 'ghost-list-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (projects.length === 0) {
        container.innerHTML = '<div style="padding:20px; color:var(--text-muted); font-style:italic; font-family:\'Fira Code\', monospace;">// No results found.</div>';
        return;
    }

    projects.forEach(project => {
        const projectId = project.id;
        const projectTopic = project.topic;
        const metaInfo = project.publishDate || 'Pending';
        const topicLabel = TOPIC_LABELS[project.topic] || project.topic;

        const item = document.createElement('a');
        item.href = project.url;
        item.className = 'ghost-item fade-in visible';

        item.onclick = (e) => {
            e.preventDefault();
            handleProjectClick(projectId, projectTopic);
        };

        item.innerHTML = `
            <span class="g-date">${metaInfo}</span>
            <span class="g-title">${project.title}</span>
            <span class="g-tag">${topicLabel}</span>
        `;

        container.appendChild(item);
    });
}

// 2. 核心邏輯：排序與篩選
function applySortAndFilter() {
    let filtered = cachedProjects.filter(p => {
        if (currentTopicFilter && p.topic !== currentTopicFilter) return false;
        if (!currentSearchTerm) return true;
        const term = currentSearchTerm.toLowerCase();
        return (p.title && p.title.toLowerCase().includes(term)) ||
               (p.desc && p.desc.toLowerCase().includes(term)) ||
               (p.topic && p.topic.toLowerCase().includes(term)) ||
               (p.category && p.category.toLowerCase().includes(term));
    });

    // 依日期降序排列
    filtered.sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''));

    const header = document.querySelector('.list-header');
    if (header) {
        header.textContent = currentSearchTerm
            ? `SEARCH: "${currentSearchTerm}" (${filtered.length})_`
            : 'RECENT UPDATES_';
    }

    renderGhostList(filtered);
}

// 3. 初始化 Zen Search
function initZenSearch() {
    const searchInput = document.getElementById('zen-search-input');
    if (!searchInput) return;
    if (typeof allProjectsData === 'undefined') return;

    cachedProjects = Object.values(allProjectsData);
    applySortAndFilter();

    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim();
        applySortAndFilter();
    });
}

// 4. 主題篩選（由首頁 pill 按鈕觸發）
window.filterByTopic = function(topic) {
    currentTopicFilter = topic;
    document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
    const btnId = topic ? `tf-${topic}` : 'tf-all';
    const btn = document.getElementById(btnId);
    if (btn) btn.classList.add('active');
    const input = document.getElementById('zen-search-input');
    if (input) { input.value = ''; currentSearchTerm = ''; }
    applySortAndFilter();
};

// --- Event Handlers ---

window.handleProjectClick = function(projectId, topic) {
    if (typeof allProjectsData === 'undefined') return;
    const project = allProjectsData[projectId];
    if (project && project.url) {
        const finalUrl = project.url.startsWith('/') ? project.url : `/${project.url}`;
        window.location.href = finalUrl;
    }
};

window.handleTearCardClick = function(event, projectId, topic) {
    event.preventDefault();
    event.stopPropagation();
    if (typeof allProjectsData === 'undefined') return;

    const project = allProjectsData[projectId];
    if (!project || !project.url) return;

    const card = event.currentTarget;
    if (card.classList.contains('tearing')) return;

    card.classList.add('tearing');

    setTimeout(() => {
        const finalUrl = project.url.startsWith('/') ? project.url : `/${project.url}`;
        window.location.href = finalUrl;
    }, 600);
};

// 複製程式碼 (內頁用)
window.copyCode = function(button, codeBlockId) {
    const codeBlock = document.getElementById(codeBlockId);
    if (!codeBlock) return;
    const preElement = codeBlock.querySelector('pre');
    if (!preElement) return;

    navigator.clipboard.writeText(preElement.textContent).then(() => {
        const originalText = button.textContent;
        button.textContent = '✅ 已複製';
        button.classList.add('copied');
        button.disabled = true;
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
            button.disabled = false;
        }, 2000);
    }).catch(() => { button.textContent = '❌ 失敗'; });
};

// 手機選單開合
window.toggleMobileMenu = function() {
    const overlay = document.querySelector('.hidden-nav-overlay');
    const menuLabel = document.querySelector('.menu-label');

    if (overlay) {
        overlay.classList.toggle('active');
        const isActive = overlay.classList.contains('active');

        if (isActive) {
            overlay.querySelectorAll('li').forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100 + (index * 100));
            });
            if (menuLabel) menuLabel.textContent = 'CLOSE';
        } else {
            overlay.querySelectorAll('li').forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            });
            if (menuLabel) menuLabel.textContent = 'MENU';
        }
        return;
    }

    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (navLinks && mobileMenuBtn) {
        navLinks.classList.toggle('mobile-active');
        mobileMenuBtn.classList.toggle('active');
    }
};

// 分類頁籤切換 (內頁用)
window.switchTab = function(category) {
    if (!event || !event.currentTarget) return;
    const selector = event.currentTarget.closest('.category-selector');
    if (!selector) return;

    selector.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    selector.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

    event.currentTarget.classList.add('active');
    const targetPanel = selector.querySelector('#' + category + '-panel');
    if (targetPanel) targetPanel.classList.add('active');
};

// 淡入動畫初始化
function initAnimations() {
    try {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    } catch (error) {
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }
}

// 初始化觸控支援 (for Tear Card)
function initTouchSupport() {
    document.addEventListener('touchstart', (e) => {
        const card = e.target.closest('.project-card.tear-card');
        if (card && !card.classList.contains('touch-active')) card.classList.add('touch-active');
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const card = e.target.closest('.project-card.tear-card');
        if (card) setTimeout(() => card.classList.remove('touch-active'), 300);
    }, { passive: true });
}

// --- Inner Page Zen Mode Logic ---

let currentTopicData = [];

// 渲染內頁列表
function renderTopicList() {
    const container = document.getElementById('topic-list-container');
    if (!container) return;

    container.innerHTML = '';

    const sorted = [...currentTopicData].sort((a, b) =>
        (b.publishDate || '').localeCompare(a.publishDate || '')
    );

    if (sorted.length === 0) {
        container.innerHTML = '<div style="color:var(--text-muted); font-family:\'Fira Code\';">// No posts found.</div>';
        return;
    }

    sorted.forEach(project => {
        const item = document.createElement('a');
        item.href = project.url;
        item.className = 'ghost-item fade-in visible';
        item.onclick = (e) => {
            e.preventDefault();
            handleProjectClick(project.id, project.topic);
        };
        item.innerHTML = `
            <span class="g-date">${project.publishDate || 'Pending'}</span>
            <span class="g-title">${project.title}</span>
            <span class="g-tag">#${project.category}</span>
        `;
        container.appendChild(item);
    });
}

// 載入內頁資料
function loadZenTopicProjects(topic) {
    if (typeof allProjectsData === 'undefined') return;

    currentTopicData = Object.values(allProjectsData)
        .filter(p => p.topic === topic);

    renderTopicList();
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    initAnimations();
    initTouchSupport();

    const pathParts = window.location.pathname.split('/').filter(p => p && p !== 'index.html');
    const currentTopic = pathParts.length === 0 ? 'home' : pathParts[0].toLowerCase();

    if (currentTopic === 'home') {
        initZenSearch();
    } else {
        loadZenTopicProjects(currentTopic);
    }
});
