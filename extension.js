const vscode = require('vscode');
const fs = require('fs');
const TimerManager = require('./timerManager').TimerManager;

let name_input_options = {
	prompt : "enter your name",
}

let content_input_options = {
	prompt : "enter your content",
}

let daley_input_options = {
	prompt : "enter your daley",
}

let setting_web_panel = null

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let timerManager = new TimerManager();
	timerManager.setRemoveTimeHandler((t_id)=>{
		if(setting_web_panel){
			setting_web_panel.webview.postMessage({
				command: "remove_timer",
				id: t_id,
			})
		}
	})

	let disposable = vscode.commands.registerCommand('DiDa.start_new_time', function () {
		vscode.window.showInputBox(name_input_options).then((name)=>{
			if(name == null || name == "") return
			vscode.window.showInputBox(content_input_options).then((content)=>{
				if(content == null || content == "") return
				vscode.window.showInputBox(daley_input_options).then((daley)=>{
					if(daley == "") return
					var da = Number.parseInt(daley) * 1000
					if(da < 5000){
						vscode.window.showInformationMessage("time is too small!")
						return
					}
					vscode.window.showQuickPick(["true", "false"]).then((str)=>{
						if(name == null) return
						var timer_data
						if(str == "true"){
							timer_data = timerManager.addTimer(name, content, da, true);
						}else{
							timer_data = timerManager.addTimer(name, content, da, false);
						}

						if(setting_web_panel){
							setting_web_panel.webview.postMessage({
								command: "add_timer",
								new_timer: timer_data
							})
						}
					})
				})
			})
		})
	});

	let disposable2 = vscode.commands.registerCommand('DiDa.remove_time', function () {
		var strs = timerManager.getAllTimeName()
		if(strs.length <= 0) return

		vscode.window.showQuickPick(strs, {canPickMany:true}).then((names)=>{
			if(!names) return
			names.forEach((name)=>{
				timerManager.removeTimer(name)
			})
		})
	});

	let setting_html_path = context.extensionPath + "/setting/setting.html"
	let html = fs.readFileSync(setting_html_path)
	let disposable3 = vscode.commands.registerCommand("DiDa.open_setting_page", function(){
		const columnToShowIn = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined
		if(setting_web_panel != null){
			setting_web_panel.reveal(columnToShowIn)
			return
		}
		
		setting_web_panel = vscode.window.createWebviewPanel("DiDa Time Setting", "DiDa Time Setting", columnToShowIn, {
			enableScripts: true,
		})
		
		let js_path = setting_web_panel.webview.asWebviewUri(vscode.Uri.file(context.extensionPath + "/setting/setting.js"))
		let row_html = html.toString().replace("$$script", js_path.toString())
		setting_web_panel.webview.html = row_html
		
		setting_web_panel.webview.postMessage({
			command: "set_data",
			d: timerManager.getTimersData()
		})

		setting_web_panel.webview.onDidReceiveMessage((e)=>{
			switch(e.command){
				case "remove_timer":
					timerManager.removeTimerById(e.id)
					break
				case "add_timer":
					var timer_data = timerManager.addTimer(e.t_name, e.t_content, e.t_time, e.t_is_loop);
					setting_web_panel.webview.postMessage({
						command: "add_timer",
						new_timer: timer_data
					})
					break
				case "clear_timer":
					timerManager.clearAllTimers(()=>{
						setting_web_panel.webview.postMessage({
							command: "set_data",
							d: timerManager.getTimersData()
						})
					})
					break
				default:
			}
		})

		setting_web_panel.onDidChangeViewState(()=>{
			setting_web_panel.webview.postMessage({
				command: "set_data",
				d: timerManager.getTimersData()
			})
		})
		
		setting_web_panel.onDidDispose(function(){
			setting_web_panel = null
		}, null, context.subscriptions)
	})
	
	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
