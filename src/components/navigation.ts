import { PageContainer, PageContent, pageContainerGuard } from "./page"

class NavLink extends HTMLElement{
    href?: string
    connectedCallback() {
        this.href = this.attributes.getNamedItem('href')?.value
        this.addEventListener('click', this.handleClick)
    }

    disconnectedCallback(){
        this.removeEventListener('click', this.handleClick)
    }

    handleClick(){
        this.animate([
            {transform: "scale(1)"},
            {transform: "scale(1.1)"},
            {transform: "scale(1)"}
        ],{duration: 600})
        this.dispatchEvent(new CustomEvent('nav', {detail: {href: this.href }, bubbles: true}))
        const siblings = this.parentElement ? this.parentElement.children : []
        for (const sibling of siblings ) {
            if (sibling instanceof NavLink) {
                sibling.classList.remove('active')
            }
        }
        this.classList.add('active')
    } 
    
}

class NavController extends HTMLElement {
    hydratedPages: Record<string, PageContent>
    pageContainer?: PageContainer

    connectedCallback() {
        window.addEventListener('nav', this.handleNavEvent)
        window.addEventListener('popstate', this.handlePopState)
        document.addEventListener("DOMContentLoaded", this.initialLoad)
        this.hydratedPages = {};
    }

    disconnectedCallback(){
        window.removeEventListener('nav', this.handleNavEvent)
        window.removeEventListener('popstate', this.handlePopState)
        document.removeEventListener("DOMContentLoaded", this.initialLoad)
    }

    initialLoad = event => {
        let id = this.parseIdFromPath()
        if (id == ''){
            id = 'home'
        }
        this.internalNavigation(id, true)
    }

    handlePopState = event => {
        console.log(event)
        const id = event.state.id
        this.internalNavigation(id)
    }

    handleNavEvent = (event) => {
        let href = event.detail.href;
        let id = href == null ? this.parseIdFromPath() : href.slice(1)
        if (id == ''){
            id = 'home'
        }
        history.pushState({id: id}, "", href)
        this.internalNavigation(id)
    }

    internalNavigation = (id: string, initial = false) => {
        //Check if page has been hydrated
        let hydratedPage = this.hydratedPages[id];
        
        //Check for template
        if (hydratedPage == null) {
            let pageTemplate = document.getElementById(`${id}-page-template`);
            if (pageTemplate != null) {
                hydratedPage = this.hydratePage(id, pageTemplate);
            }
        }
        if (hydratedPage == null) {
            console.log('Failed to find page.')
            if (id == 'not-found') {
                console.log('Not Found fallback page missing.')
                alert('Error, failed to find page')
            } else {
                this.internalNavigation('not-found')
            }
        } else {
            this.changePages(hydratedPage, initial)
        }
    }

    parseIdFromPath(): string{
        let id = location.pathname;
        while(id.indexOf('/') == 0){
            id = id.slice(1)
        }
        const arr = id.split('/')
        return arr[0]
    }

    changePages = (pageToOpen: PageContent, initial = false) => {
        if (initial){
            pageToOpen.classList.add('open')
            return
        }
        let found;
        for (const page in this.hydratedPages) {
            const element = this.hydratedPages[page]
            if (element.classList.contains('open')){
                if (found == null){
                    found = element
                } else {
                    element.classList.remove('open')
                }
            }
        }
        if(found) {
            if(found != pageToOpen) slideOut(found, pageToOpen)
        } else {
            slideIn(pageToOpen)
        }
    }

    hydratePage(id, template) {
        const cloneFragment = template.content.cloneNode(true)
        const page = cloneFragment.children[0]
        this.pageContainer?.appendChild(cloneFragment)
        this.hydratedPages[id] = page
        return page
    }

    attachPageContainer(pageContainer: PageContainer){
        if (pageContainerGuard(pageContainer)){
            this.pageContainer = pageContainer
        }
    }
}
const slideOut = (elementOut: HTMLElement, elementIn: HTMLElement) => {
    elementOut.animate([
        {transform: "translateX(0)"},
        {transform: "translateX(100vw)"}
    ], {duration:600})
    .onfinish = _ => {
        elementOut.classList.remove('open')
        if (elementIn != null) slideIn(elementIn)
    }
}

const slideIn = (elem: HTMLElement) =>{
    elem.classList.add('left')
    elem.animate([
        {transform: "translateX(-100vw)"},
        {transform: "translateX(0)"}
    ], {duration:600})
    .onfinish = _ => {
        elem.classList.add('open')
        elem.classList.remove('left')
    }
}

export { NavLink, NavController }