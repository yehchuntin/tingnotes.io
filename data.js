// data.js - 所有專案資料

const allProjectsData = {
    // ==================== 學習區 ====================
    'c-pointer-tutorial': {
        id: 'c-pointer-tutorial',
        topic: 'learning',
        category: 'programming',
        title: 'C語言指標完整教學',
        subtitle: '從基礎到進階，完整掌握指標精髓',
        desc: '從基礎概念到進階應用，完整掌握C語言指標的精髓。包含記憶體管理、函式指標、動態配置等核心主題。',
        status: 'completed',
        chapters: 18,
        publishDate: '2025-08',
        estimatedTime: '8-12小時',
        difficulty: '初級-進階',
        url: '/Learning/c-pointer-tutorial/',
        icon: '🔗',
        firebasePath: 'Learning/c-pointer-tutorial/totalViews',
        // 如果要啟用撕開效果，添加：
        // useTearEffect: true,
        // imageUrl: '/Learning/c-pointer-tutorial/cover.jpg'
    },
    

    // ==================== 職涯區 ====================
    // 'software-engineer-interview': {
    //     id: 'software-engineer-interview',
    //     topic: 'career',
    //     category: 'interview',
    //     title: '軟體工程師面試準備指南',
    //     subtitle: '演算法、系統設計、行為問題全攻略',
    //     desc: '完整的軟體工程師面試準備計畫，涵蓋技術面試和行為面試的各個方面。',
    //     status: 'completed',
    //     publishDate: '2025-09',
    //     estimatedTime: '4週準備',
    //     difficulty: '中高級',
    //     url: '/Career/software-engineer-interview/',
    //     icon: '💼',
    //     firebasePath: 'Career/software-engineer-interview/totalViews',
    //     useTearEffect: true,  // 啟用撕開效果
    //     imageUrl: '/Career/software-engineer-interview/cover.jpg'
    // }

    // ==================== 旅遊區 ====================
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
        url: '/Travel/seoul-bp-concert-2025/',
        icon: '🎤',
        firebasePath: 'Travel/seoul-bp-concert-2025/totalViews',
        useTearEffect: true,  // 啟用撕開效果
        imageUrl: '/Travel/seoul-bp-concert-2025/image.jpg'
    },
    

    // ==================== 雜事分享區 ====================
    // 'book-review-atomic-habits': {
    //     id: 'book-review-atomic-habits',
    //     topic: 'others',
    //     category: 'books',
    //     title: '《原子習慣》讀書心得',
    //     subtitle: '微小改變如何帶來巨大成就',
    //     desc: '分享閱讀《原子習慣》的心得，以及如何應用書中的概念改善日常生活。',
    //     status: 'completed',
    //     publishDate: '2025-08',
    //     estimatedTime: '15分鐘閱讀',
    //     difficulty: '生活分享',
    //     url: '/Others/book-review-atomic-habits/',
    //     icon: '📚',
    //     firebasePath: 'Others/book-review-atomic-habits/totalViews',
    //     useTearEffect: true,  // 啟用撕開效果
    //     imageUrl: '/Others/book-review-atomic-habits/cover.jpg'
    // }

    // ==================== 新增專案模板 ====================
    // 複製以下模板來新增專案：
    /*
    'your-project-id': {
        id: 'your-project-id',           // 唯一ID，使用小寫和連字號
        topic: 'learning',                // 主題：learning, career, travel, others
        category: 'programming',          // 分類：依照各主題的分類
        title: '專案標題',
        subtitle: '專案副標題',
        desc: '專案簡短描述，顯示在卡片上',
        status: 'completed',              // completed, progress, planned
        publishDate: '2025-10',           // 發布日期 YYYY-MM
        estimatedTime: '預估時間',
        difficulty: '難度或類型',
        url: '/Topic/project-folder/',    // 專案頁面路徑
        icon: '🔥',                       // Emoji 圖示
        firebasePath: 'Topic/project-id/totalViews',  // Firebase 路徑
        useTearEffect: true,              // 是否啟用撕開效果（選填，預設 false）
        imageUrl: '/Topic/project-folder/cover.jpg'   // 封面圖片（使用撕開效果時必填）
    },
    */
};

// ==================== 匯出資料 ====================
export { allProjectsData };