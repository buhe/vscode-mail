import * as vscode from 'vscode';
import * as path from 'path';
import Imap, {Message, NodeType} from '../sdk/imap';
import { getSmtpInstance } from '../sdk/holder';

export class Mail extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly content: string,
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
        
    }

    async init() {
        this.imap = await Imap.connect();
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
                        boxNodees.push(new Mail(key, '' ,NodeType.Box, vscode.TreeItemCollapsibleState.Collapsed));
                    }
                    return Promise.resolve(boxNodees);
                case NodeType.Box:
                    let messages = await Imap.openMail(element.tooltip as string);
                    let mailNodes = messages.map((msg: Message) => {
                        return new Mail(msg.subject, msg.content, NodeType.Mail, vscode.TreeItemCollapsibleState.None);
                    });
                    return Promise.resolve(mailNodes);
                default:
                    return Promise.resolve([]);
            }
        } else {
            return Promise.resolve([new Mail('126', '', NodeType.Vendor,vscode.TreeItemCollapsibleState.Collapsed)]);
        }

    }
}

export async function reply(mail: Mail) {
    let smtp = getSmtpInstance();
    await smtp.send('bugu1986@gmail.com', 'Test Email Subject', '<h1>Example Plain Text Message Body</h1>')
}

export function openContent(mail: Mail) {
    const panel = vscode.window.createWebviewPanel(
        mail.tooltip as string,
        mail.tooltip as string,
        vscode.ViewColumn.One,
        {}
    );

    // 设置HTML内容
    panel.webview.html = mail.content;
}