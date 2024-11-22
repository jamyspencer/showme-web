
type TimeFilterFunction = (a: ScheduleEntry, n: Date) => boolean;
type FilterFunction = (a: ScheduleEntry) => boolean
const days = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tues',
    3: 'Wed',
    4: 'Thurs',
    5: 'Fri',
    6: 'Sat'
}
class ShowmeSchedule extends HTMLElement {
    isHydrated = false
    startDates = new Set<Date>()
    nowFilterRadio: HTMLInputElement = document.createElement('input')
    todayFilterRadio: HTMLInputElement = document.createElement('input')
    compFilterRadio: HTMLInputElement = document.createElement('input')
    workshopFilterRadio: HTMLInputElement = document.createElement('input')
    timeFilter?: TimeFilterFunction
    typeFilter?: FilterFunction


    connectedCallback() {
        this.hydrate()
        this.nowFilterRadio.onclick = this.#filterNow
        this.todayFilterRadio.onclick = this.#filterToday
        this.compFilterRadio.onclick = this.#filterComp
        this.workshopFilterRadio.onclick = this.#filterWorkshop
        this.#childObserver.observe(this, {childList: true, subtree: true})
    }
    disconnectedCallback() {
        this.nowFilterRadio.onclick = null
        this.todayFilterRadio.onclick = null
        this.compFilterRadio.onclick = null
        this.workshopFilterRadio.onclick = null
    }
    hydrate() {
        if (this.isHydrated) return
        const filterDiv = document.createElement("div")
        filterDiv.classList.add('filters', 'grid', 'col2', 'w100', 'py-8')

        const n = wrapCheckBox(this.nowFilterRadio, 'time', 'now', 'Right Now')
        const t = wrapCheckBox(this.todayFilterRadio, 'time', 'today', 'Today')
        const tc = wrapSection('Time Filters', n, t)
        const w = wrapCheckBox(this.workshopFilterRadio, 'type', 'workshop', 'Workshops')
        const c = wrapCheckBox(this.compFilterRadio, 'type', 'comp', 'Competitions')
        const ec = wrapSection('Event Type Filters', w, c)
        filterDiv.append(tc, ec)
        this.prepend(filterDiv)
        this.isHydrated = true
    }
    #childObserver = new MutationObserver(mutationRecord => {
        const list = mutationRecord.map(record => record.target)
        this.#createDayMarkers(list)
    })
    #filter = () => {
        const nodes = this.querySelectorAll('schedule-entry')
        const now = new Date()
        const datesToKeep: Set<string> = new Set()
        for (const node of nodes) {
            if (!scheduleEntryGuard(node)) continue //shortcircuit
            if (!this.timeFilter || this.timeFilter(node, now)){
                if (!this.typeFilter || this.typeFilter(node)){
                    node.classList.remove('filtered')
                    const startDate = node.start
                    if (startDate) {
                        datesToKeep.add(`${days[startDate.getDay()]} ${startDate.getMonth()}/${startDate.getDate()}`)
                    }
                } else {
                    node.classList.add('filtered')
                }
            } else {
                //fails time filter, don't check others
                node.classList.add('filtered')
            } 
        }
        this.querySelectorAll('.day-marker').forEach(marker => {
            if(marker.textContent && datesToKeep.has(marker.textContent)){
                marker.classList.remove('filtered')
            } else {
                marker.classList.add('filtered')
            }
        })

    }
    #filterNow = () => {
        if (this.nowFilterRadio.checked){
            this.todayFilterRadio.checked = false
            this.timeFilter = rightNow
        } else {
            this.timeFilter = undefined
        }
        this.#filter()
    }
    #filterToday = () => {
        if (this.todayFilterRadio.checked) {
            this.nowFilterRadio.checked = false
            this.timeFilter = sameDay
        } else {
            this.timeFilter = undefined
        }
        this.#filter()
    }
    #filterComp = () => {
        if (this.compFilterRadio.checked) {
            this.workshopFilterRadio.checked = false
            this.typeFilter = isComp
        } else {
            this.typeFilter = undefined
        }
        this.#filter()
    }
    #filterWorkshop = () => {
        if (this.workshopFilterRadio.checked) {
            this.compFilterRadio.checked = false
            this.typeFilter = isWorkshop
        } else {
            this.typeFilter = undefined
        }
        this.#filter()
    }

    #removeFilters = () => {
        const children = this.querySelectorAll('schedule-entry')
        for (const child of children) {
            if (! scheduleEntryGuard(child)) return //if not a schedule-entry then don't process
            child.classList.remove('filtered')
        }
    }

    #createDayMarkers = (list: Node[]): void => {
        const daySet: Set<string> = new Set()
        
        for (const node of list) {
            if(! scheduleEntryGuard(node)) continue //short-circuit
            const startDate = node.start
            if(startDate === undefined) continue
            const len = daySet.size
            const val = `${days[startDate.getDay()]} ${startDate.getMonth()}/${startDate.getDate()}`
            daySet.add(val)
            if(daySet.size > len){
                const dayMarker = document.createElement('div')
                dayMarker.classList.add('day-marker')
                dayMarker.innerText = val
                node.before(dayMarker)
            }
        }
    }
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const roundedDay = (dateIn: Date): Date => {
    const timestamp = dateIn.getTime();
    const roundedTimestamp = Math.round(timestamp / millisecondsPerDay) * millisecondsPerDay;
    return new Date(roundedTimestamp);
}

