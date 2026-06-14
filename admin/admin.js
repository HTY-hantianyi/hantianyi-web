// 直接用 fetch 调用 Supabase REST API（绕过 SDK 问题）
const SUPABASE_URL = 'https://homyhvcmnoqpjahegdpq.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbXlodmNtbm9xcGphaGVnZHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTQ0NTA5NSwiZXhwIjoyMDk3MDIxMDk1fQ.xfoax1KZeUEeMUkiRcQzMmKwqf1AwCBUwMkAp9dP_Cw';

const headers = {
    'apikey': API_KEY,
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
};

// Tab 切换
function switchTab(tabName, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    
    btn.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    if (tabName === 'products') loadProducts();
    if (tabName === 'articles') loadArticles();
    if (tabName === 'contacts') loadContacts();
    if (tabName === 'overview') loadOverview();
}

// 加载概览数据
async function loadOverview() {
    try {
        const products = await (await fetch(`${SUPABASE_URL}/rest/v1/products?select=id`, {headers})).json();
        const articles = await (await fetch(`${SUPABASE_URL}/rest/v1/articles?select=id`, {headers})).json();
        const contacts = await (await fetch(`${SUPABASE_URL}/rest/v1/contacts?select=id`, {headers})).json();
        const unread = await (await fetch(`${SUPABASE_URL}/rest/v1/contacts?select=id&is_read=eq.false`, {headers})).json();
        
        document.getElementById('stat-products').textContent = products.length;
        document.getElementById('stat-articles').textContent = articles.length;
        document.getElementById('stat-contacts').textContent = contacts.length;
        document.getElementById('stat-unread').textContent = unread.length;
    } catch (e) {
        console.error('加载概览失败:', e);
    }
}

// 产品管理
async function loadProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '<p style="color: #666;">加载中...</p>';
    
    try {
        const data = await (await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=sort_order.asc`, {headers})).json();
        
        if (!data || data.length === 0) {
            grid.innerHTML = '<p style="color: #666;">暂无产品，点击上方按钮添加</p>';
            return;
        }
        
        grid.innerHTML = data.map(p => `
            <div class="product-card">
                <img src="${p.image_url || 'https://via.placeholder.com/300x200?text=无图片'}" 
                     class="product-image" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=无图片'">
                <div class="product-name">${p.name}</div>
                <div class="product-price">¥${p.price || '面议'}</div>
                <div class="product-desc">${p.description || '暂无描述'}</div>
                <div style="margin-top: 10px;">
                    <span class="badge ${p.is_active ? 'badge-success' : 'badge-danger'}">
                        ${p.is_active ? '上架中' : '已下架'}
                    </span>
                </div>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="editProduct(${p.id})">编辑</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${p.id})">删除</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        grid.innerHTML = '<p style="color: red;">加载失败: ' + e.message + '</p>';
    }
}

function openProductModal(product = null) {
    document.getElementById('productModal').classList.add('active');
    document.getElementById('productModalTitle').textContent = product ? '编辑产品' : '添加产品';
    
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDesc').value = product.description || '';
        document.getElementById('productPrice').value = product.price || '';
        document.getElementById('productImage').value = product.image_url || '';
        document.getElementById('productCategory').value = product.category || '其他';
        document.getElementById('productOrder').value = product.sort_order || 0;
        document.getElementById('productActive').checked = product.is_active !== false;
    } else {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
    }
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDesc').value,
        price: parseFloat(document.getElementById('productPrice').value) || null,
        image_url: document.getElementById('productImage').value,
        category: document.getElementById('productCategory').value,
        sort_order: parseInt(document.getElementById('productOrder').value) || 0,
        is_active: document.getElementById('productActive').checked
    };
    
    try {
        let url = `${SUPABASE_URL}/rest/v1/products`;
        let method = 'POST';
        
        if (id) {
            url += `?id=eq.${id}`;
            method = 'PATCH';
        }
        
        const response = await fetch(url, {
            method,
            headers: {...headers, 'Prefer': 'return=minimal'},
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            closeProductModal();
            loadProducts();
            alert('保存成功！');
        } else {
            const error = await response.text();
            alert('保存失败: ' + error);
        }
    } catch (e) {
        alert('保存失败: ' + e.message);
    }
});

