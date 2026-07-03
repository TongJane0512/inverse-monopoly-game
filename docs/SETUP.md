# 🚀 安裝和部署指南

## 📋 前置要求

### 系統要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0
- MongoDB Atlas 帳戶
- Google Maps API Key
- AWS S3 或 Firebase 帳戶（用於視���上傳）

### 開發工具
- Git
- VS Code（推薦）
- Postman（用於 API 測試）

---

## 🔧 本地安裝

### 1. 克隆倉庫

```bash
git clone https://github.com/TongJane0512/inverse-monopoly-game.git
cd inverse-monopoly-game
```

### 2. 後端設置

#### 2.1 進入後端目錄
```bash
cd backend
```

#### 2.2 安裝依賴
```bash
npm install
```

#### 2.3 配置環境變量

複製 `.env.example` 為 `.env`：
```bash
cp .env.example .env
```

編輯 `.env` 文件，填寫以下內容：

```env
# MongoDB 連接
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inverse-monopoly?retryWrites=true&w=majority

# JWT 配置
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# 服務器
PORT=5000
NODE_ENV=development
HOST=0.0.0.0

# Socket.io
SOCKET_PORT=5001
SOCKET_CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# AWS S3
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=inverse-monopoly-videos
AWS_S3_URL=https://inverse-monopoly-videos.s3.ap-southeast-1.amazonaws.com

# Email（可選）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@inverse-monopoly.com
```

#### 2.4 啟動後端服務器

**開發模式（帶自動重載）：**
```bash
npm run dev
```

**生產模式：**
```bash
npm start
```

✅ 後端應在 `http://localhost:5000` 運行

---

### 3. 前端設置

#### 3.1 打開新終端，進入前端目錄
```bash
cd frontend
```

#### 3.2 安裝依賴
```bash
npm install
```

#### 3.3 配置環境變量

複製 `.env.example` 為 `.env`：
```bash
cp .env.example .env
```

編輯 `.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5001
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_APP_ENV=development
```

#### 3.4 啟動前端開發服務器

```bash
npm run dev
```

✅ 前端應在 `http://localhost:5173` 運行

---

## 📝 配置 MongoDB Atlas

### 1. 創建帳戶
- 訪問 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- 創建免費帳戶

### 2. 創建集群
1. 創建新項目
2. 點擊「Create Cluster」
3. 選擇「M0 Sandbox」（免費層）
4. 選擇地區（推薦：Singapore）
5. 創建集群（約需 3-5 分鐘）

### 3. 創建數據庫用戶
1. 進入「Database Access」
2. 點擊「Add New Database User」
3. 輸入用戶名和密碼
4. 點擊「Add User」

### 4. 配置網絡訪問
1. 進入「Network Access」
2. 點擊「Add IP Address」
3. 選擇「Allow access from anywhere」（開發環境）
4. 點擊「Confirm"

### 5. 獲取連接字符串
1. 點擊「Connect」按鈕
2. 選擇「Connect your application"
3. 複製連接字符串
4. 將其粘貼到 `.env` 的 `MONGODB_URI`

---

## 🔑 配置 Google Maps

### 1. 創建 Google Cloud 項目
1. 訪問 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新項目
3. 命名為 "Inverse Monopoly Game"

### 2. 啟用 API
1. 進入「APIs & Services」> 「Library"
2. 搜索以下 API 並啟用：
   - Maps JavaScript API
   - Geolocation API
   - Places API

### 3. 創建 API Key
1. 進入「Credentials"
2. 點擊「Create Credentials" > "API key"
3. 複製 API Key
4. 將其添加到 `.env` 文件

### 4. 設置 API 限制（可選但推薦）
1. 編輯 API Key
2. 設置 "HTTP referrers" 為您的域名

---

## 📤 配置 AWS S3（視頻上傳）

### 1. 創建 AWS 帳戶
- 訪問 [AWS Console](https://aws.amazon.com/console/)

### 2. 創建 S3 Bucket
1. 進入 S3 服務
2. 點擊「Create Bucket"
3. 命名為 `inverse-monopoly-videos`
4. 選擇地區（推薦：ap-southeast-1）
5. 取消勾選「Block Public Access"
6. 點擊「Create Bucket"

### 3. 配置 CORS

在 Bucket 設置中，進入「CORS" 並添加：

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 4. 創建 IAM 用戶
1. 進入 IAM 服務
2. 點擊「Users" > "Add user"
3. 用戶名：`inverse-monopoly-app`
4. 選擇「Programmatic access"
5. 附加策略：搜索 "AmazonS3FullAccess"
6. 完成創建並複製 Access Key ID 和 Secret Access Key
7. 將其添加到 `.env` 文件

---

## 🧪 測試

### 後端 API 測試

使用 Postman 或 cURL 測試 API：

```bash
# 測試健康檢查
curl http://localhost:5000/api/health

# 測試用戶註冊
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 前端測試

打開瀏覽器訪問 `http://localhost:5173`：

1. 註冊新帳戶
2. 登錄
3. 創建家庭檔案
4. 查看遊戲列表

---

## 🚀 生產部署

### 選項 1：Heroku 部署

#### 後端

1. 安裝 Heroku CLI
```bash
npm install -g heroku
```

2. 登錄
```bash
heroku login
```

3. 創建應用
```bash
cd backend
heroku create inverse-monopoly-api
```

4. 設置環境變量
```bash
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_secret_key"
# ... 設置其他變量
```

5. 部署
```bash
git push heroku main
```

#### 前端

1. 構建前端
```bash
cd frontend
npm run build
```

2. 部署到 Vercel

```bash
npm install -g vercel
vercel
```

### 選項 2：Docker 部署

#### 創建 Docker 映像

**後端 Dockerfile：**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**前端 Dockerfile：**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 構建和運行

```bash
# 後端
cd backend
docker build -t inverse-monopoly-api .
docker run -p 5000:5000 inverse-monopoly-api

# 前端
cd frontend
docker build -t inverse-monopoly-web .
docker run -p 80:80 inverse-monopoly-web
```

---

## 🔐 安全檢查清單

- [ ] 所有敏感信息都在環境變量中
- [ ] JWT_SECRET 已更改為強密鑰
- [ ] CORS 已正確配置
- [ ] 數據庫已啟用身份驗證
- [ ] 生產環境已使用 HTTPS
- [ ] API 速率限制已啟用
- [ ] 日誌已配置
- [ ] 備份已設置

---

## 📊 監控和日誌

### 後端日誌

```bash
# 查看實時日誌
npm run dev 2>&1 | tee app.log

# 使用 PM2 進行進程管理
npm install -g pm2
pm2 start src/server.js --name "inverse-monopoly-api"
pm2 logs inverse-monopoly-api
```

### 前端錯誤追蹤

考慮集成 Sentry 或類似的錯誤追蹤服務。

---

## 🆘 故障排除

### MongoDB 連接失敗

- 確保 IP 地址已添加到 MongoDB Atlas 網絡訪問
- 檢查用戶名和密碼是否正確
- 驗證集群是否仍在運行

### API 連接失敗

- 確保後端服務器正在運行
- 檢查 CORS 設置
- 驗證 API 基礎 URL 正確

### 視頻上傳失敗

- 確保 AWS 憑證正確
- 檢查 S3 Bucket 名稱
- 驗證 CORS 配置

---

## 📞 技術支持

如有問題，請：

1. 檢查本文檔
2. 查看 API 文檔 (`docs/API.md`)
3. 在 GitHub 上提交 Issue
4. 聯系開發團隊

---

**祝賀！你的逆境大富翁遊戲平台已準備好使用！** 🎉
