# 🔧 修复 GitHub Actions 部署错误

## ❌ 错误信息

```
Error: Dependencies lock file is not found in /home/runner/work/weekly/weekly. 
Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```

## 🔍 问题原因

项目使用的是 **pnpm**（有 `pnpm-lock.yaml`），但 GitHub Actions 配置的是 **npm** 缓存和命令。

### 问题代码

```yaml
- name: 设置 Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # ❌ 错误：应该是 pnpm

- name: 安装依赖
  run: npm ci     # ❌ 错误：应该用 pnpm
```

## ✅ 解决方案

### 修改文件

**1. `.github/workflows/deploy.yml`**
**2. `.github/workflows/deploy-vercel.yml`**

### 正确配置

```yaml
- name: 安装 pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 8

- name: 设置 Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'  # ✅ 正确

- name: 安装依赖
  run: pnpm install --frozen-lockfile  # ✅ 正确

- name: 生成 RSS Feed
  run: pnpm run generate-rss

- name: 构建网站
  run: pnpm run build
```

## 📋 修改步骤

### 1. 安装 pnpm action

```yaml
- name: 安装 pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 8
```

必须在 `setup-node` **之前**安装 pnpm。

### 2. 修改缓存配置

```yaml
cache: 'npm'   # ❌ 改为
cache: 'pnpm'  # ✅
```

### 3. 修改所有命令

```bash
npm ci           → pnpm install --frozen-lockfile
npm run xxx      → pnpm run xxx
npm install      → pnpm install
```

## 🔄 完整的工作流示例

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      # ✅ 第一步：安装 pnpm
      - name: 安装 pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 8
      
      # ✅ 第二步：设置 Node.js（使用 pnpm 缓存）
      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      # ✅ 第三步：安装依赖
      - name: 安装依赖
        run: pnpm install --frozen-lockfile
      
      # ✅ 后续步骤：使用 pnpm 命令
      - name: 生成 RSS Feed
        run: pnpm run generate-rss
      
      - name: 构建网站
        run: pnpm run build
```

## 🎯 关键点

### 1. 顺序很重要

```
1️⃣ checkout 代码
2️⃣ 安装 pnpm (pnpm/action-setup)
3️⃣ 设置 Node.js (actions/setup-node)
4️⃣ 安装依赖 (pnpm install)
5️⃣ 构建项目
```

### 2. frozen-lockfile 参数

```bash
pnpm install --frozen-lockfile
```

等同于 `npm ci`，确保使用 lockfile 中的精确版本，不会更新它。

### 3. pnpm 版本

```yaml
version: 8
```

可以根据需要调整版本号。查看 `package.json` 中的 `packageManager` 字段：

```json
{
  "packageManager": "pnpm@8.x.x"
}
```

## 📊 npm vs pnpm 对照表

| npm 命令 | pnpm 命令 | 说明 |
|---------|----------|------|
| `npm install` | `pnpm install` | 安装依赖 |
| `npm ci` | `pnpm install --frozen-lockfile` | CI 环境安装（不更新 lock） |
| `npm run build` | `pnpm run build` | 运行脚本 |
| `npm run dev` | `pnpm run dev` | 运行开发服务器 |
| `npm add xxx` | `pnpm add xxx` | 添加依赖 |
| `npm remove xxx` | `pnpm remove xxx` | 移除依赖 |

## ✅ 验证修复

修改后，推送代码会自动触发部署。检查步骤：

1. **进入 GitHub Actions**
   ```
   https://github.com/你的用户名/weekly/actions
   ```

2. **查看最新的工作流运行**
   - 应该看到 "安装 pnpm" 步骤
   - "安装依赖" 步骤应该成功
   - 不再有 lockfile 错误

3. **成功的输出示例**
   ```
   Run pnpm/action-setup@v4
   ✓ pnpm 8.x.x installed
   
   Run pnpm install --frozen-lockfile
   Lockfile is up to date, resolution step is skipped
   Packages: +xxx
   ✓ Done in 15s
   ```

## 🚨 常见问题

### Q1: 为什么不直接用 npm？

**A:** 项目已经使用 pnpm（有 `pnpm-lock.yaml`），改用 npm 需要：
- 删除 `pnpm-lock.yaml`
- 生成 `package-lock.json`
- 可能导致依赖版本不一致

保持使用 pnpm 更安全。

### Q2: 能否同时支持 npm 和 pnpm？

**A:** 不建议。一个项目应该只用一个包管理器：
- ✅ 只用 npm（有 package-lock.json）
- ✅ 只用 pnpm（有 pnpm-lock.yaml）
- ✅ 只用 yarn（有 yarn.lock）
- ❌ 混用（会导致冲突）

### Q3: pnpm 比 npm 有什么优势？

**A:** 
- ⚡ **更快**：并行安装，硬链接机制
- 💾 **更省空间**：全局共享依赖
- 🔒 **更严格**：不会提升依赖，避免幽灵依赖

### Q4: 如果想改回 npm 怎么办？

**A:**
```bash
# 1. 删除 pnpm 文件
rm pnpm-lock.yaml

# 2. 生成 npm 锁文件
npm install

# 3. 修改 GitHub Actions
# 移除 pnpm/action-setup
# cache: 'pnpm' → cache: 'npm'
# pnpm install → npm ci
```

## 📚 参考资料

- [pnpm 官方文档](https://pnpm.io/)
- [pnpm/action-setup](https://github.com/pnpm/action-setup)
- [GitHub Actions - setup-node](https://github.com/actions/setup-node)

## 🎉 总结

**问题**：npm 和 pnpm 不匹配  
**原因**：项目用 pnpm，工作流配置 npm  
**解决**：统一使用 pnpm  

修改后应该可以正常部署了！✅

