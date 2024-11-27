import * as vscode from "vscode";
import { createFile, deleteFile, fileIsExist, getCurrentWorkspaceFolderName, openFile, readJsonFile } from "./utils";

import { type TreeItem } from "./test-view";

export function registerCommands(context: vscode.ExtensionContext) {
  const saveDocs = vscode.commands.registerCommand("projectDocs.saveProject", async function () {
    const workspaceName = getCurrentWorkspaceFolderName();
    if (!workspaceName) {
      vscode.window.showInformationMessage("请先打开项目");
      return;
    }

    const fileContent = await vscode.window.showInputBox({
      prompt: "输入项目名称",
      value: workspaceName,
      placeHolder: "Type your content here",
    });

    if (fileContent) {
      const dataDirUri = vscode.Uri.joinPath(context.globalStorageUri, "projects.json");

      const isExist = await fileIsExist(dataDirUri.fsPath);
      if (!isExist) {
        await createFile(dataDirUri.fsPath, "[]");
      }

      const projectList = await readJsonFile(dataDirUri.fsPath);

      if (projectList) {
        const idx = projectList.findIndex((el: any) => el.name === workspaceName);
        if (idx === -1) {
          const treeItem: TreeItem = {
            label: fileContent,
            name: workspaceName,
            path: workspaceName,
            type: "folder",
            iconPath: {
              light: "public/static/folder-light.svg",
              dark: "public/static/folder-dark.svg",
            },
          };
          projectList.push(treeItem);
        }
        await createFile(vscode.Uri.joinPath(context.globalStorageUri, `${workspaceName}/REAME.md`).fsPath, "");
        await openFile(vscode.Uri.joinPath(context.globalStorageUri, `${workspaceName}/REAME.md`).fsPath);
        await createFile(dataDirUri.fsPath, JSON.stringify(projectList));
      }

      await vscode.commands.executeCommand("projectDocs.refreshTree");
    } else {
      vscode.window.showInformationMessage(workspaceName, "项目已存在");
    }
  });

  const createDocs = vscode.commands.registerCommand("projectDocs.createDocs", async function (treeItem: TreeItem) {
    const fileContent = await vscode.window.showInputBox({
      prompt: "输入文档名称",
      value: "",
      placeHolder: "Type your content here",
    });

    if (!fileContent) {
      return;
    }

    const dataDirUri = vscode.Uri.joinPath(context.globalStorageUri, treeItem.path, fileContent + ".md");

    const isExist = await fileIsExist(dataDirUri.fsPath);
    if (isExist) {
      vscode.window.showInformationMessage("文件已存");
      return;
    }

    await createFile(dataDirUri.fsPath, "");

    await vscode.commands.executeCommand("projectDocs.refreshTree");
  });

  const openDocs = vscode.commands.registerCommand("projectDocs.openDocs", async function (filePath) {
    const dataDirUri = vscode.Uri.joinPath(context.globalStorageUri, filePath);

    const isExist = await fileIsExist(dataDirUri.fsPath);
    if (!isExist) {
      vscode.window.showInformationMessage("文件不存在");
      return;
    }

    return openFile(dataDirUri.fsPath);
  });

  const deleteDocs = vscode.commands.registerCommand("projectDocs.deleteDocs", async function (treeItem: TreeItem) {
    const pick = await vscode.window.showWarningMessage("是否删除当前文档?", { modal: true }, "确认");

    if (pick !== "确认") {
      return;
    }

    const dataDirUri = vscode.Uri.joinPath(context.globalStorageUri, treeItem.path);

    const isExist = await fileIsExist(dataDirUri.fsPath);
    if (!isExist) {
      vscode.window.showInformationMessage("文档不存在");
      return;
    }

    await deleteFile(dataDirUri.fsPath);

    vscode.commands.executeCommand("projectDocs.refreshTree");
  });

  const deleteProject = vscode.commands.registerCommand(
    "projectDocs.deleteProject",
    async function (treeItem: TreeItem) {
      const pick = await vscode.window.showWarningMessage("是否删除当前项目?", { modal: true }, "确认");

      if (pick !== "确认") {
        return;
      }

      const dataDirUri = vscode.Uri.joinPath(context.globalStorageUri, treeItem.path);

      const isExist = await fileIsExist(dataDirUri.fsPath);
      if (isExist) {
        await deleteFile(dataDirUri.fsPath);
      }

      const projectList = await readJsonFile(vscode.Uri.joinPath(context.globalStorageUri, "projects.json").fsPath);

      if (projectList) {
        const idx = projectList.findIndex((el: any) => el.name === treeItem.name);
        if (idx !== -1) {
          projectList.splice(idx, 1);
        }
        await createFile(
          vscode.Uri.joinPath(context.globalStorageUri, "projects.json").fsPath,
          JSON.stringify(projectList)
        );
      }

      await vscode.commands.executeCommand("projectDocs.refreshTree");
    }
  );
  return [saveDocs, createDocs, openDocs, deleteDocs, deleteProject];
}
