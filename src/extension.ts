import * as vscode from 'vscode';
import { WindowTitleService } from './services/WindowTitleService';

let windowTitleService: WindowTitleService;

export function activate(context: vscode.ExtensionContext) {
	console.log('Entitled: Extension is now activating!');
	console.log('Entitled: Activation time:', new Date().toISOString());

	// Initialize the window title service
	windowTitleService = new WindowTitleService();
	console.log('Entitled: WindowTitleService initialized');

	// Initial title update
	windowTitleService.updateTitle();
	console.log('Entitled: Initial title update triggered');

	// Register the hello world command for testing
	let helloWorldDisposable = vscode.commands.registerCommand('entitled.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Entitled!');
	});

	// Register a command to manually refresh the title
	let refreshTitleDisposable = vscode.commands.registerCommand('entitled.refreshTitle', async () => {
		await windowTitleService.updateTitle();
		vscode.window.showInformationMessage('Window title refreshed!');
	});

	// Register a command to reset the title to default
	let resetTitleDisposable = vscode.commands.registerCommand('entitled.resetTitle', async () => {
		await windowTitleService.resetWindowTitle();
		vscode.window.showInformationMessage('Window title reset to default!');
	});

	context.subscriptions.push(helloWorldDisposable);
	context.subscriptions.push(refreshTitleDisposable);
	context.subscriptions.push(resetTitleDisposable);
	context.subscriptions.push(windowTitleService);
}

export function deactivate() {
	if (windowTitleService) {
		windowTitleService.dispose();
	}
}
