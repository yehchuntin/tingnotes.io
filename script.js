// script.js - Common JavaScript functions for TingNotes

// --- Firebase SDK Import ---
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, get, runTransaction } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// --- 匯入專案資料 ---
import { allProjectsData } from './data.js'; // <-- 確認 import 語句在這裡

// --- Firebase Configuration & Initialization ---
const firebaseConfig = {
    apiKey: "AIzaSyAbEhPO8lUDT4nCPmfw1fZg3t2eGO6JUaI", // Keep your actual API key
    authDomain: "tingnotes-ccb46.firebaseapp.com",
    databaseURL: "https://tingnotes-ccb46-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tingnotes-ccb46",
    storageBucket: "tingnotes-ccb46.appspot.com", // Corrected storageBucket name
    messagingSenderId: "297732922233",
    appId: "1:297732922233:web:aab5a5d20ab2006a736da8",
    measurementId: "G-NG8BMXM21R"
};

let database; // Declare database variable
try {
    const app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log("Firebase Initialized successfully in script.js");
} catch (error) {
    console.error("Firebase Initialization Failed:", error);
    // Handle initialization error, maybe show a message to the user
    database = null; // Ensure database is null if init fails
}


// --- Theme Switching ---
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon'); // Assumes icon ID is consistent
    if (!themeIcon) return; // Exit if icon not found

    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        // Moon icon SVG path
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        // Sun icon SVG path and circle
        themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>';
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon'); // Assumes icon ID is consistent

    body.setAttribute('data-theme', savedTheme);
    if (themeIcon) {
        if (savedTheme === 'dark') {
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>';
        } else {
            themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
    }
}
// Make theme functions globally accessible
window.toggleTheme = toggleTheme;

// --- Firebase Interaction Functions ---
async function getViewCount(projectId, topic) {
    if (!database) { // Check if database initialized
        console.warn("Firebase database is not initialized. Cannot get view count.");
        return 0;
    }
    const path = `${capitalizeFirstLetter(topic)}/${projectId}/totalViews`;
    try {
        const snapshot = await get(ref(database, path));
        return snapshot.exists() ? snapshot.val() : 0;
    } catch (error) {
        console.error(`Failed to get view count for ${path}:`, error);
        return 0; // Return 0 on error
    }
}

