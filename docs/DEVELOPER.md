# 🎓 開發者指南

## 📚 目錄

1. [項目結構](#項目結構)
2. [編碼規範](#編碼規範)
3. [Git 工作流](#git-工作流)
4. [測試](#測試)
5. [常見問題](#常見問題)

---

## 📁 項目結構

### 後端結構

```
backend/
├── src/
│   ├── models/              # MongoDB 數據模型
│   │   ├── User.js
│   │   ├── Family.js
│   │   ├── Game.js
│   │   ├── Task.js
│   │   └── TaskSubmission.js
│   ├── controllers/         # 業務邏輯控制器
│   │   ├── authController.js
│   │   ├── familyController.js
│   │   ├── gameController.js
│   │   ├── taskController.js
│   │   ├── videoController.js
│   │   └── adminController.js
│   ├── routes/              # API 路由定義
│   │   ├── auth.js
│   │   ├── family.js
│   │   ├── game.js
│   │   ├── task.js
│   │   ├── video.js
│   │   └── admin.js
│   ├── middleware/          # 中間件（認證、錯誤處理）
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/            # 業務服務層（可擴展）
│   ├── config/              # 配置文件
│   └── server.js            # 應用入口
├── .env.example             # 環境變量示例
├── package.json
└── README.md
```

### 前端結構

```
frontend/
├── src/
│   ├── components/          # 可復用組件
│   │   ├── ProtectedRoute.jsx
│   │   └── NotificationContainer.jsx
│   ├── pages/               # 頁面組件
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── FamilyGame/
│   │   │   ├── GameBoard.jsx
│   │   │   └── TaskDetail.jsx
│   │   └── AdminDashboard/
│   │       ├── Overview.jsx
│   │       ├── LiveMap.jsx
│   │       └── SubmissionReview.jsx
│   ├── services/            # API 服務層
│   │   └── api.js
│   ├── store/               # 狀態管理（Zustand）
│   │   └── index.js
│   ├── styles/              # 全局樣式
│   │   └── index.css
│   ├── App.jsx              # 主應用組件
│   └── main.jsx             # 應用入口
├── public/                  # 靜態資源
├── index.html
├── vite.config.js           # Vite 配置
├── tailwind.config.js       # Tailwind 配置
└── package.json
```

---

## 📝 編碼規範

### JavaScript/Node.js

#### 命名規範

```javascript
// 常量：UPPER_SNAKE_CASE
const MAX_FAMILIES = 10;
const API_BASE_URL = 'http://localhost:5000/api';

// 變量和函數：camelCase
const userName = 'John';
function getUserProfile() { }

// 類：PascalCase
class UserManager { }

// 私有方法：下劃線前綴
function _validateEmail(email) { }
```

#### 代碼風格

```javascript
// ✅ 好的例子
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// ❌ 不好的例子
const getuserid = async (uid) => {
  const u = await User.findById(uid);
  return u;
};
```

### React 組件

#### 函數式組件

```javascript
// ✅ 好的例子
export const TaskCard = ({ task, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(task.id);
      addNotification({
        type: 'success',
        message: 'Task submitted!'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="font-bold">{task.title}</h3>
      <button
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};
```

---

## 🔄 Git 工作流

### 分支命名規範

```
main                    # 生產分支
dev                     # 開發分支
feature/user-auth      # 功能分支
bugfix/login-error     # 修復分支
hotfix/api-crash       # 緊急修復
```

### 提交信息規範

```
feat: 添加用戶認證功能
fix: 修復登錄頁面錯誤
docs: 更新 API 文檔
style: 調整代碼格式
refactor: 重構家庭控制器
test: 添加任務測試用例
chore: 更新依賴版本
```

### 工作流程

```bash
# 1. 創建功能分支
git checkout -b feature/new-feature

# 2. 進行開發
git add .
git commit -m "feat: add new feature"

# 3. 推送到遠程
git push origin feature/new-feature

# 4. 創建 Pull Request
# 在 GitHub 上創建 PR

# 5. 合併到開發分支
# 代碼審查後合併

# 6. 更新本地
git pull origin dev
git branch -d feature/new-feature
```

---

## 🧪 測試

### 後端單元測試

```bash
# 安裝 Jest
npm install --save-dev jest

# 運行測試
npm test
```

**示例測試：**

```javascript
// tests/auth.test.js
describe('Authentication', () => {
  test('should register user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const response = await register(userData);
    expect(response.status).toBe(201);
    expect(response.data.token).toBeDefined();
  });

  test('should reject duplicate email', async () => {
    // 測試代碼
  });
});
```

### 前端組件測試

```bash
# 安裝 Vitest
npm install --save-dev vitest @testing-library/react
```

---

## ❓ 常見問題

### Q1: 如何添加新的 API 端點？

**A:** 按以下步驟：

1. 在 `models/` 中定義數據模型
2. 在 `controllers/` 中編寫業務邏輯
3. 在 `routes/` 中定義路由
4. 在 `services/api.js` 中添加前端調用

```javascript
// 1. 控制器
export const getStats = async (req, res) => {
  try {
    const stats = await calculateStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. 路由
router.get('/stats', getStats);

// 3. 前端服務
export const statsService = {
  getStats: () => api.get('/stats')
};
```

### Q2: 如何調試前端應用？

**A:** 使用 React DevTools 和瀏覽器開發者工具：

```javascript
// 添加調試日誌
console.log('State:', state);
console.table(data);

// 設置斷點
debugger;
```

### Q3: 如何優化性能？

**A:** 常用技巧：

```javascript
// 1. 使用 React.memo 避免不必要重新渲染
const TaskCard = React.memo(({ task }) => {
  return <div>{task.title}</div>;
});

// 2. 使用 useCallback 優化回調
const handleClick = useCallback(() => {
  // 處理點擊
}, [dependency]);

// 3. 使用 useMemo 緩存計算結果
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);
```

### Q4: 如何連接 Redis 緩存？

**A:** 安裝和配置：

```bash
npm install redis
```

```javascript
import redis from 'redis';

const client = redis.createClient();

// 使用緩存
const getCachedData = async (key) => {
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetchData();
  await client.set(key, JSON.stringify(data), 'EX', 3600);
  return data;
};
```

---

## 📚 其他資源

- [Express.js 官方文檔](https://expressjs.com/)
- [React 官方文檔](https://react.dev/)
- [MongoDB 官方文檔](https://docs.mongodb.com/)
- [Zustand 文檔](https://github.com/pmndrs/zustand)
- [Tailwind CSS 文檔](https://tailwindcss.com/)

---

**祝你開發愉快！** 🚀
