// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import { Net126 } from './strategy/Net126';
import { deleteVendor, Mail, MailProvider, openContent, reply, Vendor } from './ui/mailView';
import { MultiStepInput, multiStepInput } from './ui/multiStepInput';
import { Gmail } from './strategy/Gmail';
import { getImapInstance } from './sdk/holder';
import { DISPLAY_KEY } from './strategy';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vsc-mail" is now active!');
	const mailProvider = new MailProvider(context);
	// await mailProvider.init();
	vscode.window.registerTreeDataProvider('mail', mailProvider);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	vscode.commands.registerCommand('vsc-mail.openContent', (uid: number, subject: string, content: string, config: any, tags: string[]) => {
		openContent(subject, content);
		getImapInstance(config[DISPLAY_KEY]).updateTags(uid);
		tags.push('\\Seen');
		mailProvider.refresh();
	});
	vscode.commands.registerCommand('vsc-mail.reply', async (mail: Mail) => {
		let document = await vscode.workspace.openTextDocument({language: 'markdown'});
		await vscode.window.showTextDocument(document);
	});
	vscode.commands.registerCommand('vsc-mail.send', async (mail: Mail) => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;

			// Get the document text
			const documentText = document.getText();

			let md = new MarkdownIt();

			try {
				let html = md.render(documentText);
				vscode.window.showInformationMessage(JSON.stringify(mail));
				await reply(mail, html);
			} catch(e: any) {

			}
		}
	});
	vscode.commands.registerCommand('vsc-mail.setup126', () => {
		Net126.compile(context, mailProvider);
	});
	vscode.commands.registerCommand('vsc-mail.setupGmail', () => {
		Gmail.compile(context, mailProvider);
	});
	vscode.commands.registerCommand('vsc-mail.deleteVendor', (vendor: Vendor) => {
		deleteVendor(context, mailProvider, vendor.label);
	});
	let disposable = vscode.commands.registerCommand('vsc-mail.setupMail', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		MultiStepInput.run(async (input) => {
			const pick = await input.showQuickPick({
				title: 'create mail vendor',
				step: 1,
				totalSteps: 1,
				placeholder: 'mail vendor',
				items: [
					{
						label: `126`,
					},
					{
						label: `Gmail`,
					}
				],
			});
			switch (pick.label) {
				case '126':
					vscode.commands.executeCommand('vsc-mail.setup126');
					break;
				case 'Gmail':
					vscode.commands.executeCommand('vsc-mail.setupGmail');
					break;
			}

		});
		mailProvider.refresh();
		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
