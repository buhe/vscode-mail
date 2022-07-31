import * as vscode from 'vscode';
import * as path from 'path';
import Imap, {NodeType} from '../sdk/imap';

export class Mail extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly type: NodeType,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command,
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
    private imap: any;
    private _onDidChangeTreeData: vscode.EventEmitter<Mail | undefined | void> = new vscode.EventEmitter<Mail | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<Mail | undefined | void> = this._onDidChangeTreeData.event;

    constructor() {
        this.imap = Imap.connect();
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Mail): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: Mail): Promise<Mail[]> {
        vscode.window.showInformationMessage('load tree from vsc-mail!');
        if (element) {
            switch (element.type) {
                case NodeType.Vendor:
                    let boxes = await this.imap.getBoxesAsync();
                    let boxNodees: Mail[] = [];
                    for (const key in boxes) {
                        boxNodees.push(new Mail(key, NodeType.Box, vscode.TreeItemCollapsibleState.Collapsed));
                    }
                    return Promise.resolve(boxNodees);
                case NodeType.Box:
                    let mails = await Imap.openMail(element.tooltip as string);
                    return Promise.resolve([]);
                default:
                    return Promise.resolve([]);
            }
        } else {
            return Promise.resolve([new Mail('126', NodeType.Vendor,vscode.TreeItemCollapsibleState.Collapsed)]);
        }

    }
}