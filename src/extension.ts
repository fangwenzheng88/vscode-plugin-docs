// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { registerWebviewViewProvider } from "./registerWebviewViewProvider";
import { registerCommand } from "./registerCommand";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "json2type" is now active!');

  context.subscriptions.push(registerWebviewViewProvider(context));

  context.subscriptions.push(registerCommand());

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

  const env = process.env.VSCODE_ENV;
  console.log("🚀 ~ env:", env);
}

// This method is called when your extension is deactivated
export function deactivate() {}
