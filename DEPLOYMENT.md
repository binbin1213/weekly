# 🚀 一键部署指南

## 快速选择部署平台

| 平台 | 难度 | 速度 | 自定义域名 | 推荐指数 |
|------|------|------|-----------|---------|
| **Vercel** | ⭐ | ⚡⚡⚡ | ✅ 免费 | ⭐⭐⭐⭐⭐ |
| **GitHub Pages** | ⭐⭐ | ⚡⚡ | ✅ 免费 | ⭐⭐⭐⭐ |
| **Cloudflare Pages** | ⭐ | ⚡⚡⚡ | ✅ 免费 | ⭐⭐⭐⭐⭐ |
| **Netlify** | ⭐ | ⚡⚡⚡ | ✅ 免费 | ⭐⭐⭐⭐ |

---

## 🎯 方案一：Vercel（最推荐）

### 为什么选择 Vercel？
- ✅ 配置最简单，几乎零配置
- ✅ 全球 CDN，访问速度快
- ✅ 自动 HTTPS
- ✅ 每次提交自动部署
- ✅ 免费额度充足

### 步骤

#### 1. 使用 Vercel CLI（最快）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

#### 2. 使用 Vercel Dashboard（推荐新手）

1. 访问 [vercel.com](https://vercel.com/)
2. 点击 **Import Project**
3. 从 GitHub 导入你的仓库
4. Vercel 会自动检测 VitePress 项目
5. 点击 **Deploy**

就这么简单！✨

#### 3. 配置自定义域名（可选）

1. 在 Vercel Dashboard 进入项目设置
2. 点击 **Domains**
3. 添加你的域名
4. 按照提示配置 DNS 记录

---

## 🐙 方案二：GitHub Pages

### 步骤

#### 1. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** > **Pages**
3. **Source** 选择 **GitHub Actions**

#### 2. 推送代码

```bash
git add .
git commit -m "Setup automated weekly site"
git push origin master
```

#### 3. 等待部署

查看 **Actions** 标签页，等待部署完成（约 2-3 分钟）

#### 4. 访问网站

```
https://your-username.github.io/weekly/
```

#### 5. 配置自定义域名（可选）

在仓库设置的 **Pages** 页面：
1. 在 **Custom domain** 输入你的域名
2. 保存并配置 DNS CNAME 记录

---

## ☁️ 方案三：Cloudflare Pages

### 为什么选择 Cloudflare Pages？
- ✅ 全球 CDN，中国访问速度优秀
- ✅ 无限带宽
- ✅ 自动 HTTPS
- ✅ 与 GitHub 完美集成

### 步骤

#### 1. 登录 Cloudflare

访问 [pages.cloudflare.com](https://pages.cloudflare.com/)

#### 2. 创建项目

1. 点击 **Create a project**
2. 连接你的 GitHub 账户
3. 选择 `weekly` 仓库

#### 3. 配置构建

- **Build command**: `npm run build && npm run generate-rss`
- **Build output directory**: `.vitepress/dist`
- **Root directory**: `/`（默认）

#### 4. 部署

点击 **Save and Deploy**

#### 5. 自定义域名

在 Cloudflare Pages 项目中：
1. 点击 **Custom domains**
2. 添加域名
3. Cloudflare 会自动配置 DNS（如果域名在 Cloudflare）

---

## 🌐 方案四：Netlify

### 步骤

#### 1. 导入项目

1. 访问 [app.netlify.com](https://app.netlify.com/)
2. 点击 **Add new site** > **Import an existing project**
3. 连接 GitHub 并选择仓库

#### 2. 配置构建

- **Build command**: `npm run build && npm run generate-rss`
- **Publish directory**: `.vitepress/dist`

#### 3. 部署

点击 **Deploy site**

---

## 🔧 环境变量配置

所有平台都需要设置 `SITE_URL` 环境变量：

### Vercel
```bash
vercel env add SITE_URL
# 输入: https://your-domain.com
```

或在 Dashboard: **Settings** > **Environment Variables**

### GitHub Pages
在 `.github/workflows/deploy.yml` 中添加：
```yaml
env:
  SITE_URL: https://your-username.github.io/weekly
```

### Cloudflare Pages / Netlify
在项目设置的 **Environment variables** 中添加：
- **Key**: `SITE_URL`
- **Value**: `https://your-domain.com`

---

## 📋 部署检查清单

部署完成后，请检查：

- [ ] 网站可以正常访问
- [ ] 首页显示正常
- [ ] 可以打开任意一篇文章
- [ ] 搜索功能工作正常
- [ ] RSS Feed 可以访问（`/feed.xml`）
- [ ] 深色模式切换正常
- [ ] 移动端显示正常

---

## 🔄 持续部署

所有平台都已配置自动部署：

1. 每次推送到 `master` 分支
2. 自动触发构建
3. 构建成功后自动部署

### 查看部署状态

- **Vercel**: Dashboard > Deployments
- **GitHub Pages**: Actions 标签页
- **Cloudflare Pages**: 项目页面 > Deployments
- **Netlify**: Site overview > Deploys

---

## 🐛 常见问题

### Q: 部署失败怎么办？

1. 检查构建日志
2. 确认 Node.js 版本 >= 18
3. 本地运行 `npm run build` 测试

### Q: RSS Feed 404？

确保：
1. `SITE_URL` 环境变量已设置
2. 构建命令包含 `npm run generate-rss`
3. RSS 文件在 `.vitepress/dist/` 目录中

### Q: 图片不显示？

检查图片路径：
- 使用相对路径：`./image.png`
- 或绝对路径：`/docs/image.png`

### Q: 搜索不工作？

搜索功能需要完整构建，在生产环境才能完全正常。

---

## 💡 优化建议

### 1. 配置 CDN 加速

如果使用自定义域名，建议配置 CDN：
- Cloudflare（免费）
- 腾讯云 CDN
- 阿里云 CDN

### 2. 启用 Gzip/Brotli

所有推荐的平台都默认启用了压缩。

### 3. 配置缓存

在 `vercel.json` 或平台设置中配置缓存策略。

### 4. 监控性能

- Google Analytics
- Vercel Analytics
- Cloudflare Analytics（免费）

---

## 🎉 下一步

部署完成后，你可以：

1. ⭐ 给原仓库点个星
2. 📢 分享你的网站
3. 🔔 配置 RSS 阅读器
4. 💬 加入讨论社区

---

需要帮助？[提交 Issue](https://github.com/your-username/weekly/issues)

