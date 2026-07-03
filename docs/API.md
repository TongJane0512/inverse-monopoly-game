# 🎮 逆境大富翁 API 文檔

## 📋 目錄

1. [認證 API](#認證-api)
2. [家庭 API](#家庭-api)
3. [遊戲 API](#遊戲-api)
4. [任務 API](#任務-api)
5. [影片評審 API](#影片評審-api)
6. [後台管理 API](#後台管理-api)

---

## 認證 API

### 1. 用戶註冊

**POST** `/api/auth/register`

**請求體：**
```json
{
  "email": "family@example.com",
  "password": "password123",
  "name": "Smith Family",
  "phone": "+853 6xxx xxxx"
}
```

**成功回應 (201)：**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "family@example.com",
    "name": "Smith Family",
    "phone": "+853 6xxx xxxx",
    "role": "family",
    "isActive": true
  }
}
```

---

### 2. 用戶登錄

**POST** `/api/auth/login`

**請求體：**
```json
{
  "email": "family@example.com",
  "password": "password123"
}
```

**成功回應 (200)：**
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "family@example.com",
    "name": "Smith Family",
    "role": "family"
  }
}
```

---

### 3. 獲取當前用戶

**GET** `/api/auth/me`

**請求頭：**
```
Authorization: Bearer {token}
```

**成功回應 (200)：**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "family@example.com",
  "name": "Smith Family",
  "phone": "+853 6xxx xxxx",
  "role": "family",
  "isActive": true
}
```

---

### 4. 更新個人資料

**PUT** `/api/auth/profile`

**請求頭：**
```
Authorization: Bearer {token}
```

**請求體：**
```json
{
  "name": "Smith Family Updated",
  "phone": "+853 6xxx xxxx",
  "profileImage": "https://example.com/image.jpg"
}
```

**成功回應 (200)：**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

## 家庭 API

### 1. 創建家庭檔案

**POST** `/api/family`

**請求頭：**
```
Authorization: Bearer {token}
```

**請求體：**
```json
{
  "familyName": "Smith Family",
  "members": [
    {
      "name": "John Smith",
      "age": 45,
      "role": "parent"
    },
    {
      "name": "Jane Smith",
      "age": 42,
      "role": "parent"
    },
    {
      "name": "Tom Smith",
      "age": 12,
      "role": "child"
    }
  ],
  "gameId": "507f1f77bcf86cd799439012"
}
```

**成功回應 (201)：**
```json
{
  "message": "Family profile created successfully",
  "family": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "familyName": "Smith Family",
    "members": [ ... ],
    "gameId": "507f1f77bcf86cd799439012",
    "believeValue": 0,
    "properties": [],
    "status": "registered"
  }
}
```

---

### 2. 獲取家庭檔案

**GET** `/api/family`

**請求頭：**
```
Authorization: Bearer {token}
```

**成功回應 (200)：**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "familyName": "Smith Family",
  "believeValue": 150,
  "properties": [ ... ],
  "status": "in_progress"
}
```

---

### 3. 更新位置

**PUT** `/api/family/location`

**請求頭：**
```
Authorization: Bearer {token}
```

**請求體：**
```json
{
  "latitude": 22.2008,
  "longitude": 113.5439
}
```

**成功回應 (200)：**
```json
{
  "message": "Location updated",
  "family": { ... }
}
```

---

### 4. 獲取排行榜

**GET** `/api/family/rankings?gameId={gameId}`

**成功回應 (200)：**
```json
[
  {
    "rank": 1,
    "familyName": "Smith Family",
    "user": "John Smith",
    "believeValue": 500,
    "propertiesCount": 8,
    "tasksCompleted": 12
  },
  {
    "rank": 2,
    "familyName": "Johnson Family",
    "user": "Mike Johnson",
    "believeValue": 450,
    "propertiesCount": 7,
    "tasksCompleted": 11
  }
]
```

---

## 遊戲 API

### 1. 獲取所有遊戲

**GET** `/api/game`

**成功回應 (200)：**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "逆境大富翁 - 澳門大潭山郊野公園",
    "status": "in_progress",
    "startTime": "2024-01-15T09:00:00Z",
    "endTime": "2024-01-15T17:00:00Z",
    "location": {
      "name": "澳門大潭山郊野公園",
      "latitude": 22.2008,
      "longitude": 113.5439
    },
    "maxFamilies": 10,
    "registeredFamilies": 8,
    "properties": [ ... ]
  }
]
```

---

### 2. 按 ID 獲取遊戲

**GET** `/api/game/{gameId}`

**成功回應 (200)：**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "逆境大富翁",
  "description": "...",
  "status": "in_progress",
  "properties": [ ... ],
  "registeredFamilies": [ ... ]
}
```

