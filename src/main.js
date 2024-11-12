import { NavLink, NavController, MobileMenuButton, ReactiveMenu } from './components/navigation'
import { ImageContainer, ImageHolder } from './components/image'
import { ShowmeSchedule, ScheduleEntry } from './components/schedule'
import { PageContent, PageContainer } from './components/page' 

customElements.define('nav-link', NavLink)
customElements.define('nav-controller', NavController)
customElements.define('image-container', ImageContainer)
customElements.define('image-holder', ImageHolder)
customElements.define('showme-schedule', ShowmeSchedule)
customElements.define('schedule-entry', ScheduleEntry)
customElements.define('page-content', PageContent)
customElements.define('page-container', PageContainer)
customElements.define('mobile-menu-button', MobileMenuButton)
customElements.define('reactive-menu', ReactiveMenu)