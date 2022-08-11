import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from "fs";
import { findIndex } from "lodash";
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import {Message, NodeType} from '../sdk/imap';
import { createImapInstance, createSmtpInstance, getImapInstance, getSmtpInstance } from '../sdk/holder';
import { DISPLAY_KEY, MAIL_KEY } from '../strategy';
import _ = require('lodash');

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
        light: path.join(__filename, '..', '..', 'images', 'light', 'folder.svg'),
        dark: path.join(__filename, '..', '..', 'images', 'dark', 'folder.svg')
    };

}


export class Mail extends vscode.TreeItem {

    constructor(
        public readonly uid: number,
        public readonly label: string,
        public readonly from: string,
        public readonly tags: string[],
        public readonly content: string,
        public readonly date: Date,
        public readonly type: NodeType,
        public readonly config: any,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);

        this.tooltip = this.label;
        this.description = '';
        this.command = { command: 'vsc-mail.openContent', title: 'open', arguments: [uid, label, content, config, tags] };
        if (this.isMailReaded(this.tags)) {
            this.iconPath = {
                light: path.join(__filename, '..', '..', 'images', 'light', 'mail.svg'),
                dark: path.join(__filename, '..', '..', 'images', 'dark', 'mail.svg')
            };
        } else {
            this.iconPath = {
                light: path.join(__filename, '..', '..', 'images', 'light', 'unread_mail.svg'),
                dark: path.join(__filename, '..', '..', 'images', 'dark', 'unread_mail.svg')
            };
        }
    }

    isMailReaded(tags: string[]): boolean {
        return findIndex(tags, function (o: string) { return o == '\\Seen' }) != -1;
    }

    read() {
        this.iconPath = {
            light: path.join(__filename, '..', '..', 'images', 'light', 'mail.svg'),
            dark: path.join(__filename, '..', '..', 'images', 'dark', 'mail.svg')
        };
    }

    contextValue = 'mail';
}


export class MailProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
    private db: JsonDB;
    private static CACHE_DIR = '.vsc-mail';
    private mailMap: Map<string,Mail[]> = new Map();
    constructor(private context: vscode.ExtensionContext) {
        let vendor_cache_dir = [require('os').homedir(), MailProvider.CACHE_DIR].join(path.sep);
        fs.mkdir(vendor_cache_dir, { recursive: true });
        this.db = new JsonDB(new Config(path.join(vendor_cache_dir, "mail"), true, false, '/'));
    }

    findNode(display:string,uid:number): Mail | undefined {
        return _.find(this.mailMap.get(display), (m: Mail) => {
            return m.uid == uid;
        })
    }

    fire(item: vscode.TreeItem | undefined) {
        this._onDidChangeTreeData.fire(item);
    }
    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: Mail): Promise<vscode.TreeItem[]> {
        let out = this;
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
                    let display = '/' + element.config[DISPLAY_KEY];
                    let mailBox = element.tooltip as string;
                    let key = [display, mailBox].join('/');
                    await this.db.push(key, [], false);
                    let msgs: Message[] = await this.db.getData(key);
                    let mailNodes: Mail[] = msgs.map((msg: Message) => {
                        return new Mail(msg.uid, msg.subject, msg.from, msg.tags, msg.content, msg.date, NodeType.Mail, element.config, vscode.TreeItemCollapsibleState.None);
                    });
                    let imapFace2 = getImapInstance(element.config[DISPLAY_KEY]);
                    let messages = await imapFace2.openMail(mailBox);
                    messages.map((msg: Message) => {
                        let mailIndex = mailChange(mailNodes,msg.uid,msg.tags);
                        if(mailIndex == -1) {
                            let mail = new Mail(msg.uid, msg.subject, msg.from, msg.tags, msg.content, msg.date, NodeType.Mail, element.config, vscode.TreeItemCollapsibleState.None);
                            // remove old at cache
                            let i = findIndex(mailNodes, function (o: Mail) { return o.uid == msg.uid});
                            if(i != -1){
                                out.db.delete(key + '[' + i + ']');
                                mailNodes.splice(i, 1);
                            }
                            out.db.push(key + '[]', msg);
                            mailNodes.push(mail);
                        }
                    });
                    this.mailMap.set(element.config[DISPLAY_KEY], mailNodes);
                    mailNodes = sortByDate(mailNodes);
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
    smtp.close();
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

function mailChange(mailNodes: Mail[], uid: number, tags: string[]): number {
    return findIndex(mailNodes, function (o: Mail) { return o.uid == uid && JSON.stringify(o.tags) == JSON.stringify(tags)}) ;
}


function sortByDate(mailNodes: Mail[]): Mail[] {
    return mailNodes.sort((a: Mail,b: Mail) => {
        return b.date.getTime() - a.date.getTime();
    });
}

