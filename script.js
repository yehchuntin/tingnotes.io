// script.js - Common JavaScript functions for TingNotes

// --- Firebase SDK Import ---
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, get, runTransaction } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// --- 匯入專案資料 ---
import { allProjectsData } from './data.js'; // <-- 確認 import 語句在這裡

// --- Firebase Configuration & Initialization ---
const firebaseConfig = {
    apiKey: "AIzaSyAbEhPO8lUDT4nCPmfw1fZg3t2eGO6JUaI", // 請保留你的 API Key
    authDomain: "tingnotes-ccb46.firebaseapp.com",
    databaseURL: "https://tingnotes-ccb46-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tingnotes-ccb46",
    storageBucket: "tingnotes-ccb46.appspot.com", // 確認 storageBucket 名稱
    messagingSenderId: "297732922233",
    appId: "1:297732922233:web:aab5a5d20ab2006a736da8",
    measurementId: "G-NG8BMXM21R"
};

let database; // 宣告 database 變數
try {
    const app = initializeApp(firebaseConfig);
    database = getDatabase(app);
} catch (error) {
    console.error("Firebase Initialization Failed:", error);
    database = null; // 初始化失敗時設為 null
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
window.toggleTheme = toggleTheme; // 讓 HTML onclick 可以呼叫

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
         // 嘗試顯示錯誤訊息給用戶或停止執行
         const totalViewsElement = document.getElementById('total-views');
         if (totalViewsElement) totalViewsElement.textContent = '錯誤';
         return;
    }

    // 1. 識別當前頁面的主題
    const pathParts = window.location.pathname.split('/').filter(p => p && p !== 'index.html'); // 過濾空字串和 index.html
    const currentTopic = pathParts.length === 0 ? 'home' : pathParts[0].toLowerCase();

    // 如果不在特定主題頁面 (在首頁)，則不更新特定主題的統計數據
    if (currentTopic === 'home') {
        console.log("On home page, skipping topic-specific statistics update.");
        return; // 首頁不需要計算特定主題的總觀看次數和內容數
    }

    // 2. 篩選出屬於當前主題的專案
    const topicProjects = Object.entries(allProjectsData)
        .filter(([id, project]) => project.topic === currentTopic)
        .map(([id, project]) => ({ id, ...project }));

    console.log(`Found ${topicProjects.length} projects for topic: ${currentTopic}`);

    // 3. 更新內容總數 (根據主題決定 ID)
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
            // 計算實際內容數量 (例如已完成的，或所有項目) - 這裡計算所有項目
            totalContentElement.textContent = topicProjects.length;
            console.log(`Updated ${totalContentElementId} count to: ${topicProjects.length}`);
        } else {
             console.log(`Could not find element with ID: ${totalContentElementId}`);
        }
    }


    // 4. 計算當前主題的總觀看次數
    let topicTotalViews = 0;
    if (topicProjects.length > 0) {
         console.log("Calculating total views for topic:", currentTopic);
        try {
            // 使用 Promise.all 等待所有 getViewCount 完成
            const viewCountsPromises = topicProjects.map(project => getViewCount(project.id, project.topic));
            const viewCounts = await Promise.all(viewCountsPromises);

            topicTotalViews = viewCounts.reduce((sum, count) => sum + (count || 0), 0);
            console.log(`Total views calculated for topic ${currentTopic}: ${topicTotalViews}`);
        } catch (error) {
            console.error(`Error calculating total views for topic ${currentTopic}:`, error);
            topicTotalViews = 0; // 出錯時設為 0
        }
    } else {
         console.log(`No projects found for topic ${currentTopic}, total views set to 0.`);
         topicTotalViews = 0;
    }


    // 5. 更新總觀看次數顯示
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

    // 6. 更新最後更新時間
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