---

### 3. 家庭註冊遊戲

**POST** `/api/game/register`

**請求頭：**
```
Authorization: Bearer {token}
```

**請求體：**
```json
{
  "gameId": "507f1f77bcf86cd799439012"
}
```

**成功回應 (200)：**
```json
{
  "message": "Family registered successfully",
  "game": { ... }
}
```

---

### 4. 遊戲統計

**GET** `/api/game/{gameId}/stats`

**成功回應 (200)：**
```json
{
  "totalFamilies": 8,
  "totalBelieveValue": 2500,
  "averageBelieveValue": 312.5,
  "propertiesAcquired": 45,
  "tasksCompleted": 78
}
```

---

## 任務 API

### 1. 創建任務 (僅限管理員)

**POST** `/api/task`

**請求頭：**
```
Authorization: Bearer {token}
(需要管理員角色)
```

**請求體：**
```json
{
  "gameId": "507f1f77bcf86cd799439012",
  "title": "幫助老人過馬路",
  "description": "展現同情心，幫助需要幫助的人。記錄一段你的家人幫助老人安全過馬路的視頻。",
  "taskType": "crisis",
  "beliefRequired": "compassion",
  "believeValueReward": 15,
  "requiresVideo": true,
  "requiresPhoto": false,
  "requiresAnswer": false,
  "scheduledTime": "2024-01-15T10:00:00Z",
  "expiresAt": "2024-01-15T11:00:00Z"
}
```

**成功回應 (201)：**
```json
{
  "message": "Task created successfully",
  "task": { ... }
}
```

---

### 2. 獲取我的任務

**GET** `/api/task/my-tasks`

**請求頭：**
```
Authorization: Bearer {token}
```

