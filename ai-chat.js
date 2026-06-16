// ============================================
// 微信风格AI聊天窗口（内嵌版）
// ============================================
// 
// ⚠️ 重要：部署前必须更新 API_URL！
// 当前使用 cpolar 公网地址，免费版地址会变化
// 启动 cpolar 后，将新地址替换下面的值
// 
// 启动命令：cpolar http 8000
// 获取地址：查看 cpolar 启动输出的 "Forwarding" URL
//
const AI_CHAT_CONFIG = {
    API_URL: window.HANTIYI_AI_URL || 'https://5b2c2cb2.r7.cpolar.cn',  // ⚠️ 替换为新的 cpolar 地址
    API_ENDPOINT: '/chat'
};

let aiChatOpen = false;
let aiSessionId = null;
let aiDragData = null;

// 切换聊天窗口
function toggleAIChat() {
    var win = document.getElementById('ai-chat-window');
    var btn = document.getElementById('ai-float-btn');
    if (!win) return;
    aiChatOpen = !aiChatOpen;
    
    if (aiChatOpen) {
        win.classList.add('active');
        if (btn) { btn.style.transform = 'scale(0)'; btn.style.opacity = '0'; }
        var badge = document.getElementById('ai-badge');
        if (badge) badge.style.display = 'none';
        setTimeout(function() {
            var inp = document.getElementById('aiInput');
            if (inp) inp.focus();
        }, 300);
    } else {
        win.classList.remove('active');
        if (btn) { btn.style.transform = ''; btn.style.opacity = ''; }
        win.style.right = '25px';
        win.style.bottom = '90px';
        win.style.left = 'auto';
        win.style.top = 'auto';
    }
}

// 清空对话
function clearChatHistory(e) {
    if (e) e.stopPropagation();
    var body = document.getElementById('aiChatBody');
    if (!body) return;
    body.innerHTML =
        '<div class="ai-welcome">' +
        '<div class="ai-welcome-avatar">🌿</div>' +
        '<div class="ai-welcome-text">您好！我是汉天医AI健康顾问，有什么可以帮您？</div>' +
        '<div class="ai-quick-tags">' +
        '<span onclick="sendQuickMsg(\'体质辨识\')">体质辨识</span>' +
        '<span onclick="sendQuickMsg(\'产品推荐\')">产品推荐</span>' +
        '<span onclick="sendQuickMsg(\'睡眠调理\')">睡眠调理</span>' +
        '<span onclick="sendQuickMsg(\'药食同源\')">药食同源</span>' +
        '</div></div>';
    aiSessionId = null;
}

// 快捷标签发送
function sendQuickMsg(text) {
    var input = document.getElementById('aiInput');
    if (input) { input.value = text; sendAIMessage(); }
}

// 键盘事件：Enter发送，Shift+Enter换行
function handleAIKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAIMessage();
    }
}

// 发送消息
async function sendAIMessage() {
    var input = document.getElementById('aiInput');
    if (!input) return;
    var text = (input.value || '').trim();
    if (!text) return;
    
    var body = document.getElementById('aiChatBody');
    var sendBtn = document.getElementById('aiSendBtn');
    if (!body) return;
    
    // 移除欢迎区域（首次发消息时）
    var welcome = body.querySelector('.ai-welcome');
    if (welcome) welcome.remove();
    
    // 添加用户消息气泡
    appendMessage(text, 'user');
    input.value = '';
    autoResizeTextarea(input);
    if (sendBtn) sendBtn.disabled = true;
    
    // 显示正在输入
    showTypingBubble(body);
    
    try {
        var apiUrl = AI_CHAT_CONFIG.API_URL.replace(/\/$/, '') + AI_CHAT_CONFIG.API_ENDPOINT;
        var response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, session_id: aiSessionId })
        });
        
        if (!response.ok) throw new Error('HTTP ' + response.status);
        
        var data = await response.json();
        aiSessionId = data.session_id || aiSessionId;
        
        removeTypingBubble(body);
        appendMessage(data.reply || '抱歉，我没有理解您的问题，请换个方式再试。', 'bot');
        
    } catch (err) {
        removeTypingBubble(body);
        appendMessage('连接失败，请检查网络后重试。如需帮助可拨打：15288197613', 'bot');
        console.error('AI Chat Error:', err);
    }
    
    if (sendBtn) sendBtn.disabled = false;
    if (input) input.focus();
}

