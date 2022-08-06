import { MultiStepInput } from "../ui/multiStepInput";
import * as vscode from 'vscode';
import { IMAP_PORT_KEY, IMAP_SERVER_KEY, MAIL_KEY, SMTP_PORT_KEY, SMTP_SERVER_KEY, VENDOR_KEY, V_126 } from ".";

export class Net126 {
    /**
     * compile
     */
    public static compile(context: vscode.ExtensionContext) {
        let data: any = {};
        MultiStepInput.run(async (input) => {
            data.display = await input.showInputBox({
                title: 'Display Name',
                step: 1,
                totalSteps: 3,
                value: data.display,
                prompt: 'Input 126 vendor display name, please',
            });

            data.user = await input.showInputBox({
                title: 'UserName',
                step: 2,
                totalSteps: 3,
                value: data.user,
                prompt: 'Input 126 user name, please',
            });

            data.pass = await input.showInputBox({
                title: 'Password',
                step: 3,
                totalSteps: 3,
                value: data.pass,
                prompt: 'Input 126 password, please',
            });
            data[VENDOR_KEY] = V_126;
            data[IMAP_SERVER_KEY] = 'imap.126.com';
            data[IMAP_PORT_KEY] = 993;
            data[SMTP_SERVER_KEY] = 'smtp.126.com';
            data[SMTP_PORT_KEY] = 994;
            vscode.window.showInformationMessage('126 setup ' + JSON.stringify(data));
            let old = context.globalState.get(MAIL_KEY) as any;
            let n = { [data.display]: data };
            let merge = { ...n, ...old };
            context.globalState.update(MAIL_KEY, merge);
        });
    }

}