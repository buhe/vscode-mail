import { MultiStepInput } from "../ui/multiStepInput";
import * as vscode from 'vscode';
import { saveMeta } from "../sdk/gmail/token";
import { MailProvider } from "../ui/mailView";

export class Gmail {
    /**
     * compile
     */
    public static compile(context: vscode.ExtensionContext, mailProvider: MailProvider) {
        let data: any = {};
        MultiStepInput.run(async (input) => {
            data.display = await input.showInputBox({
                title: 'Display Name',
                step: 1,
                totalSteps: 2,
                value: data.display,
                prompt: 'Input Gmail vendor display name, please',
            });

            data.user = await input.showInputBox({
                title: 'UserName',
                step: 2,
                totalSteps: 2,
                value: data.user,
                prompt: 'Input Gmail user name, please',
            });
            vscode.env.openExternal(vscode.Uri.parse('https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A3000&prompt=consent&response_type=code&client_id=106957458440-ectevvqgch5o9pq0jm8lrbfeab9nu23d.apps.googleusercontent.com&scope=https%3A%2F%2Fmail.google.com%2F+https%3A%2F%2Fmail.google.com%2F&access_type=offline'));
            saveMeta(data.display, data.user, context);
            mailProvider.refresh();
        });
    }

}