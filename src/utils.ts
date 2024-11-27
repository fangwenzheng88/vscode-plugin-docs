import * as vscode from "vscode";
import * as path from "path";

export async function createFile(filePath: string, content: string): Promise<void> {
  const uri = vscode.Uri.file(filePath);
  const data = new TextEncoder().encode(content);

  try {
    await vscode.workspace.fs.writeFile(uri, data);
    vscode.window.showInformationMessage(`File created: ${filePath}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create file: ${error}`);
  }
}

export async function fileIsExist(filePath: string): Promise<boolean> {
  const uri = vscode.Uri.file(filePath);

  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch (error) {
    return false;
  }
}

export async function openFile(filePath: string): Promise<void> {
  const uri = vscode.Uri.file(filePath);

  try {
    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);
    vscode.window.showInformationMessage(`File opened: ${filePath}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to open file: ${error}`);
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  const uri = vscode.Uri.file(filePath);

  try {
    await vscode.workspace.fs.delete(uri, { recursive: true });
    vscode.window.showInformationMessage(`File delete: ${filePath}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to delete file: ${error}`);
  }
}

export function getCurrentWorkspaceFolderName(): string | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0].name;
  }
  return undefined;
}

export async function readJsonFile<T = any>(filePath: string): Promise<T | null> {
  const uri = vscode.Uri.file(filePath);

  try {
    const data = await vscode.workspace.fs.readFile(uri);
    return JSON.parse(data.toString());
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to read JSON file: ${error}`);
    return null;
  }
}

export async function getMdFiles(folderPath: string): Promise<{ path: string; name: string }[]> {
  const uri = vscode.Uri.file(folderPath);
  const files: { path: string; name: string }[] = [];

  async function walkDir(dirUri: vscode.Uri) {
    const entries = await vscode.workspace.fs.readDirectory(dirUri);
    for (const [name, type] of entries) {
      const entryUri = dirUri.with({ path: path.join(dirUri.path, name) });
      if (type === vscode.FileType.Directory) {
        await walkDir(entryUri);
      } else if (type === vscode.FileType.File && name.endsWith(".md")) {
        files.push({ path: entryUri.path, name: name });
      }
    }
  }

  await walkDir(uri);
  return files;
}
