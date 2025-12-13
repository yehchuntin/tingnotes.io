// script.js - Common JavaScript functions for TingNotes (Zen Mode Edition with Sorting)

// --- Firebase SDK Import ---
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, get, runTransaction } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// --- 匯入專案資料 ---
import { allProjectsData } from './data.js';

// --- Firebase Configuration & Initialization ---
const firebaseConfig = {
    apiKey: "AIzaSyAbEhPO8lUDT4nCPmfw1fZg3t2eGO6JUaI",
    authDomain: "tingnotes-ccb46.firebaseapp.com",
    databaseURL: "https://tingnotes-ccb46-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tingnotes-ccb46",
    storageBucket: "tingnotes-ccb46.appspot.com",
    messagingSenderId: "297732922233",
    appId: "1:297732922233:web:aab5a5d20ab2006a736da8",
    measurementId: "G-NG8BMXM21R"
};

let database;
try {
    const app = initializeApp(firebaseConfig);
    database = getDatabase(app);
} catch (error) {
    console.error("Firebase Initialization Failed:", error);
    database = null;
}

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

// --- Firebase Interaction Functions ---
async function getViewCount(projectId, topic) {
    if (!database) return 0;
    const path = `${capitalizeFirstLetter(topic)}/${projectId}/totalViews`;
    try {
        const snapshot = await get(ref(database, path));
        return snapshot.exists() ? snapshot.val() : 0;
    } catch (error) {
        console.error(`Failed to get view count for ${path}:`, error);
        return 0;
    }
}

async function incrementViewCount(projectId, topic) {
    if (!database) return;
    const path = `${capitalizeFirstLetter(topic)}/${projectId}/totalViews`;
    try {
        const counterRef = ref(database, path);
        await runTransaction(counterRef, (currentValue) => (currentValue || 0) + 1);
        console.log(`View count incremented for ${path}`);
    } catch (error) {
        console.error(`Failed to increment counter for ${path}:`, error);
    }
}

