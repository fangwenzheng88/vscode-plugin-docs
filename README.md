# project-docs

- 创建一个项目下的md文档，方便进行项目文档记录
- 使用当前vscode打开文件夹作为唯一标识

## 安装

1. 前往 [Releases](../../releases) 页面下载最新版本的 `.vsix` 文件
2. 在 VSCode 中按 `Ctrl+Shift+P`，输入 `Install from VSIX`
3. 选择下载的 `.vsix` 文件即可完成安装

## 发布

```bash
# 1. 更新 package.json 中的 version 字段
# 2. 提交代码并打 tag
git add .
git commit -m "v0.0.1"
git tag v0.0.1
git push origin main --tags
```

推送 tag 后 GitHub Actions 会自动构建并发布 Release。