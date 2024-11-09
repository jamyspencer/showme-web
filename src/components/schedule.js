class ShowmeSchedule extends HTMLElement {

}

const formatTime = (date) => {
    const hour = date.getHours()
    const hourString = hour == 0 ? "12" : hour > 12 ? `${hour-12}` : `${hour}`
    const min = date.getMinutes()
    const minString = min < 10 ? `0${min}` : `${min}`
    return `${hourString}:${minString} ${hour > 12 ? "PM" : "AM"}`
}

class ScheduleEntry extends HTMLElement {
    connectedCallback() {
        if (! this.isHydrated) {
            const start = this.attributes.getNamedItem('start').value
            if (start) this.start = new Date(start)
            const end = this.attributes.getNamedItem('end').value
            if (end) this.end = new Date(end)
            this.hydrate()
        }
    }

    hydrate() {
        const frag = document.createDocumentFragment()
        const startDiv = document.createElement('div')
        startDiv.innerText = formatTime(this.start)
        frag.appendChild(startDiv)
        const stopDiv = document.createElement('div')
        stopDiv.innerText = formatTime(this.end)
        frag.appendChild(stopDiv)
        const labelDiv = document.createElement('div')
        labelDiv.innerText= this.label
        frag.appendChild(labelDiv)
        const roomDiv = document.createElement('div')
        roomDiv.innerText = this.room
        frag.appendChild(roomDiv)
        this.appendChild(frag)
        this.isHydrated = true
    }

    get label(){
        return this.attributes.getNamedItem('label').value
    }
    get type() {
        return this.attributes.getNamedItem('type').value
    }
    get room() {
        return this.attributes.getNamedItem('room').value
    }
}

export { ShowmeSchedule, ScheduleEntry }