// --- Utility Functions ---
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatNumber(num) {
    if (num === null || typeof num === 'undefined') return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// --- 更新統計數據 (主要用於內頁) ---
async function updateStatistics() {
    if (typeof allProjectsData === 'undefined') return;

    const pathParts = window.location.pathname.split('/').filter(p => p && p !== 'index.html');
    const currentTopic = pathParts.length === 0 ? 'home' : pathParts[0].toLowerCase();

    if (currentTopic === 'home') return; // 首頁使用 Zen 模式，不需要更新這些舊統計元件

    const topicProjects = Object.entries(allProjectsData)
        .filter(([id, project]) => project.topic === currentTopic)
        .map(([id, project]) => ({ id, ...project }));

    let totalContentElementId;
    switch(currentTopic) {
        case 'learning': totalContentElementId = 'total-content'; break;
        case 'travel': totalContentElementId = 'total-trips'; break;
        case 'career': totalContentElementId = 'total-experience'; break;
        case 'others': totalContentElementId = 'total-posts'; break;
    }

    if (totalContentElementId) {
        const totalContentElement = document.getElementById(totalContentElementId);
        if (totalContentElement) {
            totalContentElement.textContent = topicProjects.length;
        }
    }

    // 更新總瀏覽量與最後更新時間
    let topicTotalViews = 0;
    if (topicProjects.length > 0) {
        try {
            const viewCounts = await Promise.all(topicProjects.map(project => getViewCount(project.id, project.topic)));
            topicTotalViews = viewCounts.reduce((sum, count) => sum + (count || 0), 0);
        } catch (error) {
            console.error(error);
        }
    }

    const totalViewsElement = document.getElementById('total-views');
    if (totalViewsElement) {
        const loadingIndicator = totalViewsElement.querySelector('.loading');
        if (loadingIndicator) loadingIndicator.remove();
        totalViewsElement.textContent = formatNumber(topicTotalViews);
    }

    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const now = new Date();
        lastUpdatedElement.textContent = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
}

// --- Content Loading Functions (內頁用) ---

// 產生卡片 HTML
function generateProjectCardHTML(projectId, project, views) {
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
                    <div>
                        <div class="project-meta">
                            <span class="status-badge ${statusClass}">${statusText}</span>
                            ${project.publishDate ? `<span>📅 ${project.publishDate}</span>` : ''}
                        </div>
                        <div class="project-stats">
                            <div class="view-count">${formatNumber(views)} 次觀看</div>
                        </div>
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
            <div>
                <div class="project-meta">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    ${project.publishDate ? `<span>📅 ${project.publishDate}</span>` : ''}
                    ${project.estimatedTime ? `<span>⏱️ ${project.estimatedTime}</span>` : ''}
                </div>
                <div class="project-stats">
                    <div class="view-count">${formatNumber(views)} 次觀看</div>
                    ${project.difficulty ? `<div class="difficulty-badge">${project.difficulty}</div>` : ''}
                </div>
            </div>
        </div>
    `;
}

// 載入特定主題與分類的專案卡片
async function loadProjectsByCategory(topic, category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (typeof allProjectsData === 'undefined') {
         container.innerHTML = '<p style="color: red;">Error: Project data not available.</p>';
         return;
    }

    const categoryProjects = Object.entries(allProjectsData)
        .filter(([id, project]) => project.topic === topic && project.category === category)
        .map(([id, project]) => ({ id, ...project }));

    if (categoryProjects.length === 0) {
        // 如果該分類沒有專案，且容器內沒有其他內容，才清空
        if (!container.innerHTML.trim()) container.innerHTML = '';
        return;
    }

    // 移除 empty-state (如果有的話)
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    let html = '';
    try {
        const viewsPromises = categoryProjects.map(project => getViewCount(project.id, project.topic));
        const viewsArray = await Promise.all(viewsPromises);

        categoryProjects.forEach((project, index) => {
            html += generateProjectCardHTML(project.id, project, viewsArray[index]);
        });

        container.innerHTML = html;
    } catch (error) {
         console.error(`Error loading projects for ${topic}/${category}:`, error);
         container.innerHTML = '<p style="color: red;">載入專案時發生錯誤。</p>';
    }
}

// 新增：載入特定主題的所有專案 (混合顯示，不分類)
function loadAllTopicProjects(topic, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (typeof allProjectsData === 'undefined') return;

    // 1. 找出所有屬於該 topic 的專案
    const projects = Object.values(allProjectsData)
        .filter(p => p.topic === topic)
        .sort((a, b) => {
            // 2. 依照日期排序 (新的在前面)
            return (b.publishDate || '').localeCompare(a.publishDate || '');
        });

    if (projects.length === 0) {
        container.innerHTML = '<div class="empty-state">Coming Soon...</div>';
        return;
    }

    // 3. 生成 HTML
    let html = '';
    // 注意：這裡我們直接傳入 views=0 或 null，因為您說不想特別秀觀看數
    projects.forEach(project => {
        html += generateProjectCardHTML(project.id, project, null); 
    });

    container.innerHTML = html;
}

// --- Zen Mode: Home Page Functions (Updated with Sorting) ---

// Zen Mode 全域變數
let cachedProjects = []; // 儲存所有專案資料 (含瀏覽量)
let currentSortMode = 'latest'; // 預設排序：最新
let currentSearchTerm = '';     // 目前搜尋關鍵字

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
        let dateStr = project.publishDate || 'Pending';
        const projectId = project.id; 
        const projectTopic = project.topic;
        
        // 如果是熱門排序，顯示瀏覽量而不是日期，增加資訊感
        let metaInfo = dateStr;
        if (currentSortMode === 'popular' && project.views) {
            metaInfo = `🔥 ${formatNumber(project.views)}`;
        } else if (currentSortMode === 'popular') {
            metaInfo = `🔥 0`; // 預設無資料時
        }

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
            <span class="g-tag">#${project.category}</span>
        `;
        
        container.appendChild(item);
    });
}

// 2. 核心邏輯：排序與篩選
function applySortAndFilter() {
    // A. 先篩選 (Filter)
    let filtered = cachedProjects.filter(p => {
        if (!currentSearchTerm) return true;
        const term = currentSearchTerm.toLowerCase();
        return (p.title && p.title.toLowerCase().includes(term)) || 
               (p.desc && p.desc.toLowerCase().includes(term)) ||
               (p.topic && p.topic.toLowerCase().includes(term)) ||
               (p.category && p.category.toLowerCase().includes(term));
    });

    // B. 再排序 (Sort)
    filtered.sort((a, b) => {
        if (currentSortMode === 'latest') {
            // 依日期降序
            return (b.publishDate || '').localeCompare(a.publishDate || '');
        } else if (currentSortMode === 'popular') {
            // 依瀏覽量降序 (若無資料則視為0)
            const viewsA = a.views || 0;
            const viewsB = b.views || 0;
            return viewsB - viewsA;
        }
    });

    // C. 更新標題與渲染
    const header = document.querySelector('.list-header');
    if(header) {
        if (currentSearchTerm) {
            header.textContent = `SEARCH: "${currentSearchTerm}" (${filtered.length})_`;
        } else {
            header.textContent = currentSortMode === 'latest' ? 'RECENT UPDATES_' : 'MOST POPULAR_';
        }
    }
    
    renderGhostList(filtered);
}

