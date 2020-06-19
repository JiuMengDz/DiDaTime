const { window } = require("vscode")

Object.defineProperty(exports, "__esModule", {value: true});
class TimerManager {
    constructor() {
        this.timers = {}
        this.name2id = {}
        this.count = 0
    }

    /**
     * @param {string} timer_name   计时器的标记名称
     * @param {string} content  提醒内容
     * @param {number} daley    延迟时间
     * @param {boolean} is_loop 是否循环提醒
     * @memberof TimerManager
     */
    addTimer(timer_name, content, daley, is_loop){
        var count = this.count
        this.count ++
        
        var time_handler = {}
        var timer = setInterval(()=>{
            this._timerCallback(count)
        }, daley)
        
        time_handler.id = count
        time_handler.name = timer_name
        time_handler.content = content
        time_handler.is_loop = is_loop
        time_handler.timer = timer

        this.timers[count] = time_handler
        this.name2id[timer_name] = count
    }

    /**
     * @memberof TimerManager
     */
    _timerCallback(count){
        var time_handler = this.timers[count]

        var content = time_handler.content
        if(content){
            window.showInformationMessage(content)
        }

        if(!time_handler.is_loop){
            this.removeTimer(time_handler.name)
        }
    }

    removeTimer(timer_name){
        var id = this.name2id[timer_name]
        var time_handle = this.timers[id]
        if(time_handle){
            clearInterval(time_handle.timer)
            delete this.timers[id]
            delete this.name2id[timer_name]
        }
    }

    getAllTimeName(){
        var strs = []
        for (const str in this.timers) {
            if (this.timers.hasOwnProperty(str)) {
                const element = this.timers[str];
                strs.push(element.name)
            }
        }
        return strs
    }
}

exports.TimerManager = TimerManager