// ==========================================
// 豆包智能体（汉天医）API配置
// ==========================================
const DOUBAO_CONFIG = {
    // 豆包智能体（汉天医）API配置 - 已配置智能体ID
    API_URL: 'https://www.doubao.com/api/bot/chat',  // 豆包智能体API地址（请确认实际地址）
    API_KEY: 'YOUR_API_KEY',                          // ⚠️ 请填写您的API Key（必填）
    AGENT_ID: 'wuEVFwB4',                           // ✅ 汉天医智能体ID（已从链接提取）
    TIMEOUT: 30000                                   // 请求超时时间（毫秒）
};

// ==========================================
// 豆包智能体打开功能
// ==========================================

// 打开豆包智能体（汉天医）
function openDoubaoAgent() {
    // 豆包智能体链接
    const agentUrl = 'https://www.doubao.com/bot/wuEVFwB4';
    
    // 在新窗口打开（避免iframe嵌入被阻止）
    const agentWindow = window.open(
        agentUrl,
        'DoubaoAgent',
        'width=800,height=700,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes'
    );
    
    // 如果弹窗被阻止，给出提示
    if (!agentWindow) {
        alert('⚠️ 弹窗被浏览器阻止，请允许弹窗后重试，或直接访问：\nhttps://www.doubao.com/bot/wuEVFwB4');
        
        // 同时提供链接让用户点击
        if (confirm('是否在新标签页打开豆包智能体？')) {
            window.open(agentUrl, '_blank');
        }
    }
}

// ==========================================
// 移动端菜单功能
// ==========================================
// 切换移动端菜单显示/隐藏
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// 点击导航链接时关闭菜单
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-links');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// ==========================================
// AI对话窗口功能
// ==========================================

// 切换聊天窗口显示/隐藏
function toggleChat() {
    const chatWindow = document.getElementById('ai-chat');
    chatWindow.classList.toggle('active');
}

// 处理Enter键发送消息
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// 发送消息（调用豆包智能体API）
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const messageText = userInput.value.trim();
    
    if (messageText === '') {
        return;
    }
    
    // 添加用户消息到聊天窗口
    addMessage(messageText, 'user');
    
    // 清空输入框
    userInput.value = '';
    
    // 显示"正在输入"提示
    showTypingIndicator();
    
    try {
        // 调用豆包智能体API
        const botResponse = await callDoubaoAPI(messageText);
        
        // 移除"正在输入"提示
        removeTypingIndicator();
        
        // 添加AI回复到聊天窗口
        addMessage(botResponse, 'bot');
        
    } catch (error) {
        console.error('调用豆包智能体API失败：', error);
        
        // 移除"正在输入"提示
        removeTypingIndicator();
        
        // 显示错误信息
        addMessage('抱歉，AI服务暂时不可用，请稍后再试或拨打我们的客服电话：15288197613', 'bot');
    }
}

// 调用豆包智能体API
async function callDoubaoAPI(userMessage) {
    // 检查API配置是否完整
    if (DOUBAO_CONFIG.API_KEY === 'YOUR_API_KEY' || DOUBAO_CONFIG.AGENT_ID === 'YOUR_AGENT_ID') {
        throw new Error('请先配置豆包智能体API信息！');
    }
    
    const requestBody = {
        agent_id: DOUBAO_CONFIG.AGENT_ID,
        messages: [
            {
                role: 'user',
                content: userMessage
            }
        ],
        temperature: 0.7,
        max_tokens: 500
    };
    
    const response = await fetch(DOUBAO_CONFIG.API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Bearer 
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(DOUBAO_CONFIG.TIMEOUT)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(API请求失败： - );
    }
    
    const data = await response.json();
    
    // 根据豆包智能体API的实际返回格式提取回复内容
    // TODO: 根据实际API返回格式调整
    if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
    } else if (data.response) {
        return data.response;
    } else if (data.reply) {
        return data.reply;
    } else {
        throw new Error('API返回格式错误');
    }
}

// 显示"正在输入"提示
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    
    // 创建"正在输入"提示元素
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-message', 'typing-indicator');
    typingDiv.id = 'typing-indicator';
    
    const typingText = document.createElement('p');
    typingText.innerHTML = '<i class="fas fa-ellipsis-h"></i> 汉天医AI正在输入...';
    typingDiv.appendChild(typingText);
    
    // 添加到聊天窗口
    messagesContainer.appendChild(typingDiv);
    
    // 滚动到最新消息
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 移除"正在输入"提示
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// 添加消息到聊天窗口
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    
    // 创建消息段落
    const messageText = document.createElement('p');
    messageText.textContent = text;
    messageDiv.appendChild(messageText);
    
    // 添加到聊天窗口
    messagesContainer.appendChild(messageDiv);
    
    // 滚动到最新消息
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ==========================================
// 其他功能
// ==========================================

// 返回顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 监听滚动事件，显示/隐藏返回顶部按钮
window.addEventListener('scroll', function() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('汉天医网页已加载完成！');
    console.log('AI健康顾问已接入豆包智能体（汉天医）');
    
    // 检查API配置
    if (DOUBAO_CONFIG.API_KEY === 'YOUR_API_KEY' || DOUBAO_CONFIG.AGENT_ID === 'YOUR_AGENT_ID') {
        console.warn('⚠️ 请先配置豆包智能体API信息！');
        console.warn('   修改 ai-chat.js 中的 DOUBAO_CONFIG 对象');
    } else {
        console.log('✅ 豆包智能体API配置完成');
    }
});