async function incrementViewCount(projectId, topic) {
    if (!database) { // Check if database initialized
        console.warn("Firebase database is not initialized. Cannot increment view count.");
        return;
    }
    const path = `${capitalizeFirstLetter(topic)}/${projectId}/totalViews`;
    try {
        const counterRef = ref(database, path);
        // Use { merge: true } if path might not exist yet (optional, transaction usually handles this)
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
    if (num === null || typeof num === 'undefined') return '0'; // Handle null/undefined
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// --- Content Loading Functions (Example for Project Cards) ---

// Generic function to generate project card HTML
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

// Function to load projects for a specific topic and category into a container
async function loadProjectsByCategory(topic, category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

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

    let html = '';
    for (const project of categoryProjects) {
        try {
            const views = await getViewCount(project.id, project.topic);
            html += generateProjectCardHTML(project.id, project, views);
        } catch (error) {
            console.error(`Error loading card for project ${project.id}:`, error);
        }
    }

    container.innerHTML = html;
}

// Function to load the top N hot projects (all topics)
async function loadHotProjects(containerId, count = 3) {
    console.log("Attempting to load hot projects into:", containerId); // Log start
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
    console.log("allProjectsData available for hot projects."); // Log data available

    try {
        const projectsWithViews = await Promise.all(
            Object.entries(allProjectsData).map(async ([id, project]) => {
                const views = await getViewCount(id, project.topic);
                // console.log(`Fetched views for ${id}: ${views}`); // Log views per project
                return { id, ...project, views };
            })
        );
        console.log("Fetched views for all projects:", projectsWithViews); // Log fetched views

        const sortedProjects = projectsWithViews
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, count);
        console.log("Sorted top projects:", sortedProjects); // Log sorted projects


        if (sortedProjects.length === 0) {
            console.log("No hot projects found, showing empty state."); // Log empty state
            container.innerHTML = `
                <div class="empty-state" style="min-height: 150px; padding: 20px;">
                    <div class="empty-icon">🚀</div>
                    <div class="empty-title">尚無熱門專案</div>
                    <div class="empty-desc">開始創作更多內容吧！</div>
                </div>`;
            return;
        }

        // Generate HTML using the specific hot projects item structure
        const projectsHTML = sortedProjects.map((project, index) => {
            let rankIcon;
            let rankClass = `rank-${index + 1}`;
            switch(index + 1) {
                case 1: rankIcon = '🥇'; break;
                case 2: rankIcon = '🥈'; break;
                case 3: rankIcon = '🥉'; break;
                default: rankIcon = (index + 1).toString(); rankClass = ''; break;
            }
            // Use project.desc first, fallback to subtitle
            const description = project.desc || project.subtitle || '';
            const topicName = project.topic ? capitalizeFirstLetter(project.topic) : 'Unknown'; // Get topic name

             return `
                <a href="${project.url}" class="project-item" onclick="event.preventDefault(); handleProjectClick('${project.id}', '${project.topic}')">
                     <div class="project-rank ${rankClass}">${rankIcon}</div>
                     <div class="project-info">
                         <div class="project-name">${project.title || 'Untitled Project'}</div>
                         <div class="project-desc">${description}</div>
                          <div class="project-meta">
                              <span class="category-badge ${project.topic}">${topicName}</span>
                              ${project.publishDate ? `<span>📅 ${project.publishDate}</span>` : ''}
                              <span class="status-badge ${project.status === 'completed' ? 'status-completed' : project.status === 'progress' ? 'status-progress' : 'status-planned'}">
                                  ${project.status === 'completed' ? '已完成' : project.status === 'progress' ? '進行中' : '規劃中'}
                              </span>
                          </div>
                     </div>
                     <div class="project-stats">
                         <div class="project-views">${formatNumber(project.views)} 次觀看</div>
                         ${project.difficulty ? `<div class="project-status">${project.difficulty}</div>` : ''}
                     </div>
                </a>
            `;
        }).join('');

        // console.log("Generated Hot Projects HTML:", projectsHTML); // Log generated HTML
        container.innerHTML = projectsHTML;
        console.log("Hot projects HTML inserted."); // Log insertion

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

// Click handler for project cards/items
window.handleProjectClick = async function(projectId, topic) {
     if (typeof allProjectsData === 'undefined') {
         console.error("Cannot handle click: allProjectsData is not defined.");
         return;
     }
    const project = allProjectsData[projectId];
    if (project && project.url) {
        try {
            await incrementViewCount(projectId, topic);
            // Ensure URL starts with / for root-relative links
            const finalUrl = project.url.startsWith('/') ? project.url : `/${project.url}`;
            window.location.href = finalUrl;
        } catch (error) {
            console.error("Error during project click handling:", error);
            const finalUrl = project.url.startsWith('/') ? project.url : `/${project.url}`;
             window.location.href = finalUrl; // Still navigate
        }
    } else {
        console.error(`Project data or URL not found for ID: ${projectId}`);
    }
};

// Toggle for sub-menus in TOC (Table of Contents)
window.toggleSubMenu = function(element) {
    if (event) event.preventDefault();
    const arrow = element.querySelector('.arrow');
    const subMenu = element.parentElement.querySelector('.sub-menu');
    if (subMenu && arrow) {
        arrow.classList.toggle('expanded');
        subMenu.classList.toggle('show');
    }
};

// Copy code button handler
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
        console.error('自動複製失敗:', err);
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
            console.error('Fallback copy method failed:', fallbackErr);
            button.textContent = '複製失敗';
             setTimeout(() => { button.textContent = '📋 複製'; }, 2000);
        }
    });
};

// Mobile menu toggle
window.toggleMobileMenu = function() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if(navLinks && mobileMenuBtn) {
        navLinks.classList.toggle('mobile-active');
        mobileMenuBtn.classList.toggle('active');
    }
};

// Switch tabs for category selectors
window.switchTab = function(category) {
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

// Function to initialize fade-in animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully entering viewport
    };

    const observer = new IntersectionObserver((entries, observer) => { // Added observer parameter
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Initializing..."); // Log DOM ready
    loadTheme(); // Load theme preference on every page load
    initAnimations(); // Initialize fade-in animations

    // Add specific initializations based on the page if needed
    // Example: Load hot projects only on the main index page
    const hotProjectsContainer = document.getElementById('hot-projects');
    if (hotProjectsContainer) {
        console.log("Found hot-projects container, loading hot projects...");
        loadHotProjects('hot-projects', 3);
    } else {
        console.log("No hot-projects container found on this page.");
    }

    // Example: Load projects for topic pages (like Learning, Travel)
    const learningContainer = document.getElementById('programming-projects');
    if (learningContainer) {
        console.log("Found programming-projects container, loading learning projects...");
        loadProjectsByCategory('learning', 'programming', 'programming-projects');
    }

    const travelContainer = document.getElementById('international-projects');
    if (travelContainer) {
        console.log("Found international-projects container, loading travel projects...");
        loadProjectsByCategory('travel', 'international', 'international-projects');
    }

    // Add similar checks for Career and Others pages if they have project containers
    const careerContainer = document.getElementById('internship-projects'); // Example ID
    if (careerContainer) {
        console.log("Found internship-projects container, loading career projects...");
        loadProjectsByCategory('career', 'internship', 'internship-projects'); // Adjust category/ID
    }

    const othersContainer = document.getElementById('life-projects'); // Example ID
    if (othersContainer) {
        console.log("Found life-projects container, loading others projects...");
        loadProjectsByCategory('others', 'life', 'life-projects'); // Adjust category/ID
    }

    console.log("Initialization complete."); // Log end of initialization
});