// 追加消息气泡
function appendMessage(text, role) {
    var body = document.getElementById('aiChatBody');
    if (!body) return;
    var div = document.createElement('div');
    div.className = 'ai-msg ' + role;
    
    var avatar = role === 'bot' ? '🌿' : '👤';
    div.innerHTML = '<div class="ai-msg-avatar">' + avatar + '</div><div class="ai-msg-bubble">' + escapeHtml(text) + '</div>';
    
    body.appendChild(div);
    scrollToBottom(body);
}

function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

// 正在输入动画
function showTypingBubble(container) {
    var div = document.createElement('div');
    div.className = 'ai-msg bot';
    div.id = 'ai-typing-msg';
    div.innerHTML = '<div class="ai-msg-avatar">🌿</div><div class="ai-typing"><span></span><span></span><span></span></div>';
    container.appendChild(div);
    scrollToBottom(container);
}

function removeTypingBubble(container) {
    var el = document.getElementById('ai-typing-msg');
    if (el) el.remove();
}

function scrollToBottom(el) {
    if (el) el.scrollTop = el.scrollHeight;
}

// textarea自动高度
function autoResizeTextarea(el) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 80) + 'px';
}

// ===== 窗口拖拽 =====
function startDrag(e) {
    if (!e.target) return;
    if (e.target.closest && (e.target.closest('.ai-chat-clear') || e.target.closest('.ai-chat-close'))) return;
    var win = document.getElementById('ai-chat-window');
    if (!win) return;
    var rect = win.getBoundingClientRect();
    aiDragData = {
        startX: e.clientX,
        startY: e.clientY,
        origRight: rect.right,
        origBottom: rect.bottom
    };
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    e.preventDefault();
}

function onDrag(e) {
    if (!aiDragData) return;
    var win = document.getElementById('ai-chat-window');
    if (!win) return;
    var dx = e.clientX - aiDragData.startX;
    var dy = e.clientY - aiDragData.startY;
    
    var newRight = window.innerWidth - aiDragData.origRight - dx;
    var newBottom = window.innerHeight - aiDragData.origBottom - dy;
    
    win.style.right = Math.max(-10, Math.min(window.innerWidth - 380, newRight)) + 'px';
    win.style.bottom = Math.max(10, Math.min(window.innerHeight - 200, newBottom)) + 'px';
    win.style.left = 'auto';
    win.style.top = 'auto';
}

function stopDrag() {
    aiDragData = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
}

// ============================================
// 兼容功能
// ============================================

// 返回顶部
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 汉堡菜单切换
function toggleMenu() {
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');
    if (hamburger) hamburger.classList.toggle('active');
    if (navLinks) navLinks.classList.toggle('active');
}

// 滚动监听 - 显示/隐藏返回顶部按钮
window.addEventListener('scroll', function() {
    var btn = document.getElementById('back-to-top');
    if (btn) {
        if (window.scrollY > 300) btn.classList.add('visible');
        else btn.classList.remove('visible');
    }
});

// 页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    // textarea自动高度绑定
    var aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.addEventListener('input', function() { autoResizeTextarea(aiInput); });
    }
    
    // 导航链接点击关闭菜单
    var navLinks = document.querySelectorAll('.nav-links a');
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function() {
            var burger = document.querySelector('.hamburger');
            var nav = document.querySelector('.nav-links');
            if (burger) burger.classList.remove('active');
            if (nav) nav.classList.remove('active');
        });
    }
});