// 產生卡片 HTML (通用)
function generateProjectCardHTML(projectId, project, views) {
    if (!project) return '';
    const statusClass = project.status === 'completed' ? 'status-completed' :
                       project.status === 'progress' ? 'status-progress' : 'status-planned';
    const statusText = project.status === 'completed' ? '已完成' :
                      project.status === 'progress' ? '進行中' : '規劃中';
    return `
        <div class="project-card" data-topic="${project.topic}" onclick="handleProjectClick('${projectId}', '${project.topic}')">
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
    if (!container) return; // 如果容器不存在，直接返回

    if (typeof allProjectsData === 'undefined') {
         console.error(`allProjectsData is not defined when loading ${topic}/${category}.`);
         container.innerHTML = '<p style="color: red;">Error: Project data not available.</p>';
         return;
    }

    const categoryProjects = Object.entries(allProjectsData)
        .filter(([id, project]) => project.topic === topic && project.category === category)
        .map(([id, project]) => ({ id, ...project }));

    if (categoryProjects.length === 0) {
        // 如果此分類沒有專案，檢查容器內是否已有 .empty-state
        // 如果沒有，則清空容器 (移除 loading...)
        if (!container.querySelector('.empty-state')) {
            container.innerHTML = '';
        }
        return; // 沒有專案就不用繼續了
    }

    // 如果容器內有 .empty-state，先移除它
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    // 獲取觀看次數並生成 HTML
    let html = '';
    try {
        const viewsPromises = categoryProjects.map(project => getViewCount(project.id, project.topic));
        const viewsArray = await Promise.all(viewsPromises);

        categoryProjects.forEach((project, index) => {
            html += generateProjectCardHTML(project.id, project, viewsArray[index]);
        });

        container.innerHTML = html; // 填入生成的卡片
    } catch (error) {
         console.error(`Error loading projects for ${topic}/${category}:`, error);
         container.innerHTML = '<p style="color: red;">載入專案時發生錯誤。</p>'; // 顯示錯誤訊息
    }
}


// 載入熱門專案 (首頁用)
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
                return { id, ...project, views: views || 0 }; // 確保 views 是數字
            })
        );
        console.log("Fetched views for all projects:", projectsWithViews);

        const sortedProjects = projectsWithViews
            .sort((a, b) => b.views - a.views) // 按觀看次數排序
            .slice(0, count); // 取前 count 個
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

        // 生成熱門專案列表 HTML
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


// --- Event Handlers ---

// 點擊卡片/項目
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
        button.textContent = '✅ 已複製'; button.classList.add('copied'); button.disabled = true;
        setTimeout(() => { button.textContent = originalText; button.classList.remove('copied'); button.disabled = false; }, 2000);
    }).catch(err => {
        try { // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = codeText;
            textArea.style.position = 'fixed'; textArea.style.top = "0"; textArea.style.left = "0"; textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus(); textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            const originalText = button.textContent;
            button.textContent = '✅ 已複製 (Fallback)'; button.classList.add('copied'); button.disabled = true;
            setTimeout(() => { button.textContent = originalText; button.classList.remove('copied'); button.disabled = false; }, 2000);
        } catch (fallbackErr) {
            button.textContent = '複製失敗';
             setTimeout(() => { button.textContent = '📋 複製'; }, 2000);
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
    // 確保 event.currentTarget 存在
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
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        document.querySelectorAll('.fade-in').forEach(el => { observer.observe(el); });
    } catch (error) {
        // Fallback: Make elements visible immediately if Intersection Observer fails
        document.querySelectorAll('.fade-in').forEach(el => { el.classList.add('visible'); });
    }
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadTheme(); // 優先載入主題
    initAnimations(); // 初始化淡入動畫

    // 更新統計數據 (會根據目前頁面主題計算)
    updateStatistics(); // *** 重要：確保這個函式被呼叫 ***

    // 根據當前頁面主題，載入對應分類的卡片
    const pathParts = window.location.pathname.split('/').filter(p => p && p !== 'index.html');
    const currentTopic = pathParts.length === 0 ? 'home' : pathParts[0].toLowerCase();

    if (currentTopic === 'home') {
        const hotProjectsContainer = document.getElementById('hot-projects');
        if (hotProjectsContainer) {
            console.log("Loading hot projects for home page...");
            loadHotProjects('hot-projects', 3);
        }
    } else if (currentTopic === 'learning') {
        // 為 Learning 頁面載入 programming 分類
        loadProjectsByCategory('learning', 'programming', 'programming-projects');
        // loadProjectsByCategory('learning', 'finance', 'finance-projects'); // Example
    } else if (currentTopic === 'travel') {
        // 為 Travel 頁面載入 international 分類
        loadProjectsByCategory('travel', 'international', 'international-projects');
        // loadProjectsByCategory('travel', 'domestic', 'domestic-projects'); // Example
    } else if (currentTopic === 'career') {
        // 為 Career 頁面載入 (假設有 'internship' 分類)
        loadProjectsByCategory('career', 'internship', 'internship-projects'); // Adjust ID/category
        // loadProjectsByCategory('career', 'interview', 'interview-projects');
    } else if (currentTopic === 'others') {
        // 為 Others 頁面載入 (假設有 'life' 分類)
        loadProjectsByCategory('others', 'life', 'life-projects'); // Adjust ID/category
        // loadProjectsByCategory('others', 'books', 'books-projects');
    }

    console.log("Initialization complete.");
});