const formatTime = (date: Date) => {
    const hour = date.getHours()
    const hourString = hour == 0 ? "12" : hour > 12 ? `${hour - 12}` : `${hour}`
    const min = date.getMinutes()
    const minString = min < 10 ? `0${min}` : `${min}`
    return `${hourString}:${minString} ${hour >= 12 ? "PM" : "AM"}`
}

const isComp = (entry: ScheduleEntry): boolean => {
    return entry.type ==='comp'
}

const isOpenDance = (entry: ScheduleEntry): boolean => {
    return entry.type ==='open'
}

const isWorkshop = (entry: ScheduleEntry): boolean => {
    return entry.type ==='workshop'
} 

const sameDay = (entry: ScheduleEntry, now: Date): boolean => {
    if (entry.start === undefined){
        return false
    }
    return now.getDate() === entry.start .getDate() 
            && now.getMonth() === entry.start .getMonth()
            && now.getFullYear() === entry.start .getFullYear()
}

const rightNow = (entry: ScheduleEntry, now: Date): boolean => {
    if (entry.start === undefined || entry.end === undefined){
        return false
    }
    return now >= entry.start && entry.end >= now
}

const wrapSection = (title:string, ...elements: HTMLElement[]): HTMLElement => {
    const section = document.createElement('div')
    section.classList.add('p-8')
    const id = title.replaceAll(' ', '-').toLowerCase()
    section.id = id
    const label = document.createElement('label')
    label.setAttribute('for', id)
    label.innerText = title
    // label.style.fontSize = '14px'
    section.append(label, ...elements)
    return section
}

const wrapCheckBox = (check: HTMLInputElement, name: string, value:string, prompt:string, initial = false):HTMLElement => {
    const id = `${name}-${value}`.toLowerCase()
    const label = document.createElement('label')
    label.setAttribute('for', id)
    label.innerText = prompt
    label.classList.add('pl-4')
    const div = document.createElement('div')
    check.id = id
    check.type = 'checkbox'
    check.value = value.toLowerCase()
    check.name = name
    div.append(check,label)
    div.classList.add('flex', 'py-4')
    return div
}

class ScheduleEntry extends HTMLElement {
    isHydrated = false
    start: Date | undefined
    end: Date | undefined
    connectedCallback() {
        this.hydrate()
    }

    hydrate() {
        if (this.isHydrated) return
        const start = this.attributes?.getNamedItem("start")?.value
        if (start) this.start = new Date(start)
        const end = this.attributes?.getNamedItem("end")?.value
        if (end) this.end = new Date(end)
        const frag = document.createDocumentFragment()
        const startDiv = document.createElement("div")
        startDiv.innerText = this.start ? formatTime(this.start) : ''
        startDiv.classList.add("start")
        frag.appendChild(startDiv)
        const stopDiv = document.createElement("div")
        stopDiv.innerText = this.end ? formatTime(this.end) : ''
        stopDiv.classList.add("end")
        frag.appendChild(stopDiv)
        const roomDiv = document.createElement("div")
        roomDiv.innerText = this.room || ""
        roomDiv.classList.add("room")
        frag.appendChild(roomDiv)
        const labelDiv = document.createElement("div")
        labelDiv.innerText = this.label || ""
        labelDiv.classList.add("label")
        frag.appendChild(labelDiv)
        this.appendChild(frag)
        this.isHydrated = true
    }

    get label() {
        return this.attributes?.getNamedItem("label")?.value
    }
    get type() {
        return this.attributes.getNamedItem("type")?.value
    }
    get room() {
        return this.attributes.getNamedItem("room")?.value
    }
}

const scheduleEntryGuard = (anything: any): anything is ScheduleEntry => {
    return anything instanceof ScheduleEntry
}

export { ShowmeSchedule, ScheduleEntry }
