// data.js - 所有專案資料

// 若各主題要新增分類(category)，可去script.js，ctrl+F ，else if (currentTopic === 'learning') {

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
    },

    // ==================== 投資區 ====================
    'etf-guide': {
        id: 'etf-guide',
        topic: 'investment',
        category: 'finance',
        title: 'ETF 定期定額入門指南',
        subtitle: '從零理解 ETF、複利計算與 0050 / VOO / QQQ 比較',
        desc: '什麼是 ETF？定期定額怎麼運作？複利公式怎麼算？含實際案例與三大 ETF 比較表，附報酬計算器連結。',
        status: 'completed',
        publishDate: '2026-04',
        estimatedTime: '10 分鐘',
        difficulty: '入門',
        url: '/Investment/etf-guide/',
        icon: '📚',
    },

    // ==================== 雜事分享區 ====================
    'etf-calculator': {
        id: 'etf-calculator',
        topic: 'others',
        category: 'finance',
        title: 'DCA 定期定額計算器',
        subtitle: '3 個數字，30 秒算出你的投資未來',
        desc: '最簡單的定期定額計算工具。輸入每月金額、年數與報酬率，即時看到資產成長曲線與複利效果。附教學說明與 ETF 報酬率參考。',
        status: 'completed',
        publishDate: '2026-04',
        estimatedTime: '2 分鐘',
        difficulty: '工具',
        url: '/Others/etf-calculator/',
        icon: '💰',
    },

    // ==================== 雜事分享區（續） ====================
    'j1-visa-taiwan': {
        id: 'j1-visa-taiwan',
        topic: 'others',
        category: 'life',
        title: '在台灣申請 J-1 簽證完整流程',
        subtitle: '赴美交換必看：DS-2019、SEVIS、DS-160 到 AIT 面談',
        desc: '整理在台灣申請 J-1 交換學生簽證的完整步驟，從收到 DS-2019 到 AIT 面談一次說清楚，附官方連結與截圖。',
        status: 'completed',
        publishDate: '2026-04',
        estimatedTime: '10 分鐘',
        difficulty: '攻略',
        url: '/Others/j1-visa-taiwan/',
        icon: '🇺🇸',
    },

    // ==================== 旅遊區 ====================
    'korea-travel-apps': {
        id: 'korea-travel-apps',
        topic: 'travel',
        category: 'international',
        title: '韓國旅遊必備 App 清單',
        subtitle: '從導航到寄物，9 款讓旅程更順暢的 App',
        desc: '整理韓國自由行必裝的 9 款 App，包含導航、地鐵、翻譯、機場通關、外送、行李寄放等，出發前裝好省時省力。',
        status: 'completed',
        publishDate: '2026-04',
        estimatedTime: '5 分鐘',
        difficulty: '攻略',
        url: '/Travel/korea-travel-apps/',
        icon: '📱',
    },

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
        useTearEffect: true,
        imageUrl: '/Travel/seoul-bp-concert-2025/image.jpg'
    },

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
