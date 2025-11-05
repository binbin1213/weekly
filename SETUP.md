# 科技爱好者周刊 - 自动化部署指南

## 📋 项目说明

本项目是对阮一峰老师《科技爱好者周刊》的自动化改造版本，实现了：

- ✅ 自动同步上游仓库更新（每周五一次，与发布时间同步）
- ✅ 静态网站自动生成和部署
- ✅ RSS/Atom/JSON Feed 自动生成
- ✅ 全文搜索功能
- ✅ 响应式设计和深色模式

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

```bash
npm run dev
```

访问 `http://localhost:5173` 查看网站

### 3. 构建网站

```bash
npm run build
```

### 4. 预览构建结果

```bash
npm run preview
```

## 📡 部署方式

### 选项 1: 部署到 GitHub Pages

#### 步骤 1: 配置仓库设置

1. 进入你的 GitHub 仓库
2. 点击 **Settings** > **Pages**
3. **Source** 选择 **GitHub Actions**

#### 步骤 2: 推送代码

```bash
git add .
git commit -m "Setup automated weekly site"
git push origin master
```

GitHub Actions 会自动构建并部署网站。

#### 步骤 3: 访问网站

部署完成后，访问：`https://your-username.github.io/weekly/`

---

### 选项 2: 部署到 Vercel（推荐）

#### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 步骤 2: 登录 Vercel

```bash
vercel login
```

#### 步骤 3: 部署

```bash
vercel
```

首次部署时，Vercel 会询问一些问题：
- **Set up and deploy**: 选择 `Y`
- **Which scope**: 选择你的账户
- **Link to existing project**: 选择 `N`
- **Project name**: 输入项目名称
- **Directory**: 直接回车（使用当前目录）

#### 步骤 4: 生产环境部署

```bash
vercel --prod
```

#### 步骤 5: 配置自动部署（可选）

如果要使用 GitHub Actions 自动部署到 Vercel：

1. 在 Vercel Dashboard 获取以下信息：
   - **Vercel Token**: Settings > Tokens
   - **Org ID**: Settings > General
   - **Project ID**: 项目设置页面

2. 在 GitHub 仓库添加 Secrets：
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

3. 启用 `.github/workflows/deploy-vercel.yml` 工作流

---

### 选项 3: 部署到 Cloudflare Pages

#### 步骤 1: 登录 Cloudflare Dashboard

访问 [Cloudflare Pages](https://pages.cloudflare.com/)

#### 步骤 2: 创建新项目

1. 点击 **Create a project**
2. 连接你的 GitHub 仓库
3. 配置构建设置：
   - **Build command**: `npm run build && npm run generate-rss`
   - **Build output directory**: `.vitepress/dist`

#### 步骤 3: 部署

点击 **Save and Deploy**，Cloudflare 会自动构建和部署。

---

## 🔄 自动同步配置

### GitHub Actions 自动同步

项目已配置 `.github/workflows/sync-upstream.yml`，会：
- 每周五自动检查上游更新（与周刊发布时间同步）
- 自动合并更新到你的仓库
- 支持手动触发同步

### 手动触发同步

1. 进入 GitHub 仓库
2. 点击 **Actions**
3. 选择 **同步上游仓库** 工作流
4. 点击 **Run workflow**

### 本地手动同步

```bash
# 添加上游仓库
git remote add upstream https://github.com/ruanyf/weekly.git

# 获取上游更新
git fetch upstream

# 合并更新
git merge upstream/master

# 推送到你的仓库
git push origin master
```

---

## 📡 RSS Feed 配置

### 生成 RSS Feed

RSS Feed 会在构建时自动生成，包含三种格式：
- `feed.xml` - RSS 2.0
- `atom.xml` - Atom
- `feed.json` - JSON Feed

### 手动生成 RSS

```bash
npm run generate-rss
```

### 配置网站 URL

编辑 `.github/workflows/deploy.yml`，设置环境变量：

```yaml
env:
  SITE_URL: https://your-domain.com
```

或在本地创建 `.env` 文件：

```env
SITE_URL=https://your-domain.com
```

---

## ⚙️ 自定义配置

### 修改网站标题和描述

编辑 `.vitepress/config.ts`：

```typescript
export default defineConfig({
  title: '你的标题',
  description: '你的描述',
  // ...
})
```

### 修改主题颜色

编辑 `.vitepress/theme/custom.css`：

```css
:root {
  --vp-c-brand: #646cff;  /* 修改主色调 */
}
```

### 修改首页内容

编辑 `index.md`

### 修改侧边栏生成逻辑

编辑 `.vitepress/theme/sidebar.ts`

---

## 🔧 常见问题

### Q1: 构建失败怎么办？

检查 Node.js 版本是否 >= 18：
```bash
node --version
```

如果版本过低，请升级 Node.js。

### Q2: 如何关闭自动同步？

删除或禁用 `.github/workflows/sync-upstream.yml` 文件。

### Q3: 如何修改同步频率？

编辑 `.github/workflows/sync-upstream.yml`：
```yaml
schedule:
  - cron: '0 */12 * * *'  # 改为每 12 小时
```

### Q4: RSS Feed 中的图片无法显示

确保在环境变量中设置了正确的 `SITE_URL`。

### Q5: 搜索功能不工作

VitePress 的本地搜索需要完整构建后才能使用，在开发模式下可能不完整。

---

## 📚 技术栈

- **框架**: VitePress 1.5+
- **语言**: TypeScript
- **部署**: GitHub Actions / Vercel / Cloudflare Pages
- **RSS**: feed npm 包
- **CI/CD**: GitHub Actions

---

## 🙏 致谢

- 原作者：[阮一峰](https://www.ruanyifeng.com/)
- 原仓库：[ruanyf/weekly](https://github.com/ruanyf/weekly)

---

## 📄 许可证

本项目遵循 MIT 许可证。原周刊内容版权归阮一峰老师所有。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📧 联系方式

如有问题，欢迎提交 [GitHub Issue](https://github.com/your-username/weekly/issues)。

