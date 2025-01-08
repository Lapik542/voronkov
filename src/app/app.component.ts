import { isPlatformBrowser } from '@angular/common'
import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  Renderer2
} from '@angular/core'

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isActive: boolean = false
  activeCardIndex: number | null = null
  isBrowser: boolean
  activeBlock = ''
  activeModal: boolean = false
  selectedPrice: string = '#'

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  @HostListener('window:scroll', []) onWindowScroll() {
    this.activeBlock = document.elementFromPoint(0, 100)?.id || ''
  }

  openModal() {
    this.activeModal = true
    this.renderer.addClass(document.body, 'active-modal')
  }

  closeModal() {
    this.activeModal = false
    this.renderer.removeClass(document.body, 'active-modal')
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  setActiveCard(index: number) {
    this.activeCardIndex = index
  }

  onMouseDown() {
    this.isActive = true
  }

  onMouseUp() {
    this.isActive = false
  }

  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
