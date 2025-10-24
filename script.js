// script.js - Common JavaScript functions for TingNotes

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
    if (!database) {
        console.warn("Firebase database is not initialized. Cannot get view count.");
        return 0;
    }
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
    if (!database) {
        console.warn("Firebase database is not initialized. Cannot increment view count.");
        return;
    }
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

// --- 更新統計數據 ---
async function updateStatistics() {
    if (typeof allProjectsData === 'undefined') {
         console.error("updateStatistics: allProjectsData is not defined.");
         const totalViewsElement = document.getElementById('total-views');
         if (totalViewsElement) totalViewsElement.textContent = '錯誤';
         return;
    }

    const pathParts = window.location.pathname.split('/').filter(p => p && p !== 'index.html');
    const currentTopic = pathParts.length === 0 ? 'home' : pathParts[0].toLowerCase();

    if (currentTopic === 'home') {
        console.log("On home page, skipping topic-specific statistics update.");
        return;
    }

    const topicProjects = Object.entries(allProjectsData)
        .filter(([id, project]) => project.topic === currentTopic)
        .map(([id, project]) => ({ id, ...project }));

    console.log(`Found ${topicProjects.length} projects for topic: ${currentTopic}`);

    let totalContentElementId;
    switch(currentTopic) {
        case 'learning': totalContentElementId = 'total-content'; break;
        case 'travel': totalContentElementId = 'total-trips'; break;
        case 'career': totalContentElementId = 'total-experience'; break;
        case 'others': totalContentElementId = 'total-posts'; break;
        default: totalContentElementId = null;
    }

    if (totalContentElementId) {
        const totalContentElement = document.getElementById(totalContentElementId);
        if (totalContentElement) {
            totalContentElement.textContent = topicProjects.length;
            console.log(`Updated ${totalContentElementId} count to: ${topicProjects.length}`);
        } else {
             console.log(`Could not find element with ID: ${totalContentElementId}`);
        }
    }

    let topicTotalViews = 0;
    if (topicProjects.length > 0) {
         console.log("Calculating total views for topic:", currentTopic);
        try {
            const viewCountsPromises = topicProjects.map(project => getViewCount(project.id, project.topic));
            const viewCounts = await Promise.all(viewCountsPromises);
            topicTotalViews = viewCounts.reduce((sum, count) => sum + (count || 0), 0);
            console.log(`Total views calculated for topic ${currentTopic}: ${topicTotalViews}`);
        } catch (error) {
            console.error(`Error calculating total views for topic ${currentTopic}:`, error);
            topicTotalViews = 0;
        }
    } else {
         console.log(`No projects found for topic ${currentTopic}, total views set to 0.`);
         topicTotalViews = 0;
    }

    const totalViewsElement = document.getElementById('total-views');
    if (totalViewsElement) {
        const loadingIndicator = totalViewsElement.querySelector('.loading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        totalViewsElement.textContent = formatNumber(topicTotalViews);
        console.log("Updated total views display to:", formatNumber(topicTotalViews));
    } else {
        console.log("Could not find element for total views display.");
    }

    const now = new Date();
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`;
         console.log("Updated last updated display.");
    } else {
         console.log("Could not find element for last updated display.");
    }
}

// --- Content Loading Functions ---

// 產生卡片 HTML（通用函數，支援撕開效果）
function generateProjectCardHTML(projectId, project, views) {
    if (!project) return '';
    
    const statusClass = project.status === 'completed' ? 'status-completed' :
                       project.status === 'progress' ? 'status-progress' : 'status-planned';
    const statusText = project.status === 'completed' ? '已完成' :
                      project.status === 'progress' ? '進行中' : '規劃中';
    
    // 檢查是否啟用撕開效果
    const useTearEffect = project.useTearEffect === true;
    const tearClass = useTearEffect ? 'tear-card' : '';
    const imageUrl = project.imageUrl || '/assets/images/placeholder.jpg';
    const imageStyle = useTearEffect ? `style="--card-image: url('${imageUrl}')"` : '';
    
    // 決定點擊處理函數
    const clickHandler = useTearEffect 
        ? `onclick="handleTearCardClick(event, '${projectId}', '${project.topic}')"`
        : `onclick="handleProjectClick('${projectId}', '${project.topic}')"`;
    
    // 如果使用撕開效果，使用不同的 HTML 結構
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
                            ${project.estimatedTime ? `<span>⏱️ ${project.estimatedTime}</span>` : ''}
                        </div>
                        <div class="project-stats">
                            <div class="view-count">${formatNumber(views)} 次觀看</div>
                            ${project.difficulty ? `<div class="difficulty-badge">${project.difficulty}</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 一般卡片（不使用撕開效果）
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
                    ${project.chapters ? `<span>📚 ${project.chapters}章節</span>` : ''}
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
         console.error(`allProjectsData is not defined when loading ${topic}/${category}.`);
         container.innerHTML = '<p style="color: red;">Error: Project data not available.</p>';
         return;
    }

    const categoryProjects = Object.entries(allProjectsData)
        .filter(([id, project]) => project.topic === topic && project.category === category)
        .map(([id, project]) => ({ id, ...project }));

    if (categoryProjects.length === 0) {
        if (!container.querySelector('.empty-state')) {
            container.innerHTML = '';
        }
        return;
    }

    const emptyState = container.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

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

// 載入熱門專案（首頁用）
async function loadHotProjects(containerId, count = 3) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Hot projects container with ID ${containerId} not found.`);
        return;
    }

     if (typeof allProjectsData === 'undefined') {
         console.error("allProjectsData is not defined for hot projects.");
         container.innerHTML = '<p style="color: red;">Error: Project data not loaded.</p>';
         return;
    }
    console.log("allProjectsData available for hot projects.");

    try {
        const projectsWithViews = await Promise.all(
            Object.entries(allProjectsData).map(async ([id, project]) => {
                const views = await getViewCount(id, project.topic);
                return { id, ...project, views: views || 0 };
            })
        );
        console.log("Fetched views for all projects:", projectsWithViews);

        const sortedProjects = projectsWithViews
            .sort((a, b) => b.views - a.views)
            .slice(0, count);
        console.log("Sorted top projects:", sortedProjects);

        if (sortedProjects.length === 0) {
            console.log("No hot projects found, showing empty state.");
            container.innerHTML = `
                <div class="empty-state" style="min-height: 150px; padding: 20px;">
                    <div class="empty-icon">🚀</div>
                    <div class="empty-title">尚無熱門專案</div>
                    <div class="empty-desc">開始創作更多內容吧！</div>
                </div>`;
            return;
        }

        const projectsHTML = sortedProjects.map((project, index) => {
            let rankIcon;
            let rankClass = `rank-${index + 1}`;
            switch(index + 1) {
                case 1: rankIcon = '🥇'; break;
                case 2: rankIcon = '🥈'; break;
                case 3: rankIcon = '🥉'; break;
                default: rankIcon = (index + 1).toString(); rankClass = ''; break;
            }
            const description = project.desc || project.subtitle || '';
            const topicName = project.topic ? capitalizeFirstLetter(project.topic) : 'Unknown';
            const statusClass = project.status === 'completed' ? 'status-completed' :
                               project.status === 'progress' ? 'status-progress' : 'status-planned';
            const statusText = project.status === 'completed' ? '已完成' :
                              project.status === 'progress' ? '進行中' : '規劃中';

             return `
                <a href="${project.url}" class="project-item" onclick="event.preventDefault(); handleProjectClick('${project.id}', '${project.topic}')">
                     <div class="project-rank ${rankClass}">${rankIcon}</div>
                     <div class="project-info">
                         <div class="project-name">${project.title || 'Untitled Project'}</div>
                         <div class="project-desc">${description}</div>
                          <div class="project-meta">
                              <span class="category-badge ${project.topic}">${topicName}</span>
                              ${project.publishDate ? `<span>📅 ${project.publishDate}</span>` : ''}
                              <span class="status-badge ${statusClass}">${statusText}</span>
                          </div>
                     </div>
                     <div class="project-stats">
                         <div class="project-views">${formatNumber(project.views)} 次觀看</div>
                         ${project.difficulty ? `<div class="project-status">${project.difficulty}</div>` : ''}
                     </div>
                </a>
            `;
        }).join('');

        container.innerHTML = projectsHTML;
        console.log("Hot projects HTML inserted.");

    } catch (error) {
        console.error('載入熱門專案失敗:', error);
        container.innerHTML = `
            <div class="empty-state" style="min-height: 150px; padding: 20px;">
                <div class="empty-icon">⚠️</div>
                <div class="empty-title">載入失敗</div>
                <div class="empty-desc">無法載入專案數據，請稍後再試</div>
            </div>`;
    }
}

// script.js (續) - Event Handlers

// --- Event Handlers ---

// 一般專案卡片點擊
window.handleProjectClick = async function(projectId, topic) {
     if (typeof allProjectsData === 'undefined') {
         console.error("Cannot handle click: allProjectsData is not defined.");
         return;
     }
    const project = allProjectsData[projectId];
    if (project && project.url) {
        try {
            await incrementViewCount(projectId, topic);
            const finalUrl = project.url.startsWith('/') ? project.url : `/${project.url}`;
            window.location.href = finalUrl;
        } catch (error) {
            console.error("Error during project click handling:", error);
            const finalUrl = project.url.startsWith('/') ? project.url : `/${project.url}`;
             window.location.href = finalUrl;
        }
    } else {
        console.error(`Project data or URL not found for ID: ${projectId}`);
    }
};

// 撕開卡片點擊處理（支援所有主題）
window.handleTearCardClick = async function(event, projectId, topic) {
    event.preventDefault();
    event.stopPropagation();
    
    if (typeof allProjectsData === 'undefined') {
        console.error("Cannot handle click: allProjectsData is not defined.");
        return;
    }
    
    const project = allProjectsData[projectId];
    if (!project || !project.url) {
        console.error(`Project data or URL not found for ID: ${projectId}`);
        return;
    }
    
    const card = event.currentTarget;
    
    // 防止重複點擊
    if (card.classList.contains('tearing')) {
        return;
    }
    
    // 添加撕開動畫
    card.classList.add('tearing');
    
    // 增加觀看次數
    try {
        await incrementViewCount(projectId, topic);
    } catch (error) {
        console.error("Error incrementing view count:", error);
    }
    
    // 等待動畫完成後跳轉
    setTimeout(() => {
        const finalUrl = project.url.startsWith('/') ? project.url : `/${project.url}`;
        window.location.href = finalUrl;
    }, 600); // 配合 CSS 動畫時長
};

// TOC 子選單開合
window.toggleSubMenu = function(element) {
    if (event) event.preventDefault();
    const arrow = element.querySelector('.arrow');
    const subMenu = element.parentElement.querySelector('.sub-menu');
    if (subMenu && arrow) {
        arrow.classList.toggle('expanded');
        subMenu.classList.toggle('show');
    }
};

// 複製程式碼
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
        try {
            const textArea = document.createElement('textarea');
            textArea.value = codeText;
            textArea.style.position = 'fixed'; 
            textArea.style.top = "0"; 
            textArea.style.left = "0"; 
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus(); 
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            const originalText = button.textContent;
            button.textContent = '✅ 已複製 (Fallback)'; 
            button.classList.add('copied'); 
            button.disabled = true;
            setTimeout(() => { 
                button.textContent = originalText; 
                button.classList.remove('copied'); 
                button.disabled = false; 
            }, 2000);
        } catch (fallbackErr) {
            button.textContent = '複製失敗';
             setTimeout(() => { 
                 button.textContent = '📋 複製'; 
             }, 2000);
        }
    });
};

// 手機選單開合
window.toggleMobileMenu = function() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if(navLinks && mobileMenuBtn) {
        navLinks.classList.toggle('mobile-active');
        mobileMenuBtn.classList.toggle('active');
    }
};

// 分類頁籤切換
window.switchTab = function(category) {
    if (!event || !event.currentTarget) {
        console.error("SwitchTab called without event context.");
        return;
    }
    const selector = event.currentTarget.closest('.category-selector');
    if (!selector) return;
    
    selector.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    selector.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    const targetPanel = selector.querySelector('#' + category + '-panel');
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
}

// 淡入動畫初始化
function initAnimations() {
    try {
        const observerOptions = { 
            threshold: 0.1, 
            rootMargin: '0px 0px -50px 0px' 
        };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        document.querySelectorAll('.fade-in').forEach(el => { 
            observer.observe(el); 
        });
    } catch (error) {
        // Fallback: Make elements visible immediately
        document.querySelectorAll('.fade-in').forEach(el => { 
            el.classList.add('visible'); 
        });
    }
}

// 為撕開卡片添加觸控事件處理
function initTouchSupport() {
    const handleTouchStart = (e) => {
        const card = e.target.closest('.project-card.tear-card');
        if (card && !card.classList.contains('touch-active')) {
            card.classList.add('touch-active');
        }
    };
    
    const handleTouchEnd = (e) => {
        const card = e.target.closest('.project-card.tear-card');
        if (card) {
            setTimeout(() => {
                card.classList.remove('touch-active');
            }, 300);
        }
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("=== TingNotes Initialization Started ===");
    
    // 1. 載入主題
    loadTheme();
    console.log("Theme loaded");
    
    // 2. 初始化動畫
    initAnimations();
    console.log("Animations initialized");
    
    // 3. 初始化觸控支援
    initTouchSupport();
    console.log("Touch support initialized");
    
    // 4. 更新統計數據
    updateStatistics();
    console.log("Statistics update triggered");
    
    // 5. 根據當前頁面載入對應內容
    const pathParts = window.location.pathname.split('/').filter(p => p && p !== 'index.html');
    const currentTopic = pathParts.length === 0 ? 'home' : pathParts[0].toLowerCase();
    
    console.log(`Current page topic: ${currentTopic}`);

    if (currentTopic === 'home') {
        // 首頁：載入熱門專案
        const hotProjectsContainer = document.getElementById('hot-projects');
        if (hotProjectsContainer) {
            console.log("Loading hot projects for home page...");
            loadHotProjects('hot-projects', 3);
        }
    } else if (currentTopic === 'learning') {
        // 學習頁面：載入各分類
        console.log("Loading Learning page projects...");
        loadProjectsByCategory('learning', 'programming', 'programming-projects');
        // 如果有其他分類，繼續添加
        // loadProjectsByCategory('learning', 'finance', 'finance-projects');
        // loadProjectsByCategory('learning', 'language', 'language-projects');
    } else if (currentTopic === 'travel') {
        // 旅遊頁面：載入各分類
        console.log("Loading Travel page projects...");
        loadProjectsByCategory('travel', 'international', 'international-projects');
        loadProjectsByCategory('travel', 'domestic', 'domestic-projects');
        loadProjectsByCategory('travel', 'food', 'food-projects');
        loadProjectsByCategory('travel', 'culture', 'culture-projects');
    } else if (currentTopic === 'career') {
        // 職涯頁面：載入各分類
        console.log("Loading Career page projects...");
        loadProjectsByCategory('career', 'internship', 'internship-projects');
        loadProjectsByCategory('career', 'interview', 'interview-projects');
        loadProjectsByCategory('career', 'planning', 'planning-projects');
        loadProjectsByCategory('career', 'growth', 'growth-projects');
        // loadProjectsByCategory('career', 'skill', 'skill-projects');
    } else if (currentTopic === 'others') {
        // 雜事分享頁面：載入各分類
        console.log("Loading Others page projects...");
        loadProjectsByCategory('others', 'life', 'life-projects');
        loadProjectsByCategory('others', 'books', 'books-projects');
        // loadProjectsByCategory('others', 'tech', 'tech-projects');
    }

    console.log("=== TingNotes Initialization Complete ===");
});