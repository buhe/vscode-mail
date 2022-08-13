// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import { Net126 } from './strategy/Net126';
import { deleteVendor, Mail, MailProvider, openContent, reply, Vendor } from './ui/mailView';
import { MultiStepInput, multiStepInput } from './ui/multiStepInput';
import { Gmail } from './strategy/Gmail';
import { getImapInstance } from './sdk/holder';
import { DISPLAY_KEY, V_126, V_GMAIL, V_OTHER, V_SINA } from './strategy';
import { Other } from './strategy/Other';
import { Sina } from './strategy/Sina';

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
		let node = mailProvider.findNode(config[DISPLAY_KEY], uid);
		// console.log('node: %s', JSON.stringify(node));
		openContent(subject, content);
		getImapInstance(config[DISPLAY_KEY]).updateTags(uid);
		node?.read();
		mailProvider.fire(node);
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
	vscode.commands.registerCommand('vsc-mail.setupSina', () => {
		Sina.compile(context, mailProvider);
	});
	vscode.commands.registerCommand('vsc-mail.setupOther', () => {
		Other.compile(context, mailProvider);
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
						label: V_126,
					},
					{
						label: V_GMAIL,
					},
					{
						label: V_SINA,
					},
					{
						label: V_OTHER,
					}
				],
			});
			switch (pick.label) {
				case V_126:
					vscode.commands.executeCommand('vsc-mail.setup126');
					break;
				case V_SINA:
					vscode.commands.executeCommand('vsc-mail.setupSina');
					break;
				case V_GMAIL:
					vscode.commands.executeCommand('vsc-mail.setupGmail');
					break;
				case V_OTHER:
					vscode.commands.executeCommand('vsc-mail.setupOther');
					break;
			}

		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
