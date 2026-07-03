# 逆境大富翁 - Inverse Monopoly Game Platform

結合實體澳門大潭山郊野公園的實境解謎與 iPhone 定向遊戲平台。

## 📋 項目概述

- **家庭版網頁遊戲**：家庭進行 GPS 大富翁遊戲、領取任務、上傳影片、累積信念值
- **工作員後台版**：實時監控家庭進度、派發任務、管理信念值、分析結果

## 🚀 技術棧

- **前端**：React 18 + Vite + Tailwind CSS
- **後端**：Node.js + Express.js
- **數據庫**：MongoDB Atlas（雲端）
- **地位服務**：Google Maps API
- **文件上傳**：AWS S3 / Firebase Storage
- **實時通信**：Socket.io

## 📦 項目結構

```
inverse-monopoly-game/
├── backend/                      # Node.js + Express 後端
│   ├── src/
│   │   ├── models/              # MongoDB 數據模型
│   │   ├── controllers/         # 業務邏輯控制器
│   │   ├── routes/              # API 路由
│   │   ├── middleware/          # 中間件
│   │   ├── services/            # 服務層
│   │   ├── config/              # 配置文件
│   │   └── server.js            # 主服務器文件
│   ├── .env.example             # 環境變量示例
│   └── package.json
│
├── frontend/                     # React 前端應用
│   ├── src/
│   │   ├── components/          # 可復用組件
│   │   ├── pages/
│   │   │   ├── FamilyGame/      # 家庭版遊戲頁面
│   │   │   ├── AdminDashboard/  # 後台管理頁面
│   │   │   └── Login/           # 登錄頁面
│   │   ├── services/            # API 服務
│   │   ├── hooks/               # 自定義 Hook
│   │   ├── store/               # 狀態管理
│   │   ├── styles/              # 全局樣式
│   │   └── App.jsx              # 主應用入口
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
└── docs/                        # 文檔
    └── API.md                   # API 文檔
```

## 🔧 安裝與配置

### 前置要求
- Node.js >= 16
- MongoDB Atlas 帳戶
- Google Maps API Key
- AWS S3 或 Firebase 帳戶

### 後端安裝

```bash
cd backend
npm install
cp .env.example .env
# 編輯 .env 文件，填入配置
npm run dev
```

### 前端安裝

```bash
cd frontend
npm install
cp .env.example .env
# 編輯 .env 文件，填入配置
npm run dev
```

## 📱 功能清單

### 家庭版功能
- ✅ 家庭賬戶管理與登錄
- ✅ GPS 實時定位與大富翁棋盤顯示
- ✅ 地產爭奪與資源管理
- ✅ 逆境推送通知與任務領取
- ✅ 影片上傳與解難記錄
- ✅ 信念值累積顯示
- ✅ 終極 Boss 戰協作遊戲

### 後台版功能
- ✅ 家庭管理與狀態監控
- ✅ 實時地圖顯示所有家庭位置
- ✅ 任務派發與管理
- ✅ 影片審核與信念值評分
- ✅ 遊戲進度統計
- ✅ 結果分析與排行榜

## 📚 API 文檔

詳見 `docs/API.md`

## 🛠️ 開發指南

### 環境變量

#### 後端 (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inverse-monopoly
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key

# AWS S3
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=inverse-monopoly-videos

# Socket.io
SOCKET_PORT=5001

# Email (可選)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password
```

#### 前端 (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5001
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_APP_ENV=development
```

## 🎯 使用流程

### 家庭版流程
1. 家庭註冊與登錄
2. 進入遊戲，選擇出發
3. GPS 實時定位，顯示棋盤位置
4. 到達地點時自動解鎖「地產」
5. 隨機觸發「逆境」任務推送
6. 完成任務（錄製影片或完成挑戰）
7. 累積信念值
8. 終局參與 Boss 戰

### 後台版流程
1. 工作員登錄後台
2. 實時監控所有家庭位置
3. 根據需要派發特殊任務
4. 審核家庭上傳的影片
5. 評分信念值
6. 查看統計數據與排行

## 📞 支持

如有問題，請聯繫開發團隊。

## 📄 許可證

MIT