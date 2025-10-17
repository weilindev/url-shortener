# URL Shortener Server

基於 Express.js 建立的 URL Shortener 後端服務。

## 專案結構

```
server/
├── src/
│   ├── config/          # 設定檔案
│   ├── controllers/     # 控制器
│   ├── middlewares/     # 中介軟體
│   ├── models/          # 資料模型
│   ├── routes/          # 路由
│   └── index.js         # 應用程式入口
├── .env.example         # 環境變數範例
├── .gitignore
├── package.json
└── README.md
```

## 開始使用

### 安裝依賴

```bash
pnpm install
```

### 環境設定

複製 `.env.example` 為 `.env` 並設定環境變數：

```bash
cp .env.example .env
```

### 執行開發伺服器

```bash
pnpm dev
```

### 執行正式環境

```bash
pnpm start
```

## API 端點

- `GET /health` - 健康檢查
- `GET /api` - API 歡迎訊息

## 技術堆疊

- **Express.js** - Web 框架
- **TypeScript** - 型別安全的 JavaScript
- **CORS** - 跨域資源共享
- **dotenv** - 環境變數管理
- **tsx** - TypeScript 執行器與監視器 (dev dependency)

## 開發工具

### 可用指令

```bash
# 開發伺服器（自動重載）
pnpm dev

# 型別檢查
pnpm type-check

# 建置專案
pnpm build

# 正式環境執行（需先建置）
pnpm start

# 程式碼檢查
pnpm run lint

# 自動修復程式碼問題
pnpm run lint:fix

# 格式化程式碼
pnpm run format

# 檢查程式碼格式
pnpm run format:check
```

### Code Quality Tools

本專案已配置以下程式碼品質工具：

- **Prettier** - 程式碼格式化工具
- **ESLint** - 程式碼檢查工具（TypeScript ESLint）
- **lint-staged** - Git staged 檔案檢查
- **Husky** - Git hooks 管理

#### Git Hooks

專案已設定 pre-commit hook，在每次 commit 前會自動：
1. 對 staged 的 TypeScript 檔案執行 ESLint 並自動修復
2. 對 staged 的檔案執行 Prettier 格式化

如果檢查失敗，commit 將被阻止。

#### 配置檔案

- `.prettierrc` - Prettier 配置
- `.prettierignore` - Prettier 忽略檔案
- `eslint.config.js` - ESLint 配置（Flat Config 格式）
- `.lintstagedrc` - lint-staged 配置
- `../.husky/pre-commit` - pre-commit hook（位於專案根目錄）

## 開發說明

本專案使用 TypeScript 與 ES Modules (ESM) 格式。

**重要**：在 TypeScript 原始碼中 import 其他 TypeScript 檔案時，必須使用 `.js` 副檔名（而非 `.ts`），因為 TypeScript 會將這些解析為編譯後的 JavaScript 檔案：

```typescript
// 正確 - 使用 .js 副檔名
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

// 錯誤 - 會失敗
import routes from './routes/index';
import routes from './routes/index.ts';
```