**成功回應 (200)：**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "title": "幫助老人過馬路",
    "description": "...",
    "taskType": "crisis",
    "believeValueReward": 15,
    "submitted": false,
    "submissionStatus": null
  },
  {
    "_id": "507f1f77bcf86cd799439015",
    "title": "探訪孤寡老人",
    "description": "...",
    "submitted": true,
    "submissionStatus": "pending"
  }
]
```

---

### 3. 提交任務

**POST** `/api/task/submit`

**請求頭：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**請求體：**
```json
{
  "taskId": "507f1f77bcf86cd799439014",
  "videoUrl": "https://s3.amazonaws.com/bucket/video.mp4",
  "photoUrls": [
    "https://s3.amazonaws.com/bucket/photo1.jpg"
  ],
  "textAnswer": "我們的家人一起幫助了一位老奶奶安全過馬路..."
}
```

**成功回應 (201)：**
```json
{
  "message": "Task submitted successfully",
  "submission": {
    "_id": "507f1f77bcf86cd799439020",
    "taskId": "507f1f77bcf86cd799439014",
    "familyId": "507f1f77bcf86cd799439013",
    "videoUrl": "https://s3.amazonaws.com/bucket/video.mp4",
    "reviewStatus": "pending",
    "submittedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 影片評審 API

### 1. 評審提交

**POST** `/api/video/review`

**請求頭：**
```
Authorization: Bearer {token}
(需要管理員角色)
```

**請求體：**
```json
{
  "submissionId": "507f1f77bcf86cd799439020",
  "reviewStatus": "approved",
  "adminNotes": "很好的示範。這個家庭展現了真正的同情心。",
  "believeValueAwarded": 15
}
```

**成功回應 (200)：**
```json
{
  "message": "Submission reviewed",
  "submission": {
    "_id": "507f1f77bcf86cd799439020",
    "reviewStatus": "approved",
    "believeValueAwarded": 15,
    "reviewedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### 2. 獲取待審提交

**GET** `/api/video/pending?gameId={gameId}`

**請求頭：**
```
Authorization: Bearer {token}
(需要管理員角色)
```

**成功回應 (200)：**
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "familyId": {
      "_id": "507f1f77bcf86cd799439013",
      "familyName": "Smith Family"
    },
    "taskId": {
      "_id": "507f1f77bcf86cd799439014",
      "title": "幫助老人過馬路"
    },
    "videoUrl": "https://s3.amazonaws.com/bucket/video.mp4",
    "submittedAt": "2024-01-15T10:30:00Z"
  }
]
```

---

## 後台管理 API

### 1. 獲取儀表板統計

**GET** `/api/admin/dashboard?gameId={gameId}`

**請求頭：**
```
Authorization: Bearer {token}
(需要管理員角色)
```

**成功回應 (200)：**
```json
{
  "totalFamilies": 8,
  "activeFamilies": 7,
  "completedFamilies": 1,
  "totalTasks": 24,
  "activeTasks": 5,
  "totalSubmissions": 78,
  "pendingReviews": 12,
  "approvedSubmissions": 60,
  "totalBelieveValue": 2500,
  "averageBelieveValue": 312.5
}
```

---

### 2. 獲取所有家庭

**GET** `/api/admin/families?gameId={gameId}&page=1&limit=10`

**請求頭：**
```
Authorization: Bearer {token}
(需要管理員角色)
```

**成功回應 (200)：**
```json
{
  "families": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "familyName": "Smith Family",
      "believeValue": 500,
      "status": "in_progress",
      "userId": {
        "name": "John Smith",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "total": 8,
    "page": 1,
    "pages": 1
  }
}
```

---

### 3. 獲取實時位置

**GET** `/api/admin/locations?gameId={gameId}`

**請求頭：**
```
Authorization: Bearer {token}
(需要管理員角色)
```

**成功回應 (200)：**
```json
[
  {
    "familyId": "507f1f77bcf86cd799439013",
    "familyName": "Smith Family",
    "latitude": 22.2008,
    "longitude": 113.5439,
    "believeValue": 500,
    "status": "in_progress"
  }
]
```

---

### 4. 發送通知

**POST** `/api/admin/notify`

**請求頭：**
```
Authorization: Bearer {token}
(需要管理員角色)
```

**請求體：**
```json
{
  "familyIds": ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"],
  "title": "新的危機任務",
  "message": "一位老人需要幫助過馬路！",
  "taskId": "507f1f77bcf86cd799439014"
}
```

**成功回應 (200)：**
```json
{
  "message": "Notification sent successfully",
  "sentTo": 2,
  "details": {
    "title": "新的危機任務",
    "message": "一位老人需要幫助過馬路！",
    "timestamp": "2024-01-15T11:00:00Z"
  }
}
```

---

## 錯誤回應

### 400 - 請求錯誤
```json
{
  "message": "Validation error",
  "errors": ["Email is required", "Password must be at least 6 characters"]
}
```

### 401 - 未授權
```json
{
  "message": "Invalid token"
}
```

### 403 - 禁止
```json
{
  "message": "Admin access required"
}
```

### 404 - 未找到
```json
{
  "message": "Family not found"
}
```

### 500 - 服務器錯誤
```json
{
  "message": "Internal server error"
}
```

---

## 認證

所有受保護的端點都需要在請求頭中包含 JWT 令牌：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

令牌通過登錄或註冊獲得，並應存儲在客戶端的本地存儲中。

---

## 分頁

支持分頁的端點接受以下查詢參數：

- `page` - 頁碼（默認：1）
- `limit` - 每頁項目數（默認：10，最大：100）

**示例：**
```
GET /api/admin/families?gameId=507f1f77bcf86cd799439012&page=2&limit=20
```

---

## 實時通信 (Socket.io)

### 連接
```javascript
const socket = io('http://localhost:5001');
```

### 事件

**加入遊戲：**
```javascript
socket.emit('join-game', {
  gameId: '507f1f77bcf86cd799439012',
  familyId: '507f1f77bcf86cd799439013',
  familyName: 'Smith Family'
});
```

**位置更新：**
```javascript
socket.emit('location-update', {
  gameId: '507f1f77bcf86cd799439012',
  familyId: '507f1f77bcf86cd799439013',
  latitude: 22.2008,
  longitude: 113.5439
});
```

**接收通知：**
```javascript
socket.on('notification', (data) => {
  console.log('New notification:', data.message);
});
```

---

## 速率限制

API 對每個 IP 地址實施速率限制：

- 認證端點：每分鐘 5 次請求
- 一般端點：每分鐘 100 次請求
- 管理員端點：每分鐘 50 次請求

超過限制時，會收到 429 Too Many Requests 回應。
