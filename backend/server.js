// 汉天医网站 - 后端服务器（简化版）
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { db, initDatabase, seedDatabase } = require('./database');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

// 初始化数据库
initDatabase();
setTimeout(() => { seedDatabase(); }, 1000);

// 测试路由
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'API运行正常' });
});

// 获取产品列表
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

// 用户注册
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        res.status(400).json({ success: false, error: '缺少必填字段' });
        return;
    }
    
    db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
        [username, email, password], 
        function(err) {
            if (err) {
                res.status(500).json({ success: false, error: err.message });
            } else {
                res.json({ success: true, message: '注册成功', userId: this.lastID });
            }
        }
    );
});

// 用户登录
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', 
        [username, password], 
        (err, row) => {
            if (err) {
                res.status(500).json({ success: false, error: err.message });
            } else if (!row) {
                res.status(401).json({ success: false, error: '用户名或密码错误' });
            } else {
                res.json({ success: true, message: '登录成功', user: { id: row.id, username: row.username } });
            }
        }
    );
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('汉天医后端服务器已启动');
    console.log('='.repeat(50));
    console.log('');
    console.log('地址: <ADDRESS_REMOVED>
    console.log('测试: <ADDRESS_REMOVED>
    console.log('');
    console.log('可用API:');
    console.log('  GET  /api/test');
    console.log('  GET  /api/products');
    console.log('  POST /api/register');
    console.log('  POST /api/login');
    console.log('');
    console.log('='.repeat(50));
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    db.close((err) => {
        if (err) {
            console.error('关闭数据库失败:', err.message);
        } else {
            console.log('数据库连接已关闭');
        }
        process.exit(0);
    });
});
