// 数据库连接和初始化 - SQLite版本
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径
const dbPath = path.join(__dirname, 'hantianyi.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ 数据库连接失败:', err.message);
    } else {
        console.log('✅ 已连接到 SQLite 数据库:', dbPath);
    }
});

// 初始化数据库表
function initDatabase() {
    console.log('📊 开始初始化数据库表...');
    
    db.serialize(() => {
        // 1. 用户表（会员系统）
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            avatar TEXT,
            role TEXT DEFAULT 'user',  -- user/admin
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('❌ 创建用户表失败:', err.message);
            } else {
                console.log('  ✅ 用户表已就绪');
            }
        });
        
        // 2. 产品表
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            image TEXT,
            category TEXT,
            stock INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',  -- active/inactive
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('❌ 创建产品表失败:', err.message);
            } else {
                console.log('  ✅ 产品表已就绪');
            }
        });
        
        // 3. 订单表
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_no TEXT UNIQUE NOT NULL,
            user_id INTEGER,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',  -- pending/paid/shipped/completed/cancelled
            shipping_address TEXT,
            phone TEXT,
            remark TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`, (err) => {
            if (err) {
                console.error('❌ 创建订单表失败:', err.message);
            } else {
                console.log('  ✅ 订单表已就绪');
            }
        });
        
        // 4. 订单详情表
        db.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`, (err) => {
            if (err) {
                console.error('❌ 创建订单详情表失败:', err.message);
            } else {
                console.log('  ✅ 订单详情表已就绪');
            }
        });
        
        // 5. 购物车表
        db.run(`CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            quantity INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`, (err) => {
            if (err) {
                console.error('❌ 创建购物车表失败:', err.message);
            } else {
                console.log('  ✅ 购物车表已就绪');
            }
        });
        
        console.log('✅ 数据库初始化完成！');
    });
}

// 插入示例数据
function seedDatabase() {
    console.log('🌱 开始插入示例数据...');
    
    db.serialize(() => {
        // 检查是否已有数据
        db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
            if (err) {
                console.error('❌ 检查数据失败:', err.message);
                return;
            }
            
            if (row.count > 0) {
                console.log('  ⚠️ 产品数据已存在，跳过插入');
                return;
            }
            
            // 插入示例产品数据
            const products = [
                {
                    name: '药食同源处方茶',
                    description: '精选二十六味药材，科学配比，调理身体机能',
                    price: 298,
                    image: 'images/products/product-chacai.jpg',
                    category: '茶饮品',
                    stock: 100
                },
                {
                    name: '穴位磁疗垫',
                    description: '远红外+磁疗双重功效，缓解疲劳，改善睡眠',
                    price: 598,
                    image: 'images/products/product-ciliaodian.jpg',
                    category: '理疗用品',
                    stock: 50
                },
                {
                    name: '护眼养生眼盒',
                    description: '中药熏蒸+温热理疗，缓解眼疲劳，保护视力',
                    price: 198,
                    image: 'images/products/product-yanhe.jpg',
                    category: '眼部护理',
                    stock: 80
                },
                {
                    name: '九合一低聚肽',
                    description: '小分子肽+多种营养素，易吸收，增强免疫力',
                    price: 398,
                    image: 'images/products/product-teshan.jpg',
                    category: '特膳食品',
                    stock: 60
                }
            ];
            
            const stmt = db.prepare(`INSERT INTO products (name, description, price, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)`);
            
            products.forEach(product => {
                stmt.run([product.name, product.description, product.price, product.image, product.category, product.stock], (err) => {
                    if (err) {
                        console.error('❌ 插入产品失败:', err.message);
                    }
                });
            });
            
            stmt.finalize();
            
            console.log('  ✅ 示例产品数据已插入（4个产品）');
        });
    });
}

// 导出数据库对象和初始化函数
module.exports = {
    db,
    initDatabase,
    seedDatabase
};
