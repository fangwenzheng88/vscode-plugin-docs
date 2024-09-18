// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";

class MyWebviewViewProvider implements vscode.WebviewViewProvider {
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

    const basePath = vscode.Uri.file(path.join(this._extensionPath, "dist"));
    const baseUri = webviewView.webview.asWebviewUri(basePath);
    webviewView.webview.html = this.getWebviewContent(baseUri);
  }

  private getWebviewContent(baseUri: vscode.Uri): string {
    return `
          <!DOCTYPE html>
          <html lang="en">

          <head>
            <base href="${baseUri}/" />
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Taoli Webview</title>
            <link rel="stylesheet" crossorigin href="app.css">
          </head>

          <body>
            <div id="app"></div>
            <script src="app.js"></script>
          </body>

          </html>`;
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "json2type" is now active!');

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      MyWebviewViewProvider.viewName,
      new MyWebviewViewProvider(context.extensionPath)
    )
  );

  let disposable2 = vscode.commands.registerCommand("extension.openWebpageInWebview", async function () {
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

  context.subscriptions.push(disposable2);

  // 获取全局存储的 URI
  const globalStorageUri = context.globalStorageUri;

  // 创建一个子目录
  const dataDirName = "myplugin_data";
  const dataDirUri = vscode.Uri.joinPath(globalStorageUri, dataDirName);
  console.log("🚀 ~ activate ~ dataDirUri:", dataDirUri);

  // 创建目录
  vscode.workspace.fs.createDirectory(dataDirUri).then(
    () => {
      console.log(`Directory created at: ${dataDirUri.fsPath}`);
    },
    (error) => {
      console.error("Failed to create directory:", error);
    }
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