// 3. 切換排序模式 (由 HTML 按鈕觸發)
window.switchSort = function(mode) {
    currentSortMode = mode;
    
    // 更新按鈕樣式
    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`sort-${mode}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // 重新渲染
    applySortAndFilter();
}

// 4. 初始化 Zen Search
async function initZenSearch() {
    const searchInput = document.getElementById('zen-search-input');
    if (!searchInput) return;

    if (typeof allProjectsData === 'undefined') return;

    // --- 第一步：轉換資料並初次渲染 (快速顯示，不等待瀏覽量) ---
    cachedProjects = Object.values(allProjectsData).map(p => ({...p, views: 0}));
    applySortAndFilter(); // 預設顯示 Latest

    // 監聽輸入
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim();
        applySortAndFilter();
    });

    // --- 第二步：背景抓取真實瀏覽量 (為了 Popular 排序) ---
    try {
        const promises = cachedProjects.map(async (project) => {
            const views = await getViewCount(project.id, project.topic);
            // 更新 cachedProjects 中的瀏覽量
            const targetProject = cachedProjects.find(p => p.id === project.id);
            if (targetProject) targetProject.views = views || 0;
        });
        
        // 等全部抓完後，如果使用者已經切換到 Popular，就自動更新畫面
        // 這裡不需要 await 全部完成才動作，可以讓它偷偷在背景跑
        await Promise.all(promises);
        console.log("All view counts fetched for sorting.");
        
        // 如果當下使用者正在看熱門排序，資料回來後要更新畫面
        if (currentSortMode === 'popular') {
            applySortAndFilter();
        }
    } catch (e) {
        console.warn("Background view fetch failed:", e);
    }
}

// 5. 標籤快速篩選
window.filterByTag = function(tag) {
    const input = document.getElementById('zen-search-input');
    if (input) {
        input.value = tag; // 填入文字
        input.dispatchEvent(new Event('input')); // 觸發搜尋
        input.focus();
    }
};

// --- Event Handlers ---

// 一般專案卡片點擊
window.handleProjectClick = async function(projectId, topic) {
    if (typeof allProjectsData === 'undefined') return;
    
    const project = allProjectsData[projectId];
    if (project && project.url) {
        try {
            await incrementViewCount(projectId, topic);
        } catch (e) { console.error(e); }
        
        const finalUrl = project.url.startsWith('/') ? project.url : `/${project.url}`;
        window.location.href = finalUrl;
    }
};

// 撕開卡片點擊處理
window.handleTearCardClick = async function(event, projectId, topic) {
    event.preventDefault();
    event.stopPropagation();
    
    if (typeof allProjectsData === 'undefined') return;
    
    const project = allProjectsData[projectId];
    if (!project || !project.url) return;
    
    const card = event.currentTarget;
    if (card.classList.contains('tearing')) return;
    
    card.classList.add('tearing');
    
    try {
        await incrementViewCount(projectId, topic);
    } catch (e) { console.error(e); }
    
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
    const codeText = preElement.textContent;

    navigator.clipboard.writeText(codeText).then(() => {
        const originalText = button.textContent;
        button.textContent = '✅ 已複製'; 
        button.classList.add('copied'); 
        button.disabled = true;
        setTimeout(() => { 
            button.textContent = originalText; 
            button.classList.remove('copied'); 
            button.disabled = false; 
        }, 2000);
    }).catch(err => {
        console.error('Copy failed', err);
        button.textContent = '❌ 失敗';
    });
};

// 手機選單開合 (Zen Mode & Classic)
// 這裡同時相容兩種選單：Zen Mode 的 Overlay 和 內頁的傳統選單
window.toggleMobileMenu = function() {
    // 1. Zen Mode 全螢幕選單檢查
    const overlay = document.querySelector('.hidden-nav-overlay');
    const menuLabel = document.querySelector('.menu-label');
    
    if (overlay) {
        overlay.classList.toggle('active');
        const isActive = overlay.classList.contains('active');
        
        if (isActive) {
            // 動畫：依序顯示
            const items = overlay.querySelectorAll('li');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100 + (index * 100));
            });
            if(menuLabel) menuLabel.textContent = 'CLOSE';
        } else {
            // 重置
            const items = overlay.querySelectorAll('li');
            items.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            });
            if(menuLabel) menuLabel.textContent = 'MENU';
        }
        return; // Zen Mode 處理完畢，直接返回
    }

    // 2. 傳統內頁選單 (Fallback)
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if(navLinks && mobileMenuBtn) {
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
}

// 淡入動畫初始化
function initAnimations() {
    try {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
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

// --- Inner Page Zen Mode Logic (內頁終端機模式) ---

let currentTopicData = []; // 暫存該頁面的所有文章
let currentTopicSort = 'latest'; // 內頁排序狀態

// 1. 切換內頁排序
window.switchTopicSort = function(mode) {
    currentTopicSort = mode;
    
    // 更新按鈕樣式
    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(`topic-sort-${mode}`);
    if (btn) btn.classList.add('active');

    // 重新渲染列表
    renderTopicList();
}

// 2. 渲染內頁終端機列表
function renderTopicList() {
    const container = document.getElementById('topic-list-container');
    if (!container) return;
    
    container.innerHTML = '';

    // 排序邏輯
    const sortedProjects = [...currentTopicData].sort((a, b) => {
        if (currentTopicSort === 'latest') {
            return (b.publishDate || '').localeCompare(a.publishDate || '');
        } else {
            return (b.views || 0) - (a.views || 0);
        }
    });

    if (sortedProjects.length === 0) {
        container.innerHTML = '<div style="color:var(--text-muted); font-family:\'Fira Code\';">// No posts found.</div>';
        return;
    }

    // 生成列表 HTML (使用與首頁相同的 ghost-item 樣式)
    sortedProjects.forEach(project => {
        // 根據排序模式決定顯示日期還是瀏覽量
        let metaInfo = project.publishDate || 'Pending';
        if (currentTopicSort === 'popular') {
            metaInfo = `🔥 ${formatNumber(project.views || 0)}`;
        }

        const item = document.createElement('a');
        item.href = project.url;
        item.className = 'ghost-item fade-in visible';
        item.onclick = (e) => {
            e.preventDefault();
            handleProjectClick(project.id, project.topic);
        };

        // 這裡的結構跟首頁一樣：日期 | 標題 | 標籤
        item.innerHTML = `
            <span class="g-date">${metaInfo}</span>
            <span class="g-title">${project.title}</span>
            <span class="g-tag">#${project.category}</span>
        `;
        container.appendChild(item);
    });
}

// 3. 載入內頁資料 (初始化用)
async function loadZenTopicProjects(topic) {
    const container = document.getElementById('topic-list-container');
    if (!container) return;
    if (typeof allProjectsData === 'undefined') return;

    // A. 取得該主題的所有專案
    currentTopicData = Object.values(allProjectsData)
        .filter(p => p.topic === topic)
        .map(p => ({...p, views: 0})); // 先預設 views 為 0

    // B. 初次渲染 (讓使用者先看到東西，不用等 Firebase)
    renderTopicList();

    // C. 背景抓取瀏覽量 (為了 Popular 排序)
    try {
        const promises = currentTopicData.map(async (project) => {
            const views = await getViewCount(project.id, project.topic);
            const target = currentTopicData.find(p => p.id === project.id);
            if (target) target.views = views || 0;
        });
        
        await Promise.all(promises);
        
        // 如果使用者切換到熱門，或者單純想更新數據，可以重繪
        // 這裡我們靜默更新，除非使用者點了 Popular
        if (currentTopicSort === 'popular') {
            renderTopicList();
        }
    } catch (e) {
        console.warn('Background view fetch error:', e);
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("=== TingNotes Initialization Started ===");
    
    loadTheme();
    initAnimations();
    initTouchSupport();
    updateStatistics();
    
    // 路由判斷：決定載入首頁 Zen Mode 還是內頁內容
    const pathParts = window.location.pathname.split('/').filter(p => p && p !== 'index.html');
    const currentTopic = pathParts.length === 0 ? 'home' : pathParts[0].toLowerCase();
    
    console.log(`Current page topic: ${currentTopic}`);

    if (currentTopic === 'home') {
        // === 首頁：初始化 Zen Search ===
        console.log("Initializing Zen Mode Homepage...");
        initZenSearch();
    } else {
        // === 內頁：改用 Zen Mode 列表載入 ===
        console.log(`Loading Zen Mode list for: ${currentTopic}`);
        loadZenTopicProjects(currentTopic);
    }

    console.log("=== TingNotes Initialization Complete ===");
});