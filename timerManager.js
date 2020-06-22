const { window } = require("vscode")
let _instance = null

Object.defineProperty(exports, "__esModule", {value: true});
class TimerManager {
    constructor() {
        this.timers = {}
        this.name2id = {}
        this.count = 0
        if(!_instance){
            _instance = this
        }else{
            this.timers = _instance.timers
            this.name2id = _instance.name2id
            this.count = _instance.count
        }
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
        time_handler.daley = daley
        time_handler.timer = timer

        this.timers[count] = time_handler
        this.name2id[timer_name] = count

        return {
            id: time_handler.id,
            name: time_handler.name,
            content: time_handler.content,
            is_loop: time_handler.is_loop,
            daley: time_handler.daley,
        }
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
            this.removeTimerById(time_handler.id)
        }
    }

    removeTimer(timer_name){
        var id = this.name2id[timer_name]
        this.removeTimerById(id)
    }

    removeTimerById(id){
        var time_handle = this.timers[id]
        if(time_handle){
            clearInterval(time_handle.timer)
            delete this.timers[id]
            delete this.name2id[time_handle.name]

            if(this.remove_cb){
                this.remove_cb(id)
            }
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

    getTimersData(){
        var data = []
        for (const key in this.timers) {
            if (this.timers.hasOwnProperty(key)) {
                const element = this.timers[key];
                var d = {}
                d.id = element.id
                d.name = element.name
                d.content = element.content
                d.is_loop = element.is_loop
                d.daley = element.daley
                data.push(d)
            }
        }
        return data
    }

    setRemoveTimeHandler(cb){
        this.remove_cb = cb
    }
}

exports.TimerManager = TimerManager