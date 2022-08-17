import { MultiStepInput } from "../ui/multiStepInput";
import * as vscode from 'vscode';
import { IMAP_PORT_KEY, IMAP_SERVER_KEY, MAIL_KEY, SMTP_PORT_KEY, SMTP_SERVER_KEY, VENDOR_KEY, V_126 } from ".";
import { MailProvider } from "../ui/mailView";

export class QQex {
    /**
     * compile
     */
    public static compile(context: vscode.ExtensionContext, mailProvider: MailProvider) {
        let data: any = {};
        MultiStepInput.run(async (input) => {
            data.display = await input.showInputBox({
                title: 'Display Name',
                step: 1,
                totalSteps: 3,
                value: data.display,
                prompt: 'Input qq mail vendor display name, please',
            });

            data.user = await input.showInputBox({
                title: 'UserName',
                step: 2,
                totalSteps: 3,
                value: data.user,
                prompt: 'Input qq mail user name, please',
            });

            data.pass = await input.showInputBox({
                title: 'Password',
                step: 3,
                totalSteps: 3,
                value: data.pass,
                prompt: 'Input qq mail password, please',
            });
            data[VENDOR_KEY] = V_126;
            data[IMAP_SERVER_KEY] = 'imap.exmail.qq.com';
            data[IMAP_PORT_KEY] = 993;
            data[SMTP_SERVER_KEY] = 'smtp.exmail.qq.com';
            data[SMTP_PORT_KEY] = 465;
            vscode.window.showInformationMessage('qq mail setup ' + JSON.stringify(data));
            let old = context.globalState.get(MAIL_KEY) as any;
            let n = { [data.display]: data };
            let merge = { ...n, ...old };
            context.globalState.update(MAIL_KEY, merge);
            mailProvider.refresh();
        });
    }

}