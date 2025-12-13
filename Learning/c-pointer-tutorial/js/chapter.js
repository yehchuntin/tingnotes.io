// chapter.js - 負責所有教學章節的互動功能

// --- 1. 備用複製方案 ---
function fallbackCopyTextToClipboard(text, btn) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showSuccess(btn);
        } else {
            btn.textContent = 'Failed';
            setTimeout(() => {
                btn.textContent = 'Copy';
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        btn.textContent = 'Error';
        setTimeout(() => {
            btn.textContent = 'Copy';
        }, 2000);
    }
    document.body.removeChild(textArea);
}

// --- 2. 顯示成功動畫 ---
function showSuccess(btn) {
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
    }, 2000);
}

// --- 3. 複製函式 (改用事件監聽而非全域函數) ---
function setupCopyButtons() {
    // 找到所有複製按鈕並綁定點擊事件
    document.querySelectorAll('.copy-btn').forEach(btn => {
        // 移除舊的事件監聽器（如果有）
        btn.replaceWith(btn.cloneNode(true));
    });
    
    // 重新獲取按鈕並綁定新的事件
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const container = this.closest('.code-container');
            if (!container) {
                console.error('找不到 .code-container');
                return;
            }
            
            const codeBlock = container.querySelector('code');
            if (!codeBlock) {
                console.error('找不到 <code> 元素');
                return;
            }
            
            const codeText = codeBlock.textContent;
            console.log('準備複製', codeText.length, '個字元');

            // 嘗試使用現代 Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(codeText)
                    .then(() => {
                        console.log('✓ Clipboard API 成功');
                        showSuccess(this);
                    })
                    .catch(err => {
                        console.warn('Clipboard API 失敗，使用降級方案:', err);
                        fallbackCopyTextToClipboard(codeText, this);
                    });
            } else {
                // 直接使用降級方案
                console.log('使用降級複製方案');
                fallbackCopyTextToClipboard(codeText, this);
            }
        });
    });
    
    console.log(`✓ 已綁定 ${document.querySelectorAll('.copy-btn').length} 個複製按鈕`);
}

// --- 4. 章節導航設定 ---
function setupChapterNavigation() {
    const path = window.location.pathname;
    const match = path.match(/chapter(\d+)\.html/);
    
    if (match) {
        const currentNum = parseInt(match[1]);
        const totalChapters = 18;

        // 更新麵包屑的章節數字
        const chapDisplay = document.getElementById('chap-num-display');
        if (chapDisplay) {
            chapDisplay.textContent = currentNum;
        }

        // 設定上一章按鈕
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn) {
            if (currentNum > 1) {
                prevBtn.href = `chapter${currentNum - 1}.html`;
                prevBtn.classList.remove('disabled');
            } else {
                prevBtn.classList.add('disabled');
            }
        }

        // 設定下一章按鈕
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            if (currentNum < totalChapters) {
                nextBtn.href = `chapter${currentNum + 1}.html`;
                nextBtn.classList.remove('disabled');
            } else {
                nextBtn.classList.add('disabled');
                // 可選：最後一章改為返回目錄
                // nextBtn.textContent = "回到目錄";
                // nextBtn.href = "/Learning/c-pointer-tutorial/index.html";
            }
        }
        
        console.log(`✓ 章節導航已設定 (第 ${currentNum}/${totalChapters} 章)`);
    }
}

// --- 5. 頁面載入完成後初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== Chapter.js 初始化 ===');
    setupCopyButtons();
    setupChapterNavigation();
    console.log('=== Chapter.js 初始化完成 ===');
});

// --- 6. 為了相容性，也保留全域函數 (可選) ---
window.copyCode = function(btn) {
    console.log('使用全域 copyCode 函數');
    const container = btn.closest('.code-container');
    if (!container) return;
    
    const codeBlock = container.querySelector('code');
    if (!codeBlock) return;
    
    const codeText = codeBlock.textContent;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(codeText)
            .then(() => showSuccess(btn))
            .catch(() => fallbackCopyTextToClipboard(codeText, btn));
    } else {
        fallbackCopyTextToClipboard(codeText, btn);
    }
}