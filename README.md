# 厨艺小程序 / zjwssm

这是一个纯静态网站，适合直接发布到 GitHub Pages。

## 本地预览

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

然后打开：

```text
http://127.0.0.1:4173/
```

如果用 Codex 自带的 Python：

```powershell
& 'C:\Users\ZhuanZ（无密码）\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m http.server 4173 --bind 127.0.0.1
```

## 公开发布

GitHub Pages 公开部署步骤：

1. 把仓库推到 GitHub。
2. 在仓库设置里打开 `Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选 `/ (root)`。
5. 保存后，GitHub 会给你一个公开网址。

公开后，入口页就是根目录的 `index.html`。

## 文件说明

- `index.html`：主页
- `styles.css`：样式
- `app.js`：交互逻辑和本地存储

## 说明

这是静态前端站，没有后端和登录。公开网址能不能打开，取决于你是否完成 GitHub Pages 发布。
