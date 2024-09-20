import * as vscode from "vscode";
import path from "node:path";
import fs from "node:fs";

class MyWebviewViewProvider implements vscode.WebviewViewProvider {
  /**
   * 这里和package.json中contributes.views[x].id
   */
  public static readonly viewName = "demoSidebar";

  constructor(private readonly _extensionPath: string) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    // const isDevelopment = process.env.VSCODE_ENV === "development";
    const isDevelopment = false;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this._extensionPath, "dist")),
        ...(isDevelopment ? [vscode.Uri.parse("http://127.0.0.1:5173/")] : []),
      ],
    };

    const basePath = vscode.Uri.file(path.join(this._extensionPath, "dist/webview"));
    const baseUri = webviewView.webview.asWebviewUri(basePath);

    if (isDevelopment) {
      fetch("http://localhost:5173/")
        .then((response) => response.text())
        .then((data) => {
          console.log("🚀 ~ MyWebviewViewProvider ~ fetch ~ data:", data);
          webviewView.webview.html = data
            .replace(/<base href=".*?">/i, `<base href="http://localhost:5173/">`)
            .replace(/"\/@vite\/client"/i, `"http://localhost:5173/@vite/client"`);
        });
    } else {
      webviewView.webview.html = this.getWebviewContent(baseUri);
    }

    // 处理从 Webview 发送的消息
    webviewView.webview.onDidReceiveMessage((message: any) => {
      console.log("🚀 ~ MyWebviewViewProvider ~ webviewView.webview.onDidReceiveMessage ~ message:", message);
      switch (message.command) {
        case "alert":
          vscode.window.showInformationMessage(message.text);
          return;
      }
    }, undefined);
  }

  private getWebviewContent(baseUri: vscode.Uri): string {
    // 读取 index.html 文件的路径
    const indexPath = path.join(this._extensionPath, "dist/webview", "index.html");

    // 读取 index.html 文件的内容
    try {
      const fileContent = fs.readFileSync(indexPath, "utf-8");

      // 替换 base 标签的 href 属性
      const modifiedContent = fileContent.replace(/<base href=".*?">/i, `<base href="${baseUri}/">`);

      return modifiedContent;
    } catch (error) {
      console.error("Error reading index.html:", error);
      return `
          <!DOCTYPE html>
          <html lang="zh-CN">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error</title>
          </head>
          <body>
            <h1>Failed to load index.html</h1>
          </body>
          </html>
        `;
    }
  }
}

export function registerWebviewViewProvider(context: vscode.ExtensionContext) {
  return vscode.window.registerWebviewViewProvider(
    MyWebviewViewProvider.viewName,
    new MyWebviewViewProvider(context.extensionPath)
  );
}
