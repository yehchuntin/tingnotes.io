// ====== 計算機與費用矩陣連動邏輯 ======
let calcState = { base: 50, surcharge: 15, penalty: 60, size: 'S' };
const feeData = {
    'S': { base: 50, extra: 15, penalty: 60, maxPenalty: 840, label: 'S 輕便件 (<60cm)' },
    'M': { base: 100, extra: 25, penalty: 100, maxPenalty: 1400, label: 'M 一般件 (60-90cm)' },
    'L': { base: 200, extra: 40, penalty: 150, maxPenalty: 2100, label: 'L 大型件 (90-150cm)' },
    'XL': { base: 300, extra: 55, penalty: 200, maxPenalty: 2800, label: 'XL 超大件 (>150cm)' }
};

window.calcSetSize = function(size, base, surcharge, penalty) {
    calcState = { base, surcharge, penalty, size };
    document.querySelectorAll('.calc-size-btn').forEach(btn => {
        if (btn.dataset.size === size) {
            btn.className = 'calc-size-btn border-2 border-brand-500 bg-brand-50 text-brand-700 rounded-2xl p-4 text-center font-black transition-all';
            btn.querySelector('.text-xs').classList.remove('text-slate-400');
            btn.querySelector('.text-2xl').classList.remove('text-slate-700');
        } else {
            btn.className = 'calc-size-btn border-2 border-slate-100 bg-white rounded-2xl p-4 text-center font-bold transition-all hover:border-slate-300 text-slate-400';
            btn.querySelector('.text-2xl').classList.add('text-slate-700');
        }
    });
    window.calcUpdate();
    window.updateFeeMatrix(size);
}

window.calcUpdate = function() {
    const calcDaysEl = document.getElementById('calc-days');
    if (!calcDaysEl) return; // 防呆：如果不在用戶頁面則略過
    
    const days = parseInt(calcDaysEl.value);
    const extraDays = Math.max(0, days - 1);
    const extraFee = extraDays * calcState.surcharge;
    const total = calcState.base + extraFee;

    document.getElementById('calc-base').textContent = '$' + calcState.base;
    document.getElementById('calc-extra').textContent = '$' + extraFee;
    document.getElementById('calc-total').textContent = '$' + total;
}

window.updateFeeMatrix = function(size) {
    const data = feeData[size];
    const elements = ['disp-size', 'disp-base', 'disp-extra', 'disp-penalty', 'disp-max-penalty'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.style.opacity = 0;
            setTimeout(() => {
                if(id === 'disp-size') el.innerText = data.label;
                if(id === 'disp-base') el.innerText = `$${data.base}`;
                if(id === 'disp-extra') el.innerText = `+$${data.extra} / 天`;
                if(id === 'disp-penalty') el.innerText = `+$${data.penalty} / 24h`;
                if(id === 'disp-max-penalty') el.innerText = `$${data.maxPenalty}`;
                el.style.opacity = 1;
            }, 200);
        }
    });
}

// ====== 邊界防護 ======
window.toggleEdgeCard = function(element) {
    const allCards = document.querySelectorAll('.edge-card');
    if (element.classList.contains('open')) {
        element.classList.remove('open');
        element.classList.replace('border-blue-400', 'border-slate-200');
        element.classList.remove('ring-4', 'ring-blue-100', 'bg-white');
        element.classList.add('bg-slate-50');
        return;
    }
    allCards.forEach(card => {
        card.classList.remove('open');
        card.classList.replace('border-blue-400', 'border-slate-200');
        card.classList.remove('ring-4', 'ring-blue-100', 'bg-white');
        card.classList.add('bg-slate-50');
    });
    element.classList.add('open');
    element.classList.replace('border-slate-200', 'border-blue-400');
    element.classList.add('ring-4', 'ring-blue-100', 'bg-white');
    element.classList.remove('bg-slate-50');
}

// ====== 雙端互動體驗切換 ======
const subtitles = {
    1: "您正在檢視：尋找店家時，雙方在意的定價與容量問題。",
    2: "您正在檢視：先在 App 預約取得代收地址後，才去電商下單。強制防呆無 COD。",
    3: "您正在檢視：包裹到店後，店家應對尺寸不符的 ARKit 防護。",
    4: "您正在檢視：完成三重驗證後，逾期罰則與商家最關心的 T+7 金流。"
};

