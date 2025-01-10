import { isPlatformBrowser } from '@angular/common'
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild
} from '@angular/core'
import { trigger, transition, style, animate } from '@angular/animations'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [animate('800ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})
export class AppComponent {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef
  isActive: boolean = false
  activeCardIndex: number | null = null
  isBrowser: boolean
  activeBlock = ''
  activeModal: boolean = false
  isModalOpen = false
  currentImage: string = ''
  currentImageDescription: string = ''
  currentIndex = 0

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private http: HttpClient
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
    if (this.activeCardIndex === 0) {
      this.selectedPrice = '800'
    } else if (this.activeCardIndex === 1) {
      this.selectedPrice = '1200'
    } else if (this.activeCardIndex === 2) {
      this.selectedPrice = '1600'
    }
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

  images = [
    {
      src: 'assets/images/work-illus/adobe-allus.png',
      alt: 'Adobe Allus',
      description: 'Adobe Allus'
    },
    {
      src: 'assets/images/work-illus/adobe.png',
      alt: 'Adobe',
      description: 'Adobe'
    },
    {
      src: 'assets/images/work-illus/api.png',
      alt: 'API',
      description: 'API'
    },
    {
      src: 'assets/images/work-illus/lend-api.png',
      alt: 'Lend API',
      description: 'Lend API'
    },
    {
      src: 'assets/images/work-illus/nvidia.png',
      alt: 'NVIDIA',
      description: 'NVIDIA'
    }
  ]

  openModalImg(image: string, description: string): void {
    this.currentImageDescription = description
    this.currentImage = image
    this.isModalOpen = true
  }

  closeModalImg(): void {
    this.isModalOpen = false
    this.currentImage = ''
  }

  imagesWork = [
    {
      main: '../assets/images/test-1.png',
      blured: '../assets/images/test-1.png',
      title: 'Nvidia',
      description:
        'Once again, “How would I draw illustrations for this blog?”. This is what I got:'
    },
    {
      main: '../assets/images/test-2.png',
      blured: '../assets/images/test-2.png',
      title: 'Adobe',
      description:
        'Adobe – a powerful tool for graphic designers and digital artists.'
    }
  ]

  currentImageWork = this.imagesWork[this.currentIndex]

  changeImage(index: number): void {
    this.currentIndex = index
    this.currentImageWork = this.imagesWork[index]
  }

  prevSlide() {
    this.currentIndex =
      this.currentIndex === 0
        ? this.imagesWork.length - 1
        : this.currentIndex - 1
  }

  nextSlide() {
    this.currentIndex =
      this.currentIndex === this.imagesWork.length - 1
        ? 0
        : this.currentIndex + 1
  }

  touchStartX: number = 0
  touchEndX: number = 0

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].clientX
    this.handleSwipe()
  }

  handleSwipe(): void {
    const swipeDistance = this.touchEndX - this.touchStartX
    if (swipeDistance > 50) {
      this.prevSlide() // Свайп вліво
    } else if (swipeDistance < -50) {
      this.nextSlide() // Свайп вправо
    }
  }

  isMobile(): boolean {
    return window.innerWidth < 768
  }

  isTablet(): boolean {
    return window.innerWidth < 1200
  }

  // FORM LOGIC

  email: string = ''
  selectedPrice: string = ''
  message: boolean = false

  submitForm() {
    const formData = {
      email: this.email,
      price: this.selectedPrice
    }

    this.http
      .post('https://voronkov-back.onrender.com/submit-form', formData)
      .subscribe(
        (response) => {
          console.log('Form submitted successfully', response)
          this.message = true
          setTimeout(() => {
            this.email = ''
            this.selectedPrice = ''
            this.activeModal = false
            this.renderer.removeClass(document.body, 'active-modal')
            this.message = false
          }, 3200)
        },
        (error) => {
          console.error('Error submitting form', error)
        }
      )
  }
}
