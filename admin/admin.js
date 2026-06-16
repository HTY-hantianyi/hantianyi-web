// 鐩存帴鐢?fetch 璋冪敤 Supabase REST API锛堢粫杩?SDK 闂锛?const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co';
const API_KEY = 'YOUR_SUPABASE_SERVICE_KEY';  // 鏇挎崲涓轰綘鐨?Supabase service_role key

const headers = {
    'apikey': API_KEY,
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
};

// Tab 鍒囨崲
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

// 鍔犺浇姒傝鏁版嵁
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
        console.error('鍔犺浇姒傝澶辫触:', e);
    }
}

// 浜у搧绠＄悊
async function loadProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '<p style="color: #666;">鍔犺浇涓?..</p>';
    
    try {
        const data = await (await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=sort_order.asc`, {headers})).json();
        
        if (!data || data.length === 0) {
            grid.innerHTML = '<p style="color: #666;">鏆傛棤浜у搧锛岀偣鍑讳笂鏂规寜閽坊鍔?/p>';
            return;
        }
        
        grid.innerHTML = data.map(p => `
            <div class="product-card">
                <img src="${p.image_url || 'https://via.placeholder.com/300x200?text=鏃犲浘鐗?}" 
                     class="product-image" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=鏃犲浘鐗?">
                <div class="product-name">${p.name}</div>
                <div class="product-price">楼${p.price || '闈㈣'}</div>
                <div class="product-desc">${p.description || '鏆傛棤鎻忚堪'}</div>
                <div style="margin-top: 10px;">
                    <span class="badge ${p.is_active ? 'badge-success' : 'badge-danger'}">
                        ${p.is_active ? '涓婃灦涓? : '宸蹭笅鏋?}
                    </span>
                </div>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="editProduct(${p.id})">缂栬緫</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${p.id})">鍒犻櫎</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        grid.innerHTML = '<p style="color: red;">鍔犺浇澶辫触: ' + e.message + '</p>';
    }
}

function openProductModal(product = null) {
    document.getElementById('productModal').classList.add('active');
    document.getElementById('productModalTitle').textContent = product ? '缂栬緫浜у搧' : '娣诲姞浜у搧';
    
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDesc').value = product.description || '';
        document.getElementById('productPrice').value = product.price || '';
        document.getElementById('productImage').value = product.image_url || '';
        document.getElementById('productCategory').value = product.category || '鍏朵粬';
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
            alert('淇濆瓨鎴愬姛锛?);
        } else {
            const error = await response.text();
            alert('淇濆瓨澶辫触: ' + error);
        }
    } catch (e) {
        alert('淇濆瓨澶辫触: ' + e.message);
    }
});

async function editProduct(id) {
    const data = await (await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}&select=*`, {headers})).json();
    if (data && data[0]) openProductModal(data[0]);
}

async function deleteProduct(id) {
    if (!confirm('纭畾瑕佸垹闄よ繖涓骇鍝佸悧锛?)) return;
    
    await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
        method: 'DELETE',
        headers
    });
    
    loadProducts();
}

// 鏂囩珷绠＄悊
async function loadArticles() {
    const list = document.getElementById('article-list');
    list.innerHTML = '<p style="color: #666;">鍔犺浇涓?..</p>';
    
    try {
        const data = await (await fetch(`${SUPABASE_URL}/rest/v1/articles?select=*&order=created_at.desc`, {headers})).json();
        
        if (!data || data.length === 0) {
            list.innerHTML = '<p style="color: #666;">鏆傛棤鏂囩珷</p>';
            return;
        }
        
        list.innerHTML = data.map(a => `
            <div class="contact-item">
                <h3>${a.title}</h3>
                <p style="color: #666; font-size: 14px;">${new Date(a.created_at).toLocaleString()}</p>
                <p style="margin-top: 10px;">${(a.content || '').substring(0, 100)}...</p>
                <div style="margin-top: 15px;">
                    <button class="btn btn-primary" onclick="editArticle(${a.id})">缂栬緫</button>
                    <button class="btn btn-danger" onclick="deleteArticle(${a.id})">鍒犻櫎</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        list.innerHTML = '<p style="color: red;">鍔犺浇澶辫触</p>';
    }
}

function openArticleModal(article = null) {
    document.getElementById('articleModal').classList.add('active');
    document.getElementById('articleModalTitle').textContent = article ? '缂栬緫鏂囩珷' : '鍙戝竷鏂囩珷';
    
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
            alert('淇濆瓨鎴愬姛锛?);
        } else {
            alert('淇濆瓨澶辫触');
        }
    } catch (e) {
        alert('淇濆瓨澶辫触: ' + e.message);
    }
});

async function editArticle(id) {
    const data = await (await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${id}&select=*`, {headers})).json();
    if (data && data[0]) openArticleModal(data[0]);
}

async function deleteArticle(id) {
    if (!confirm('纭畾瑕佸垹闄よ繖绡囨枃绔犲悧锛?)) return;
    
    await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${id}`, {
        method: 'DELETE',
        headers
    });
    
    loadArticles();
}

// 鐣欒█绠＄悊
async function loadContacts() {
    const list = document.getElementById('contact-list');
    list.innerHTML = '<p style="color: #666;">鍔犺浇涓?..</p>';
    
    try {
        const data = await (await fetch(`${SUPABASE_URL}/rest/v1/contacts?select=*&order=created_at.desc`, {headers})).json();
        
        if (!data || data.length === 0) {
            list.innerHTML = '<p style="color: #666;">鏆傛棤鐣欒█</p>';
            return;
        }
        
        list.innerHTML = data.map(c => `
            <div class="contact-item ${!c.is_read ? 'contact-unread' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${c.name || '鍖垮悕'}</strong>
                    <span style="color: #666; font-size: 14px;">${new Date(c.created_at).toLocaleString()}</span>
                </div>
                <p style="color: #666; margin: 5px 0;">鐢佃瘽: ${c.phone || '鏈暀'}</p>
                <p style="margin-top: 10px;">${c.message}</p>
                <div style="margin-top: 10px;">
                    <button class="btn btn-primary" onclick="markRead(${c.id}, ${!c.is_read})">
                        ${c.is_read ? '鏍囪鏈' : '鏍囪宸茶'}
                    </button>
                    <button class="btn btn-danger" onclick="deleteContact(${c.id})">鍒犻櫎</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        list.innerHTML = '<p style="color: red;">鍔犺浇澶辫触</p>';
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
    if (!confirm('纭畾瑕佸垹闄よ繖鏉＄暀瑷€鍚楋紵')) return;
    
    await fetch(`${SUPABASE_URL}/rest/v1/contacts?id=eq.${id}`, {
        method: 'DELETE',
        headers
    });
    
    loadContacts();
}

// 椤甸潰鍔犺浇鏃跺垵濮嬪寲
loadOverview();
