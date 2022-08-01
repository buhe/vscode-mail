// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Imap from './sdk/imap';
import { Mail, MailProvider, openContent, reply } from './ui/mailView';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vsc-mail" is now active!');
	const mailProvider = new MailProvider();
	vscode.window.registerTreeDataProvider('mail', mailProvider);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	vscode.commands.registerCommand('vsc-mail.openContent', (mail: Mail) => openContent(mail));
	vscode.commands.registerCommand('vsc-mail.reply', (mail: Mail) => reply(mail));
	let disposable = vscode.commands.registerCommand('vsc-mail.setupMail', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		context.globalState.update('foo', {'foo': 'bar'});
		vscode.window.showInformationMessage('Hello World from vsc-mail!' + JSON.stringify(context.globalState.get('foo')));
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
