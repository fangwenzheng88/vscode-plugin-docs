// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { registerCommands } from "./registerCommand";
import { TestView } from "./test-view";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "project-docs" is now active!');

  context.subscriptions.push(...registerCommands(context));

  new TestView(context);

  vscode.commands.executeCommand("projectDocs.refreshTree");

  let disposable = vscode.commands.registerCommand("projectDocs.openFolderInNewWindow", async (uri: vscode.Uri) => {
    if (uri.scheme === "file" && uri.fsPath) {
      const folderPath = uri.fsPath;
      await vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(folderPath), true);
    }
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
