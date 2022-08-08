import * as vscode from 'vscode';
import * as path from 'path';
import {Message, NodeType} from '../sdk/imap';
import { createImapInstance, createSmtpInstance, getImapInstance, getSmtpInstance } from '../sdk/holder';
import { DISPLAY_KEY, MAIL_KEY } from '../strategy';

export class Vendor extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly type: NodeType,
        public readonly config: any,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command,
    ) {
        super(label, collapsibleState);

        this.tooltip = this.label;
        this.description = '';
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'images', 'light', 'mail.svg'),
        dark: path.join(__filename, '..', '..', 'images', 'dark', 'mail.svg')
    };

    contextValue = 'vendor';

}

export class MailBox extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly type: NodeType,
        public readonly config: any,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command,
    ) {
        super(label, collapsibleState);

        this.tooltip = this.label;
        this.description = '';
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'images', 'light', 'mail.svg'),
        dark: path.join(__filename, '..', '..', 'images', 'dark', 'mail.svg')
    };

}


export class Mail extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly from: string,
        public readonly content: string,
        public readonly type: NodeType,
        public readonly config: any,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command,
    ) {
        super(label, collapsibleState);

        this.tooltip = this.label;
        this.description = '';
        this.command = { command: 'vsc-mail.openContent', title: 'open', arguments: [label, content] };
        // if (!abstract.read) {
        //     this.iconPath = new vscode.ThemeIcon('circle-outline');
        // }
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'images', 'light', 'mail.svg'),
        dark: path.join(__filename, '..', '..', 'images', 'dark', 'mail.svg')
    };

    contextValue = 'mail';
}


export class MailProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {
        
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: Mail): Promise<vscode.TreeItem[]> {
        // vscode.window.showInformationMessage('load tree from vsc-mail!');
        if (element) {
            switch (element.type) {
                case NodeType.Vendor:
                    await createImapInstance(element.config);
                    await createSmtpInstance(element.config);
                    let imapFace = getImapInstance(element.config[DISPLAY_KEY]);
                    let imap = await imapFace.connect();
                    let boxes = await imap.getBoxesAsync();
                    let boxNodes: MailBox[] = [];
                    for (const key in boxes) {
                        boxNodes.push(new MailBox(key ,NodeType.Box, element.config, vscode.TreeItemCollapsibleState.Collapsed));
                    }
                    return Promise.resolve(boxNodes);
                case NodeType.Box:
                    let imapFace2 = getImapInstance(element.config[DISPLAY_KEY]);
                    let messages = await imapFace2.openMail(element.tooltip as string);
                    let mailNodes = messages.map((msg: Message) => {
                        return new Mail(msg.subject, msg.from, msg.content, NodeType.Mail, element.config, vscode.TreeItemCollapsibleState.None);
                    });
                    return Promise.resolve(mailNodes);
                default:
                    return Promise.resolve([]);
            }
        } else {
            let vendors: any = this.context.globalState.get(MAIL_KEY);
            if(vendors && Object.keys(vendors).length > 0){
                let vendorKeys = Object.keys(vendors);
                let nodes = vendorKeys.map((vendorKey) => {
                    return new Vendor(vendorKey, NodeType.Vendor, vendors[vendorKey],vscode.TreeItemCollapsibleState.Collapsed)
                })
                return Promise.resolve(nodes);
            } else {
                return Promise.resolve([]);
            }
        }

    }
}

export function deleteVendor(context: vscode.ExtensionContext, mailProvider: MailProvider, display: string) {
    let old = context.globalState.get(MAIL_KEY) as any;
    delete old[display];
    context.globalState.update(MAIL_KEY, old);
    mailProvider.refresh();
}

export async function reply(mail: Mail, html: string) {
    let smtp = getSmtpInstance(mail.config[DISPLAY_KEY]);
    await smtp.send(mail.from, 'Re ' + mail.tooltip, html);
}

export function openContent(subject: string, content: string) {
    const panel = vscode.window.createWebviewPanel(
        subject as string,
        subject as string,
        vscode.ViewColumn.One,
        {}
    );

    // 设置HTML内容
    panel.webview.html = content;
}