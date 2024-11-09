import { NavController } from "./navigation"

class PageContent extends HTMLElement {
    
}

class PageContainer extends HTMLElement {
    navController?: NavController
    connectedCallback(){
        const par = this.parentElement
        if (navControllerGuard(par)){
            this.navController = par
            this.navController.attachPageContainer(this)
        } else {
            console.log("PageContainer failed to connect to NavController")
        }
    }
}

const  navControllerGuard = (anything: any): anything is NavController => {
    return anything instanceof NavController
}

const  pageContainerGuard = (anything: any): anything is PageContainer => {
    return anything instanceof PageContainer
}

export { PageContainer, PageContent, pageContainerGuard, navControllerGuard }