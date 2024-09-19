import * as vscode from "vscode";

export function registerCommand() {
  return vscode.commands.registerCommand("extension.openWebpageInWebview", async function () {
    // 创建Webview选项
    const webviewOptions = {
      enableScripts: true,
      retainContextWhenHidden: true,
    };

    // 创建Webview面板
    const panel = vscode.window.createWebviewPanel("myWebview", "在线网站示例", vscode.ViewColumn.One, webviewOptions);

    // 获取Webview对象
    const webview = panel.webview;

    // 设置Webview的安全上下文
    // 注意：使用webview.cspSource来创建一个安全的CSP源
    const cspSource = webview.cspSource;

    // 构建HTML内容，包括加载外部网站
    const html = `
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>在线网站示例</title>
                <style>
                    body { margin: 0; padding: 0; }
                    iframe { width: 100%; height: 100vh; border: none; }
                </style>
            </head>
            <body>
                <iframe src="https://baidu.com" frameborder="0"></iframe>
            </body>
            </html>
        `;

    // 将HTML内容设置给Webview
    webview.html = html;
  });
}
