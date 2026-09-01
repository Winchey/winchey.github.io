# winchey.github.io

LiWanqing's Blog 的源码。

- 线上：https://www.liwanqing.com
- 框架：Hexo 8 + NexT 主题（Pisces scheme）
- 部署：GitHub Actions 自动构建到 `gh-pages` 分支

## 日常只操作 `main`

无论写文章、改配置、调样式，**你永远只往 `main` 分支 push**，剩下的自动化会接管：

```
你写 Markdown
    │
    ▼
┌────────────────┐
│  main 分支     │  ← 你 push 到这里
│  (Hexo 源码)   │
└────────┬───────┘
         │ push 触发
         ▼
   GitHub Actions
   (.github/workflows/deploy.yml)
         │
         │ 跑 hexo generate 构建
         │ 用 peaceiris/actions-gh-pages 推送
         ▼
┌────────────────┐
│ gh-pages 分支  │  ← 机器人自动写这里
│  (HTML 产物)   │
└────────┬───────┘
         │ GitHub Pages 从这里读
         ▼
   www.liwanqing.com
```

**gh-pages 分支从不用手动碰**——Actions 每次构建都会覆盖它，你手改也会被冲掉。

**为什么 Pages Source 要指 `gh-pages` 而不是 `main`？** 因为 GitHub Pages 只会把指定分支的文件原样 serve 出去，不会跑 Hexo 构建。指 main 会得到一堆 Markdown 源码；指 gh-pages 才是已经构建好的 HTML。

## 分支说明

| 分支 | 存什么 | 谁在动 |
|---|---|---|
| `main` | Hexo 源码（Markdown、配置、主题、workflow） | 人写 |
| `gh-pages` | 构建产物 HTML | Actions 自动生成，不用管 |
| `legacy-build` | 2021 年老站的 HTML 备份 | 安全网，不动 |

## 首次上机

换电脑之后：

```bash
git clone git@github.com:Winchey/winchey.github.io.git
cd winchey.github.io
npm install
```

需要预先装好 Node.js 20+（`brew install node@20`）。

## 写一篇新文章的完整流程

### 1. 新建文章骨架

```bash
npx hexo new "文章标题"
```

会生成 `source/_posts/文章标题.md`，里面自带 front-matter：

```markdown
---
title: 文章标题
date: 2026-09-01 12:00:00
tags:
---
```

**⚠️ 时区坑：** `date` 时间部分请填 **12:00:00 或更晚**。GitHub Actions 服务器是 UTC 时区，如果时间是凌晨（比如 03:21），构建出来的永久链接会前推一天变成 `/2026/08/31/xxx/` 而不是 `/2026/09/01/xxx/`。中午之后写就没这个问题。

### 2. 写正文

用任意 Markdown 编辑器（Typora / VSCode）打开 `.md` 文件写。

**图片放哪：**
- 全局图片：`source/images/xxx.png`，正文引用 `![](/images/xxx.png)`
- 文章专属图片：`source/images/文章名/xxx.png`

**首页摘要：** 用 `<!-- more -->` 标记摘要截断点，`<!-- more -->` 之前的内容会显示在首页。

### 3. 本地预览

```bash
npx hexo server
# 浏览器打开 http://localhost:4000/
```

**改了 `_config.yml` / `_config.next.yml` 不生效？** hexo-server 只监听 `source/` 变化，配置文件改动必须重启服务：`Ctrl+C` 停掉再 `npx hexo server`。

### 4. 发布

```bash
git add .
git commit -m "post: 文章标题"
git push origin main
```

推完约 1-2 分钟后，GitHub Actions 会自动构建并部署，`www.liwanqing.com` 就更新了。

## 常用命令速查

| 干嘛 | 命令 |
|---|---|
| 新建文章 | `npx hexo new "标题"` |
| 新建草稿（不发布） | `npx hexo new draft "标题"` → 生成到 `source/_drafts/` |
| 草稿转正式 | `npx hexo publish "标题"` |
| 本地预览 | `npx hexo server` |
| 清缓存 | `npx hexo clean` |
| 手动构建 | `npx hexo generate` |
| 检查构建产物 | `ls public/` |

## 常改的配置

| 想改什么 | 改哪个文件 |
|---|---|
| 站点标题、副标题、签名、域名 | `_config.yml` |
| 主题外观（scheme、菜单、社交、友链、字数统计等） | `_config.next.yml` |
| 侧边栏的音乐播放器等自定义组件 | `source/_data/sidebar.njk` |
| 返回顶部按钮位置等 CSS 覆盖 | `source/_data/styles.styl` |
| 「链接」标题改为「友链」等文本替换 | `scripts/rename-links-title.js` |
| 关于页文案 | `source/about/index.md` |

## GitHub Actions 部署流程

`.github/workflows/deploy.yml` 干这些事：

1. Checkout `main` 分支
2. 装 Node.js 20 + `npm ci` 装依赖
3. `npx hexo generate` 构建到 `public/`
4. 用 `peaceiris/actions-gh-pages@v4` 把 `public/` 推到 `gh-pages` 分支
5. 自动带上 `CNAME`（liwanqing.com）

GitHub Pages 设置里 Source 指向 **`gh-pages` 分支 / root**。

## 排错

**Actions 构建失败**：去 https://github.com/Winchey/winchey.github.io/actions 看具体是哪一步红了。

**"pages build and deployment" 报 Jekyll 错**：忽略，这是 GitHub Pages 默认对 main 分支跑的 Jekyll 构建。只要 Pages Source 指着 `gh-pages` 就不影响。

**文章链接返回 404**：先看 `git ls-tree -r origin/gh-pages | grep 文章名`——如果 gh-pages 里有但线上没有，等 5 分钟 CDN 缓存刷新。如果 gh-pages 里都没有，看是不是"时区坑"（见"写一篇新文章"第 1 步）。

**改了 CSS/主题不生效**：`npx hexo clean && npx hexo generate` 强制重建。

## 回滚

万一某次 push 把站搞崩了：

```bash
git revert HEAD              # 撤销最近一次 commit
git push origin main         # 触发重新构建
```

或者需要恢复到 2021 年老 HTML 那版极端场景：

```bash
git checkout legacy-build    # 老站在这
```

## Node.js 说明

Homebrew 装的 `node@20` 是 keg-only，`~/.zshrc` 里加了：

```bash
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
```

如果新 shell 找不到 `node`：`source ~/.zshrc` 或者重开终端。
