import * as vscode from "vscode";
import { getCurrentWorkspaceFolderName, getMdFiles, readJsonFile } from "./utils";
import path from "path";

export type TreeItem = {
  label: string;
  name: string;
  path: string;
  children?: TreeItem[];
  command?: string;
  type: "folder" | "file";
  iconPath?: {
    /**
     * The icon path for the light theme.
     */
    light: string;
    /**
     * The icon path for the dark theme.
     */
    dark: string;
  };
};

let treeArray: TreeItem[] = [];

class CustomListProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | TreeItem[] | undefined | null | void> =
    new vscode.EventEmitter<TreeItem | TreeItem[] | undefined | null | void>();

  readonly onDidChangeTreeData: vscode.Event<TreeItem | TreeItem[] | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    const workspaceName = getCurrentWorkspaceFolderName();
    const treeItem = new vscode.TreeItem(
      element,
      element.type === "folder"
        ? workspaceName === element.name
          ? vscode.TreeItemCollapsibleState.Expanded
          : vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None
    );
    if (element.iconPath) {
      treeItem.iconPath = {
        light: this.context.asAbsolutePath(element.iconPath.light),
        dark: this.context.asAbsolutePath(element.iconPath.dark),
      };
    }

    if (element.type === "file") {
      treeItem.command = {
        command: "projectDocs.openDocs",
        title: "",
        arguments: [element.path],
      };
    }

    treeItem.contextValue = element.type;
    return treeItem;
  }

  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (element) {
      const files = await getMdFiles(vscode.Uri.joinPath(this.context.globalStorageUri, element.path).fsPath);
      return files.map((el) => {
        return {
          label: el.name,
          name: el.name,
          path: path.relative(vscode.Uri.joinPath(this.context.globalStorageUri).fsPath, el.path),
          type: "file",
        };
      });
    }
    // 返回顶级元素
    return Promise.resolve(treeArray);
  }
}

export class TestView {
  constructor(context: vscode.ExtensionContext) {
    const customListProvider = new CustomListProvider(context);
    const view = vscode.window.createTreeView("projectDocs.treeView", {
      treeDataProvider: customListProvider,
      showCollapseAll: true,
    });

    const refreshDocs = vscode.commands.registerCommand("projectDocs.refreshTree", async function () {
      await readJsonFile<TreeItem[]>(vscode.Uri.joinPath(context.globalStorageUri, "projects.json").fsPath).then(
        (data) => {
          if (data) {
            treeArray = data;
          } else {
            treeArray = [];
          }
          customListProvider.refresh();
        }
      );
    });

    context.subscriptions.push(view, refreshDocs);
  }
}
