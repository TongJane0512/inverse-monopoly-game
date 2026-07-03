# 📦 部署指南

## 🌐 生產環境部署

本文檔詳細介紹如何將逆境大富翁遊戲平台部署到生產環境。

---

## 🏗️ 架構概述

```
┌─────────────────┐
│   Frontend      │
│  (Vercel)       │
└────────┬────────┘
         │
         ▼
   ┌──────────────────────────────┐
   │   CDN / Reverse Proxy        │
   │   (CloudFlare / Nginx)       │
   └──────────────┬───────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
   ┌──────────────┐  ┌──────────────┐
   │  Backend     │  │ Socket.io    │
   │  (Heroku)    │  │ Server       │
   │              │  │ (Heroku)     │
   └──────────────┘  └──────────────┘
         │
         ▼
   ┌──────────────────┐
   │ MongoDB Atlas    │
   │ (Cloud)          │
   └──────────────────┘
```

---

## 🚀 Heroku 部署

### 後端部署

#### 1. 準備應用

```bash
cd backend
heroku login
heroku create inverse-monopoly-api
```

#### 2. 添加 Procfile

在 `backend/` 根目錄創建 `Procfile`：

```
web: npm start
```

#### 3. 設置環境變量

```bash
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/inverse-monopoly?retryWrites=true&w=majority"
heroku config:set JWT_SECRET="your_production_secret_key"
heroku config:set NODE_ENV="production"
heroku config:set PORT="5000"
heroku config:set GOOGLE_MAPS_API_KEY="your_key"
heroku config:set AWS_ACCESS_KEY_ID="your_key"
heroku config:set AWS_SECRET_ACCESS_KEY="your_key"
heroku config:set AWS_S3_BUCKET="inverse-monopoly-videos"
heroku config:set AWS_REGION="ap-southeast-1"
```

#### 4. 部署

```bash
git add .
git commit -m "Prepare for production"
git push heroku main
```

#### 5. 驗證部署

```bash
heroku logs --tail
heroku open
```

---

### 前端部署（Vercel）

#### 1. 構建項目

```bash
cd frontend
npm run build
```

#### 2. 使用 Vercel CLI

```bash
npm install -g vercel
vercel
```

#### 3. 配置環境變量

在 Vercel Dashboard 中設置：

```
VITE_API_BASE_URL=https://inverse-monopoly-api.herokuapp.com/api
VITE_SOCKET_URL=https://inverse-monopoly-socket.herokuapp.com
VITE_GOOGLE_MAPS_API_KEY=your_key
```

#### 4. 自動部署

連接 GitHub 倉庫以實現自動部署：

1. 在 Vercel Dashboard 中連接 GitHub
2. 選擇 `inverse-monopoly-game` 倉庫
3. 設置構建命令：`npm run build`
4. 設置輸出目錄：`dist`

---

## 🐳 Docker 和 Docker Compose 部署

### 使用 Docker Compose 本地部署

#### 1. 創建 docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/inverse-monopoly
      - JWT_SECRET=your_secret
      - NODE_ENV=production
      - PORT=5000
    depends_on:
      - mongo
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://localhost:5000/api
    depends_on:
      - backend
    networks:
      - app-network

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongo_data:
```

#### 2. 運行 Docker Compose

```bash
docker-compose up -d
```

---

## ☁️ AWS EC2 部署

### 1. 啟動 EC2 實例

```bash
# 連接到實例
ssh -i your-key.pem ubuntu@your-instance-ip
```

### 2. 安裝依賴

```bash
sudo apt-get update
sudo apt-get install -y nodejs npm nginx

# 安裝 PM2（進程管理）
sudo npm install -g pm2
```

### 3. 部署應用

```bash
# 克隆倉庫
git clone https://github.com/TongJane0512/inverse-monopoly-game.git
cd inverse-monopoly-game

# 後端
cd backend
npm install
pm2 start src/server.js --name "inverse-monopoly-api"

# 前端
cd ../frontend
npm install
npm run build
```

### 4. 配置 Nginx

創建 `/etc/nginx/sites-available/inverse-monopoly`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 後端 API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

啟用站點：
```bash
sudo ln -s /etc/nginx/sites-available/inverse-monopoly /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. 配置 SSL（Let's Encrypt）

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 📊 監控和維護

### PM2 監控

```bash
# 查看進程
pm2 list

# 查看日誌
pm2 logs inverse-monopoly-api

# 監控
pm2 monit
```

### 數據庫備份

```bash
# MongoDB 備份
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/inverse-monopoly" --out=./backup

# 恢復
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/inverse-monopoly" ./backup
```

---

## 🔒 安全配置

### 1. HTTPS 配置

確保所有流量都通過 HTTPS。

### 2. CORS 配置

```javascript
const allowedOrigins = [
  'https://inverse-monopoly.vercel.app',
  'https://your-domain.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### 3. 防火牆規則

```bash
# 只允許特定端口
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 📈 性能優化

### 前端

1. 啟用 Gzip 壓縮
2. 使用 CDN（CloudFlare）
3. 代碼分割和懶加載
4. 圖像優化

### 後端

1. 使用連接池
2. 啟用緩存（Redis）
3. 負載均衡
4. 數據庫索引優化

---

## ✅ 部署檢查清單

- [ ] 所有環境變量已設置
- [ ] MongoDB 已配置和備份
- [ ] API 金鑰已設置
- [ ] SSL 證書已安裝
- [ ] CORS 已正確配置
- [ ] 性能測試已完成
- [ ] 安全掃描已完成
- [ ] 監控已啟用
- [ ] 備份計劃已制定
- [ ] 故障恢復計劃已制定

---

## 🆘 故障排除

### 應用無法啟動

```bash
# 檢查日誌
pm2 logs
heroku logs --tail
```

### 數據庫連接失敗

- 檢查連接字符串
- 確認 IP 白名單
- 驗證用戶權限

### 高延遲

- 檢查服務器資源
- 優化數據庫查詢
- 考慮擴展

---

**部署完成！祝賀你的平台現已上線！** 🎉
