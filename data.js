// data.js

const allProjectsData = {
    // --- 學習區 ---
    'c-pointer-tutorial': {
        id: 'c-pointer-tutorial', // Unique ID
        topic: 'learning',          // Main topic folder
        category: 'programming',    // Sub-category within the topic
        title: 'C語言指標完整教學',
        subtitle: '從基礎到進階，完整掌握指標精髓',
        desc: '從基礎概念到進階應用，完整掌握C語言指標的精髓。包含記憶體管理、函式指標、動態配置等核心主題。', // Description for cards/lists
        status: 'completed',      // 'completed', 'progress', 'planned'
        chapters: 18,             // Optional: Number of chapters
        publishDate: '2025-08',    // Publication date (YYYY-MM)
        estimatedTime: '8-12小時', // Optional: Estimated time
        difficulty: '初級-進階',    // Optional: Difficulty level
        url: '/Learning/c-pointer-tutorial/', // URL relative to root
        icon: '🔗',                // Emoji icon
        firebasePath: 'Learning/c-pointer-tutorial/totalViews' // Firebase path for view count
    },
    // --- 旅遊區 ---
    'seoul-bp-concert-2025': {
        id: 'seoul-bp-concert-2025',
        topic: 'travel',
        category: 'international',
        title: '2025 夏 • 首爾 BLACKPINK 演唱會追星之旅',
        subtitle: '六天五夜自由行：演唱會、景點、美食全紀錄',
        desc: '記錄 2025 年暑假前往韓國首爾參加 BLACKPINK 演唱會的六天五夜自由行行程、景點與心得。',
        status: 'completed',
        publishDate: '2025-10',
        estimatedTime: '6天5夜',
        difficulty: '自由行',
        url: '/Travel/seoul-bp-concert-2025/', // URL relative to root
        icon: '🎤',
        firebasePath: 'Travel/seoul-bp-concert-2025/totalViews' // Firebase path for view count
    }
    // --- 未來新增專案 ---
    // 'your-next-project-id': {
    //     id: 'your-next-project-id',
    //     topic: 'career', // or learning, travel, others
    //     category: 'interview', // Sub-category
    //     title: '專案標題',
    //     subtitle: '專案副標題',
    //     desc: '專案的簡短描述...',
    //     status: 'progress',
    //     publishDate: 'YYYY-MM',
    //     // ... other fields ...
    //     url: '/Career/your-next-project/',
    //     icon: '💼',
    //     firebasePath: 'Career/your-next-project/totalViews'
    // }
};

// --- 請再次確認檔案結尾【一定】有這一行，且沒有被註解掉 ---
export { allProjectsData };