const vscode = require('vscode');
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

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let timerManager = new TimerManager();
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
						if(str == "true"){
							timerManager.addTimer(name, content, da, true);
						}else{
							timerManager.addTimer(name, content, da, false);
						}
					})
				})
			})
		})
	});

	let disposable2 = vscode.commands.registerCommand('DiDa.remove_time', function () {
		var strs = timerManager.getAllTimeName()
		console.log(strs)
		if(strs.length <= 0) return

		vscode.window.showQuickPick(strs, {canPickMany:true}).then((names)=>{
			names.forEach((name)=>{
				timerManager.removeTimer(name)
			})
		})
	});
	
	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
