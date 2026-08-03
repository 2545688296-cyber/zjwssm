# zjwssmdexiaochufang

一个纯静态网站，直接发布到 GitHub Pages 即可公开访问。

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

## GitHub Pages 公开访问

1. 把仓库推到 GitHub。
2. 打开仓库 `Settings`。
3. 进入 `Pages`。
4. `Source` 选择 `Deploy from a branch`。
5. `Branch` 选择 `main`，目录选 `/ (root)`。
6. 保存后等待 GitHub 生成公开地址。

公开后，入口页就是仓库根目录的 `index.html`。

## Supabase 同步

数据页里的 `初始化云端` 按钮会把当前本机菜谱整批写入 Supabase。

想让不同设备看到同一份内容：

1. 在 Supabase 创建项目。
2. 把 `supabase-schema.sql` 的 SQL 执行一遍。
3. 把 `supabase-config.js` 里的 `url` 和 `anonKey` 填好。
4. 重新部署 GitHub Pages。

当前同步方式是公开共享同一个菜谱库，不需要登录。

## 文件说明

- `index.html`：主页
- `styles.css`：样式
- `app.js`：交互逻辑和本地/云端同步
- `supabase-config.js`：Supabase 连接配置
- `supabase-schema.sql`：云端表结构
