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
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(this._extensionPath, "dist"))],
    };

    const basePath = vscode.Uri.file(path.join(this._extensionPath, "dist/webview"));
    const baseUri = webviewView.webview.asWebviewUri(basePath);
    webviewView.webview.html = this.getWebviewContent(baseUri);
  }

  private getWebviewContent(baseUri: vscode.Uri): string {
    const isDevelopment = process.env.VSCODE_ENV === "development";
    if (isDevelopment) {
      return `
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>在线网站示例</title>
                <style>
                    html,body { margin: 0;padding: 0;width: 100%;height: 100%;overflow:hidden; }
                    iframe { width: 100%; height: 100%; border: none; }
                </style>
            </head>
            <body>
                <iframe src="http://127.0.0.1:5173/" frameborder="0"></iframe>
            </body>
            </html>`;
    } else {
      // 读取 index.html 文件的路径
      const indexPath = path.join(this._extensionPath, "dist/webview", "index.html");

      // 读取 index.html 文件的内容
      try {
        const fileContent = fs.readFileSync(indexPath, "utf-8");

        // 替换 base 标签的 href 属性
        const modifiedContent = fileContent.replace(/<base href=".*?" >/i, `<base href="${baseUri}/">`);

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
}

export function registerWebviewViewProvider(context: vscode.ExtensionContext) {
  return vscode.window.registerWebviewViewProvider(
    MyWebviewViewProvider.viewName,
    new MyWebviewViewProvider(context.extensionPath)
  );
}
