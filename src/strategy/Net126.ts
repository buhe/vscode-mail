import { MultiStepInput } from "../ui/multiStepInput";
import * as vscode from 'vscode';

export class Net126 {
    /**
     * compile
     */
    public static compile() {
        let data: any = {};
        MultiStepInput.run(async (input) => {
            data.user = await input.showInputBox({
                title: 'UserName',
                step: 1,
                totalSteps: 2,
                value: data.user,
                prompt: 'Input 126 user name, please',
            });

            data.pass = await input.showInputBox({
                title: 'Password',
                step: 2,
                totalSteps: 2,
                value: data.pass,
                prompt: 'Input 126 password, please',
            });
            vscode.window.showInformationMessage('126 setup ' + JSON.stringify(data));
        });
    }

}