import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class Mail extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);

        this.tooltip = this.label;
        this.description = '';
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'images', 'mail.svg'),
        dark: path.join(__filename, '..', '..', 'images', 'mail.svg')
    };

    contextValue = 'mail';
}


export class MailProvider implements vscode.TreeDataProvider<Mail> {

    private _onDidChangeTreeData: vscode.EventEmitter<Mail | undefined | void> = new vscode.EventEmitter<Mail | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<Mail | undefined | void> = this._onDidChangeTreeData.event;

    constructor() {
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Mail): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Mail): Thenable<Mail[]> {
        vscode.window.showInformationMessage('load tree from vsc-mail!');
        if (element) {
            return Promise.resolve([new Mail('Inbox', vscode.TreeItemCollapsibleState.None), new Mail('Deleted', vscode.TreeItemCollapsibleState.None)]);
        } else {
            return Promise.resolve([new Mail('126', vscode.TreeItemCollapsibleState.Collapsed)]);
        }

    }
}