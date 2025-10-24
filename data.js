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
        firebasePath: 'Learning/c-pointer-tutorial/totalViews',
        // 如果要啟用撕開效果，添加：
        // useTearEffect: true,
        // imageUrl: '/Learning/c-pointer-tutorial/cover.jpg'
    },
    'learning-programming-js-basics': {
        id: 'learning-programming-js-basics',
        topic: 'learning',
        category: 'programming', // 程式技術
        title: 'JavaScript 基礎入門',
        subtitle: '從變數、迴圈到函數，掌握前端核心',
        desc: '為初學者設計的 JavaScript 教程，涵蓋基本語法、DOM 操作與非同步概念。',
        status: 'progress',
        publishDate: '2025-11',
        estimatedTime: '6-10小時',
        difficulty: '初級',
        imageUrl: '/images/placeholder-learning.jpg',
        url: '/Learning/js-basics/',
        icon: '💡',
        firebasePath: 'Learning/learning-programming-js-basics/totalViews'
    },
    'learning-finance-index-investing': {
        id: 'learning-finance-index-investing',
        topic: 'learning',
        category: 'finance', // 投資理財
        title: '指數化投資策略',
        subtitle: '被動投資，穩健累積財富',
        desc: '介紹指數化投資的概念、優勢，以及如何選擇適合的 ETF 進行長期投資。',
        status: 'planned',
        publishDate: '2025-12',
        estimatedTime: '1小時',
        difficulty: '初級',
        imageUrl: '/images/placeholder-learning.jpg',
        url: '/Learning/index-investing/',
        icon: '📈',
        firebasePath: 'Learning/learning-finance-index-investing/totalViews'
    },
    'learning-photography-composition': {
        id: 'learning-photography-composition',
        topic: 'learning',
        category: 'photography', // 攝影藝術
        title: '攝影構圖基礎法則',
        subtitle: '拍出更有吸引力照片的秘訣',
        desc: '講解三分法、引導線、對稱、框架等經典攝影構圖技巧，提升照片美感。',
        status: 'planned',
        publishDate: '2026-01',
        estimatedTime: '2小時',
        difficulty: '初級',
        imageUrl: '/images/placeholder-learning.jpg',
        url: '/Learning/photo-composition/',
        icon: '📸',
        firebasePath: 'Learning/learning-photography-composition/totalViews'
    },
    'learning-others-effective-learning': {
        id: 'learning-others-effective-learning',
        topic: 'learning',
        category: 'others', // 其他主題 (學習方法)
        title: '高效學習心法',
        subtitle: '費曼技巧與間隔重複的應用',
        desc: '探討如何運用費曼技巧加深理解，以及利用間隔重複對抗遺忘曲線，提升學習效率。',
        status: 'planned',
        publishDate: '2026-02',
        estimatedTime: '1.5小時',
        difficulty: '通用',
        imageUrl: '/images/placeholder-learning.jpg',
        url: '/Learning/effective-learning/',
        icon: '🎯',
        firebasePath: 'Learning/learning-others-effective-learning/totalViews'
    },
    

    // ==================== 職涯區 ====================
    'software-engineer-interview': {
        id: 'software-engineer-interview',
        topic: 'career',
        category: 'growth', // intership / interview / planning / growth
        title: '軟體工程師面試準備指南',
        subtitle: '演算法、系統設計、行為問題全攻略',
        desc: '完整的軟體工程師面試準備計畫，涵蓋技術面試和行為面試的各個方面。',
        status: 'progress',
        publishDate: '2025-09',
        estimatedTime: '4週準備',
        difficulty: '中高級',
        url: '/Career/software-engineer-interview/',
        icon: '💼',
        firebasePath: 'Career/software-engineer-interview/totalViews',
        useTearEffect: true,  // 啟用撕開效果
        imageUrl: '/Career/software-engineer-interview/cover.jpg'
    },
    'career-internship-my-first-exp': {
        id: 'career-internship-my-first-exp',
        topic: 'career',
        category: 'internship', // 實習經驗
        title: '我的暑期軟體工程實習',
        subtitle: '在 ABC 科技的學習與挑戰',
        desc: '分享第一次在科技公司實習的經驗，包含專案內容、團隊合作與技術成長。',
        status: 'completed',
        publishDate: '2025-09',
        estimatedTime: '3個月',
        difficulty: '經驗分享',
        imageUrl: '/images/placeholder-career.jpg',
        url: '/Career/my-first-internship/',
        icon: '🎯',
        firebasePath: 'Career/career-internship-my-first-exp/totalViews'
    },
    'career-interview-behavioral-questions': {
        id: 'career-interview-behavioral-questions',
        topic: 'career',
        category: 'interview', // 面試準備
        title: '行為面試問題全攻略',
        subtitle: 'STAR 原則與常見問題應對',
        desc: '整理常見的行為面試問題 (Behavioral Questions)，並介紹如何使用 STAR 原則 структурировано 回答。',
        status: 'progress',
        publishDate: '2025-11',
        estimatedTime: '2小時',
        difficulty: '面試技巧',
        imageUrl: '/images/placeholder-career.jpg',
        url: '/Career/behavioral-interview/',
        icon: '💼',
        firebasePath: 'Career/career-interview-behavioral-questions/totalViews'
    },
    'career-planning-five-year-plan': {
        id: 'career-planning-five-year-plan',
        topic: 'career',
        category: 'planning', // 職涯規劃
        title: '制定我的五年職涯計畫',
        subtitle: '設定目標、盤點技能與預期發展',
        desc: '分享如何設定短期與長期的職涯目標，評估自身優劣勢，並規劃學習與發展路徑。',
        status: 'planned',
        publishDate: '2026-03',
        estimatedTime: ' N/A',
        difficulty: '個人規劃',
        imageUrl: '/images/placeholder-career.jpg',
        url: '/Career/five-year-plan/',
        icon: '🚀',
        firebasePath: 'Career/career-planning-five-year-plan/totalViews'
    },
    'career-growth-imposter-syndrome': {
        id: 'career-growth-imposter-syndrome',
        topic: 'career',
        category: 'growth', // 成長心得
        title: '克服冒牌者症候群',
        subtitle: '從自我懷疑到建立自信的心路歷程',
        desc: '探討冒牌者症候群的成因與影響，並分享個人在職涯早期如何面對與調適的心得。',
        status: 'planned',
        publishDate: '2026-04',
        estimatedTime: ' N/A',
        difficulty: '心態調整',
        imageUrl: '/images/placeholder-career.jpg',
        url: '/Career/imposter-syndrome/',
        icon: '📈',
        firebasePath: 'Career/career-growth-imposter-syndrome/totalViews',
        
    },

    // ==================== 旅遊區 ====================
    'seoul-bp-concert-2025': {
        id: 'seoul-bp-concert-2025',
        topic: 'travel',
        category: 'international',
        title: '2025 夏 • 首爾 BLACKPINK 演唱會追星之旅',
        subtitle: '六天五夜自由行：演唱會、景點、美食全紀錄',
        desc: '記錄 2025 年暑假前往韓國首爾參加 BLACKPINK 演唱會的六天五夜自由行行程、景點與心得。',
        status: 'progress',
        publishDate: '2025-10',
        estimatedTime: '6天5夜',
        difficulty: '自由行',
        url: '/Travel/seoul-bp-concert-2025/',
        icon: '🎤',
        firebasePath: 'Travel/seoul-bp-concert-2025/totalViews',
        useTearEffect: true,  // 啟用撕開效果
        imageUrl: '/Travel/seoul-bp-concert-2025/image.jpg'
    },
    'travel-domestic-hualien-taroko': {
        id: 'travel-domestic-hualien-taroko',
        topic: 'travel',
        category: 'domestic', // 國內旅遊
        title: '花蓮太魯閣峽谷之旅',
        subtitle: '壯麗山水與步道健行體驗',
        desc: '記錄前往花蓮太魯閣國家公園的行程，包含燕子口、九曲洞、白楊步道等景點分享。',
        status: 'completed',
        publishDate: '2025-07',
        estimatedTime: '3天2夜',
        difficulty: '自然景觀',
        imageUrl: '/images/placeholder-travel.jpg',
        url: '/Travel/hualien-taroko/',
        icon: '🏞️',
        firebasePath: 'Travel/travel-domestic-hualien-taroko/totalViews'
    },
    'seoul-bp-concert-2025': { // <-- 你已有的韓國行
        id: 'seoul-bp-concert-2025',
        topic: 'travel',
        category: 'international', // 國外旅遊
        title: '2025 夏 • 首爾 BLACKPINK 演唱會追星之旅',
        subtitle: '六天五夜自由行：演唱會、景點、美食全紀錄',
        desc: '記錄 2025 年暑假前往韓國首爾參加 BLACKPINK 演唱會的六天五夜自由行行程、景點與心得。',
        status: 'completed',
        publishDate: '2025-10',
        estimatedTime: '6天5夜',
        difficulty: '自由行',
        imageUrl: '/images/korea_concert_image.jpg', // <-- 使用你指定的圖片
        url: '/Travel/seoul-bp-concert-2025/',
        icon: '🎤',
        firebasePath: 'Travel/seoul-bp-concert-2025/totalViews'
    },
    'travel-food-tainan-snacks': {
        id: 'travel-food-tainan-snacks',
        topic: 'travel',
        category: 'food', // 美食探索
        title: '台南小吃美食地圖',
        subtitle: '在地人推薦的必吃清單',
        desc: '整理台南必吃的牛肉湯、碗粿、蝦捲、鱔魚意麵等地道小吃店家與品嚐心得。',
        status: 'progress',
        publishDate: '2025-11',
        estimatedTime: ' N/A',
        difficulty: '美食推薦',
        imageUrl: '/images/placeholder-travel.jpg',
        url: '/Travel/tainan-food-map/',
        icon: '🍜',
        firebasePath: 'Travel/travel-food-tainan-snacks/totalViews'
    },
    'travel-culture-kyoto-temples': {
        id: 'travel-culture-kyoto-temples',
        topic: 'travel',
        category: 'culture', // 文化體驗
        title: '京都古寺巡禮',
        subtitle: '漫步清水寺、金閣寺與伏見稻荷',
        desc: '分享在日本京都參訪著名寺廟神社的經歷，感受古都的歷史氛圍與建築之美。',
        status: 'planned',
        publishDate: '2026-05',
        estimatedTime: '5天4夜',
        difficulty: '歷史文化',
        imageUrl: '/images/placeholder-travel.jpg',
        url: '/Travel/kyoto-temples/',
        icon: '🎭',
        firebasePath: 'Travel/travel-culture-kyoto-temples/totalViews'
    },
    

    // ==================== 雜事分享區 ====================
    'others-life-minimalism-practice': {
        id: 'others-life-minimalism-practice',
        topic: 'others',
        category: 'life', // 生活感悟
        title: '我的極簡生活實踐',
        subtitle: '減少物品，專注於重要的人事物',
        desc: '分享開始實踐極簡主義的契機、過程中的挑戰以及對生活的改變與體悟。',
        status: 'progress',
        publishDate: '2025-10',
        estimatedTime: ' N/A',
        difficulty: '生活哲學',
        imageUrl: '/images/placeholder-others.jpg',
        url: '/Others/minimalism-practice/',
        icon: '🌟',
        firebasePath: 'Others/others-life-minimalism-practice/totalViews'
    },
    'others-books-atomic-habits': {
        id: 'others-books-atomic-habits',
        topic: 'others',
        category: 'books', // 讀書筆記
        title: '《原子習慣》讀後感',
        subtitle: '微小改變帶來巨大成就的力量',
        desc: '分享閱讀《原子習慣》的心得筆記，探討如何建立好習慣、戒除壞習慣的實用方法。',
        status: 'completed',
        publishDate: '2025-09',
        estimatedTime: '30分鐘',
        difficulty: '書籍分享',
        imageUrl: '/images/placeholder-others.jpg',
        url: '/Others/atomic-habits-review/',
        icon: '📚',
        firebasePath: 'Others/others-books-atomic-habits/totalViews'
    },
    'others-current-ai-impact': {
        id: 'others-current-ai-impact',
        topic: 'others',
        category: 'current', // 時事觀察
        title: 'AI 對未來工作的影響',
        subtitle: '是威脅還是機會？我的觀察與思考',
        desc: '探討近期人工智慧發展的趨勢，分析其可能對不同行業及個人職涯帶來的衝擊與轉機。',
        status: 'planned',
        publishDate: '2026-06',
        estimatedTime: ' N/A',
        difficulty: '趨勢分析',
        imageUrl: '/images/placeholder-others.jpg',
        url: '/Others/ai-work-impact/',
        icon: '🌐',
        firebasePath: 'Others/others-current-ai-impact/totalViews'
    },
    'others-reflection-time-management': {
        id: 'others-reflection-time-management',
        topic: 'others',
        category: 'reflection', // 個人反思
        title: '關於時間管理的掙扎與反思',
        subtitle: '從拖延到嘗試建立系統的過程',
        desc: '記錄個人在時間管理上面臨的困難，嘗試過的方法，以及對效率與生活平衡的反思。',
        status: 'planned',
        publishDate: '2026-07',
        estimatedTime: ' N/A',
        difficulty: '自我成長',
        imageUrl: '/images/placeholder-others.jpg',
        url: '/Others/time-management-reflection/',
        icon: '🪞',
        firebasePath: 'Others/others-reflection-time-management/totalViews'
    }

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