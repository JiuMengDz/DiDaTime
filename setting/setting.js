const body_container = document.querySelector("body")
const tb_container = document.querySelector("table")

const input_name = document.getElementById("timer_name")
const input_content = document.getElementById("timer_content")
const input_time = document.getElementById("time")
const input_is_loop = document.getElementsByName("is_loop")

// @ts-ignore
const vscode = acquireVsCodeApi()

function init_page(){
    window.addEventListener("message", event => {
        let data = event.data;
        switch (data.command) {
            case "set_data":
                tb_container.innerHTML = ""
                update_page(data.d)
                break;
            case "update":
                console.log(data)
                break;
            case "add_timer":
                AppendNewTimer(data.new_timer)
                break;
            case "remove_timer":
                remove(data.id)
                break;
            default:
        }
    })
}
/**
 * @param {Array} timers_data
 */
function update_page(timers_data){
    for (const key in timers_data) {
        if (timers_data.hasOwnProperty(key)) {
            const element = timers_data[key];
            AppendNewTimer(element)
        }
    }
}

function getTimeElement(id, name, content, daley, is_loop){
    var tr = document.createElement("tr")
    tr.id = "timer" + id
    tr.appendChild(getTdElement(name))
    tr.appendChild(getTdElement(content))
    tr.appendChild(getTdElement(daley))
    tr.appendChild(getTdElement(is_loop))
    var td = getTdElement('')
    var btn = document.createElement("button")
    btn.innerText = "X"
    td.appendChild(btn)
    btn.addEventListener('click', ()=>{
        RemoveTimer(id)
    })
    tr.appendChild(td)
    return tr
}

function AppendNewTimer(timer_data){
    tb_container.appendChild(getTimeElement(timer_data.id, timer_data.name, timer_data.content, timer_data.daley, timer_data.is_loop))
}

function getTdElement(content){
    var td = document.createElement("td")
    td.innerText = content
    return td
}

function RemoveTimer(id){
    vscode.postMessage({
        command: "remove_timer",
        id: id
    })
}

function remove(id){
    var node = document.querySelector("#timer" + id)
    node.remove()
}

function AddTimer(){
    let name = input_name.value
    let content = input_content.value
    let time = input_time.value

    let selected = false
    for (let index = 0; index < input_is_loop.length; index++) {
        const element = input_is_loop[index];
        if(element.checked){
            selected = element.value
            break
        }
    }
    
    if(name == "" || content == "" || time == "" || Number.parseInt(time) <= 2){
        return
    }


    vscode.postMessage({
        command: "add_timer",
        t_name: name,
        t_content: content,
        t_time: Number.parseFloat(time) * 1000,
        t_is_loop: selected == "false" ? false : true,
    })
}

init_page()