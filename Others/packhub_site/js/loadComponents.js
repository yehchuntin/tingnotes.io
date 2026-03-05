async function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        const res = await fetch(file);
        el.innerHTML = await res.text();
    } catch (e) {
        console.error(`Error loading ${file}:`, e);
    }
}

async function initLayout() {
    await Promise.all([
        loadComponent("navbar", "components/navbar.html"),
        loadComponent("footer", "components/footer.html")
    ]);
    // 當 Header/Footer 載入完畢後，觸發事件通知 app.js
    document.dispatchEvent(new Event('layoutLoaded'));
}

initLayout();