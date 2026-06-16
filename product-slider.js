// 产品横向滑动功能
// 作者：汉天医网站
// 功能：左右箭头按钮 + 触摸滑动支持

// ==========================================
// 左右箭头按钮滑动功能
// ==========================================

function scrollProducts(direction) {
    const productGrid = document.querySelector('.product-grid');
    const scrollAmount = 320;  // 每次滑动的距离（卡片宽度300px + gap 20px）
    
    if (productGrid) {
        productGrid.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

// ==========================================
// 触摸滑动支持（移动端）
// ==========================================

let touchStartX = 0;
let touchEndX = 0;

// 初始化触摸事件
function initTouchEvents() {
    const productGrid = document.querySelector('.product-grid');
    
    if (productGrid) {
        // 触摸开始
        productGrid.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        // 触摸结束
        productGrid.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
    }
}

// 处理滑动手势
function handleSwipe() {
    const swipeThreshold = 50;  // 最小滑动距离
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // 向左滑动 → 显示下一张
        scrollProducts(1);
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // 向右滑动 → 显示上一张
        scrollProducts(-1);
    }
}

// ==========================================
// 鼠标拖拽滑动支持（桌面端）
// ==========================================

let isDragging = false;
let startX = 0;
let scrollLeft = 0;

function initDragEvents() {
    const productGrid = document.querySelector('.product-grid');
    
    if (productGrid) {
        // 鼠标按下
        productGrid.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.pageX - productGrid.offsetLeft;
            scrollLeft = productGrid.scrollLeft;
            productGrid.style.cursor = 'grabbing';
        });
        
        // 鼠标移动
        productGrid.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - productGrid.offsetLeft;
            const walk = (x - startX) * 2;  // 乘2增加滑动速度
            productGrid.scrollLeft = scrollLeft - walk;
        });
        
        // 鼠标松开
        productGrid.addEventListener('mouseup', function() {
            isDragging = false;
            productGrid.style.cursor = 'grab';
        });
        
        // 鼠标离开
        productGrid.addEventListener('mouseleave', function() {
            isDragging = false;
            productGrid.style.cursor = 'grab';
        });
    }
}

// ==========================================
// 初始化所有事件
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('产品滑动功能已初始化');
    
    // 初始化触摸事件
    initTouchEvents();
    
    // 初始化拖拽事件
    initDragEvents();
    
    // 设置产品网格的鼠标样式
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        productGrid.style.cursor = 'grab';
    }
});

// 导出函数（供HTML中的onclick调用）
window.scrollProducts = scrollProducts;