async function editProduct(id) {
    const data = await (await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}&select=*`, {headers})).json();
    if (data && data[0]) openProductModal(data[0]);
}

async function deleteProduct(id) {
    if (!confirm('确定要删除这个产品吗？')) return;
    
    await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
        method: 'DELETE',
        headers
    });
    
    loadProducts();
}

// 文章管理
async function loadArticles() {
    const list = document.getElementById('article-list');
    list.innerHTML = '<p style="color: #666;">加载中...</p>';
    
    try {
        const data = await (await fetch(`${SUPABASE_URL}/rest/v1/articles?select=*&order=created_at.desc`, {headers})).json();
        
        if (!data || data.length === 0) {
            list.innerHTML = '<p style="color: #666;">暂无文章</p>';
            return;
        }
        
        list.innerHTML = data.map(a => `
            <div class="contact-item">
                <h3>${a.title}</h3>
                <p style="color: #666; font-size: 14px;">${new Date(a.created_at).toLocaleString()}</p>
                <p style="margin-top: 10px;">${(a.content || '').substring(0, 100)}...</p>
                <div style="margin-top: 15px;">
                    <button class="btn btn-primary" onclick="editArticle(${a.id})">编辑</button>
                    <button class="btn btn-danger" onclick="deleteArticle(${a.id})">删除</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        list.innerHTML = '<p style="color: red;">加载失败</p>';
    }
}

function openArticleModal(article = null) {
    document.getElementById('articleModal').classList.add('active');
    document.getElementById('articleModalTitle').textContent = article ? '编辑文章' : '发布文章';
    
    if (article) {
        document.getElementById('articleId').value = article.id;
        document.getElementById('articleTitle').value = article.title;
        document.getElementById('articleCover').value = article.cover_url || '';
        document.getElementById('articleContent').value = article.content || '';
    } else {
        document.getElementById('articleForm').reset();
        document.getElementById('articleId').value = '';
    }
}

function closeArticleModal() {
    document.getElementById('articleModal').classList.remove('active');
}

document.getElementById('articleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('articleId').value;
    const articleData = {
        title: document.getElementById('articleTitle').value,
        cover_url: document.getElementById('articleCover').value,
        content: document.getElementById('articleContent').value
    };
    
    try {
        let url = `${SUPABASE_URL}/rest/v1/articles`;
        let method = 'POST';
        
        if (id) {
            url += `?id=eq.${id}`;
            method = 'PATCH';
        }
        
        const response = await fetch(url, {
            method,
            headers: {...headers, 'Prefer': 'return=minimal'},
            body: JSON.stringify(articleData)
        });
        
        if (response.ok) {
            closeArticleModal();
            loadArticles();
            alert('保存成功！');
        } else {
            alert('保存失败');
        }
    } catch (e) {
        alert('保存失败: ' + e.message);
    }
});

async function editArticle(id) {
    const data = await (await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${id}&select=*`, {headers})).json();
    if (data && data[0]) openArticleModal(data[0]);
}

async function deleteArticle(id) {
    if (!confirm('确定要删除这篇文章吗？')) return;
    
    await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${id}`, {
        method: 'DELETE',
        headers
    });
    
    loadArticles();
}

// 留言管理
async function loadContacts() {
    const list = document.getElementById('contact-list');
    list.innerHTML = '<p style="color: #666;">加载中...</p>';
    
    try {
        const data = await (await fetch(`${SUPABASE_URL}/rest/v1/contacts?select=*&order=created_at.desc`, {headers})).json();
        
        if (!data || data.length === 0) {
            list.innerHTML = '<p style="color: #666;">暂无留言</p>';
            return;
        }
        
        list.innerHTML = data.map(c => `
            <div class="contact-item ${!c.is_read ? 'contact-unread' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${c.name || '匿名'}</strong>
                    <span style="color: #666; font-size: 14px;">${new Date(c.created_at).toLocaleString()}</span>
                </div>
                <p style="color: #666; margin: 5px 0;">电话: ${c.phone || '未留'}</p>
                <p style="margin-top: 10px;">${c.message}</p>
                <div style="margin-top: 10px;">
                    <button class="btn btn-primary" onclick="markRead(${c.id}, ${!c.is_read})">
                        ${c.is_read ? '标记未读' : '标记已读'}
                    </button>
                    <button class="btn btn-danger" onclick="deleteContact(${c.id})">删除</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        list.innerHTML = '<p style="color: red;">加载失败</p>';
    }
}

async function markRead(id, isRead) {
    await fetch(`${SUPABASE_URL}/rest/v1/contacts?id=eq.${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({is_read: isRead})
    });
    loadContacts();
}

async function deleteContact(id) {
    if (!confirm('确定要删除这条留言吗？')) return;
    
    await fetch(`${SUPABASE_URL}/rest/v1/contacts?id=eq.${id}`, {
        method: 'DELETE',
        headers
    });
    
    loadContacts();
}

// 页面加载时初始化
loadOverview();
