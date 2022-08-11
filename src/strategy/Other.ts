import { MultiStepInput } from "../ui/multiStepInput";
import * as vscode from 'vscode';
import { IMAP_PORT_KEY, IMAP_SERVER_KEY, MAIL_KEY, SMTP_PORT_KEY, SMTP_SERVER_KEY, VENDOR_KEY, V_126, V_OTHER } from ".";
import { MailProvider } from "../ui/mailView";

export class Other {
    /**
     * compile
     */
    public static compile(context: vscode.ExtensionContext, mailProvider: MailProvider) {
        let data: any = {};
        MultiStepInput.run(async (input) => {
            data.display = await input.showInputBox({
                title: 'Display Name',
                step: 1,
                totalSteps: 7,
                value: data.display,
                prompt: 'Input vendor display name, please',
            });

            data.user = await input.showInputBox({
                title: 'UserName',
                step: 2,
                totalSteps: 7,
                value: data.user,
                prompt: 'Input user name, please',
            });

            data.pass = await input.showInputBox({
                title: 'Password',
                step: 3,
                totalSteps: 7,
                value: data.pass,
                prompt: 'Input password, please',
            });

            data[IMAP_SERVER_KEY] = await input.showInputBox({
                title: 'IMAP Server',
                step: 4,
                totalSteps: 7,
                value: data[IMAP_SERVER_KEY],
                prompt: 'Input IMAP server, please',
            });
            data[IMAP_PORT_KEY] = await input.showInputBox({
                title: 'IMAP Port',
                step: 5,
                totalSteps: 7,
                value: data[IMAP_PORT_KEY],
                prompt: 'Input IMAP port, please',
            });
            data[SMTP_SERVER_KEY] = await input.showInputBox({
                title: 'SMTP Server',
                step: 6,
                totalSteps: 7,
                value: data[SMTP_SERVER_KEY],
                prompt: 'Input SMTP server, please',
            });
            data[SMTP_PORT_KEY] = await input.showInputBox({
                title: 'SMTP Port',
                step: 7,
                totalSteps: 7,
                value: data[SMTP_PORT_KEY],
                prompt: 'Input SMTP port, please',
            });
            data[VENDOR_KEY] = V_OTHER;
            vscode.window.showInformationMessage('Other mail vendor setup ' + JSON.stringify(data));
            let old = context.globalState.get(MAIL_KEY) as any;
            let n = { [data.display]: data };
            let merge = { ...n, ...old };
            context.globalState.update(MAIL_KEY, merge);
            mailProvider.refresh();
        });
    }

}