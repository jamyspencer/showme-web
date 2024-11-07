class ImageHolder extends HTMLElement {
    connectedCallback(){
        this.src = this.attributes.getNamedItem('src').value
        this.name = this.attributes.getNamedItem('name').value
        const frag = document.createDocumentFragment()
        const img = document.createElement('img')
        img.src = this.src
        img.alt = this.name
        frag.appendChild(img)
        const text = document.createElement('span')
        text.innerText = this.name
        frag.appendChild(text)

        this.appendChild(frag)
    }
}

class ImageContainer extends HTMLElement {
    
}
export { ImageHolder, ImageContainer }