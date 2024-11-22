import { get } from "http"

class FireworkElement extends HTMLElement {
    running: boolean = false
    connectedCallback() {
        this.onmouseenter = this.handleHover
    }

    handleHover = () => {
        for (let i = 0; i < 10; i++){
            const firework = explosion('#3f337c')
            const t = getRandomInt(20, 80)
            const l = Math.random() > .2 ? getRandomInt(0, 200) : getRandomInt(0, 50) * -1
            this.append(firework)
            const animation = firework.animate([
                {transform: "scale(0)", top: `-${t}px`, left:`${l}px`},
                {transform: "scale(1.6)", top: `-${t-4}px`, left:`${l}px`}
            ], {duration:500})
            animation.onfinish = ()=> this.removeChild(firework)
        }
    }
}

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min)
    max = Math.ceil(max)
    return Math.floor(Math.random() * (max + 1 - min) + min)
}

const genIntPairs = (count: number, max:number, maxTotal: number): number[] => {
    const arr: number[] = []
    for (let i = 0; i < count*2; i+=2){
        let l = getRandomInt(1, max)
        let r = getRandomInt(2, Math.min(max, maxTotal-Math.abs(l)))
        l = Math.random() > 0.5 ? l : l * -1
        r = Math.random() < 0.5 ? r : r * -1

        if(i %4 == 0) { //alternate left and right to even out length disparity
            arr.push(l,r)
        } else {
            arr.push(r,l)
        }
    }
    return arr
}

const genNode = (tagName: string, attrs) => {
    const tag = document.createElementNS("http://www.w3.org/2000/svg", tagName)
    for (const name in attrs) tag.setAttributeNS(null, name, attrs[name])
    return tag
}

const explosion = (strokeColor: string): SVGSVGElement => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute('viewBox', '0 0 40 40')
    svg.setAttribute('width', '40px')
    svg.classList.add('firework')
    let pth = ""
    const nums = genIntPairs(30, 20, 30)
    for (let i = 0; i < nums.length; i+=2) {
        pth = pth + `M20,20l${nums[i]},${nums[i+1]}`
    }
    svg.append(genNode("path", { d: pth, stroke: strokeColor }))
    return svg
}

export { FireworkElement }