window.setScenario = function(scId) {
    const subtitleEl = document.getElementById('dynamic-faq-subtitle');
    if (!subtitleEl) return;

    document.querySelectorAll('.scenario-btn').forEach((btn, index) => {
        if (index + 1 === scId) {
            btn.className = "scenario-btn relative px-6 py-3 text-sm font-bold rounded-full transition-all duration-300 bg-brand-600 text-white shadow-[0_0_15px_rgba(2,132,199,0.5)]";
        } else {
            btn.className = "scenario-btn relative px-6 py-3 text-sm font-bold rounded-full transition-all duration-300 text-slate-400 hover:text-white hover:bg-slate-700";
        }
    });

    subtitleEl.innerText = subtitles[scId];
    document.querySelectorAll('.screen-container').forEach(el => el.classList.remove('active'));
    
    document.querySelectorAll('.faq-group').forEach(el => {
        el.classList.add('hidden'); el.classList.remove('block');
        el.querySelectorAll('.faq-content').forEach((content) => {
            content.style.maxHeight = null;
            if(content.previousElementSibling) { content.previousElementSibling.querySelector('.faq-icon').style.transform = 'rotate(0deg)'; }
        });
    });

    const currentFaqGroup = document.getElementById('dynamic-faq-sc' + scId);
    if(currentFaqGroup) {
        currentFaqGroup.classList.remove('hidden'); currentFaqGroup.classList.add('block');
        setTimeout(() => {
            const firstFaqBtn = currentFaqGroup.querySelector('button');
            if (firstFaqBtn) window.toggleDynamicFaq(firstFaqBtn);
        }, 100);
    }

    setTimeout(() => {
        const uSc = document.getElementById('u-sc' + scId);
        const mSc = document.getElementById('m-sc' + scId);
        if(uSc) uSc.classList.add('active');
        if(mSc) mSc.classList.add('active');
    }, 50);
}

window.toggleDynamicFaq = function(btn) {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('.faq-icon');
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        icon.style.transform = 'rotate(0deg)';
    } else {
        const group = btn.closest('.faq-group');
        group.querySelectorAll('.faq-content').forEach(el => {
            el.style.maxHeight = null;
            if(el.previousElementSibling) { el.previousElementSibling.querySelector('.faq-icon').style.transform = 'rotate(0deg)'; }
        });
        content.style.maxHeight = content.scrollHeight + "px";
        icon.style.transform = 'rotate(180deg)';
    }
}

// ====== 常見問題 FAQ 切換 ======
window.toggleFaq = function(btn) {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('.faq-icon');
    const panel = btn.closest('.faq-panel');
    if (content.style.maxHeight) {
        content.style.maxHeight = null; icon.style.transform = 'rotate(0deg)';
    } else {
        panel.querySelectorAll('.faq-content').forEach(el => {
            el.style.maxHeight = null;
            if(el.previousElementSibling) { el.previousElementSibling.querySelector('.faq-icon').style.transform = 'rotate(0deg)'; }
        });
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    }
}

window.switchFaqTab = function(tab) {
    document.querySelectorAll('.faq-panel').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.faq-tab-btn').forEach(btn => {
        btn.classList.remove('active', 'border-brand-500', 'border-merchant-500', 'text-brand-600', 'text-merchant-600', 'bg-brand-50', 'bg-merchant-50');
        btn.classList.add('border-slate-200', 'text-slate-500', 'bg-white');
    });
    const panel = document.getElementById('faq-' + tab);
    if(panel) {
        panel.classList.remove('hidden');
        panel.querySelectorAll('.faq-content').forEach(el => {
            el.style.maxHeight = null;
            if(el.previousElementSibling) { el.previousElementSibling.querySelector('.faq-icon').style.transform = 'rotate(0deg)'; }
        });
    }
    const activeBtn = document.getElementById('faq-tab-' + tab);
    if(activeBtn) {
        activeBtn.classList.remove('border-slate-200', 'text-slate-500', 'bg-white');
        activeBtn.classList.add('active');
        if (tab === 'user') { activeBtn.classList.add('border-brand-500', 'text-brand-600', 'bg-brand-50'); } 
        else { activeBtn.classList.add('border-merchant-500', 'text-merchant-600', 'bg-merchant-50'); }
    }
}

// ====== Chart.js 渲染 ======
function renderChart() {
    const ctxElement = document.getElementById('revenueChart');
    if (!ctxElement) return; // 如果不是商家頁面就不會執行
    const ctx = ctxElement.getContext('2d');
    
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', 'Noto Sans TC', sans-serif";
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'],
            datasets: [
                {
                    label: '商家實拿分潤',
                    data: [700, 750, 780, 820],
                    backgroundColor: '#10b981',
                    borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 8, bottomRight: 8 },
                    borderSkipped: false
                },
                {
                    label: '平台營運/準備金',
                    data: [300, 250, 220, 180],
                    backgroundColor: '#475569',
                    borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { stacked: true, grid: { display: false, drawBorder: false } },
                y: { stacked: true, beginAtZero: true, max: 1000, grid: { color: '#334155' }, ticks: { callback: value => '$' + value } }
            },
            plugins: {
                tooltip: {
                    backgroundColor: '#0f172a', padding: 12, titleFont: { size: 14, weight: 'bold' }, bodyFont: { size: 13 },
                    callbacks: { label: function(context) { return `${context.dataset.label}: $${context.parsed.y} (${(context.parsed.y/10).toFixed(0)}%)`; } }
                },
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { weight: 'bold' } } }
            }
        }
    });
}

// ====== 當所有組件載入完成後執行 ======
document.addEventListener('layoutLoaded', () => {
    renderChart();
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section-fade').forEach(el => observer.observe(el));
});