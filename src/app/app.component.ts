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
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
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
  openModalMobile: boolean = false

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

  toggleMenu() {
    this.openModalMobile = !this.openModalMobile
    if (this.openModalMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }

  openModal() {
    this.activeModal = true
    this.openModalMobile = false
    this.renderer.addClass(document.body, 'active-modal')
    if (!this.openModalMobile) {
      document.body.style.overflow = 'auto'
    }
  }

  closeModal() {
    this.activeModal = false
    this.renderer.removeClass(document.body, 'active-modal')
    if (!this.openModalMobile) {
      document.body.style.overflow = 'auto'
    }
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
    this.openModalMobile = false
    document.body.style.overflow = 'auto'
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
      this.prevSlide()
    } else if (swipeDistance < -50) {
      this.nextSlide()
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
  message: boolean = false
  isSubmitting: boolean = false
  selectedPack: string = ''
  customText: string = ''
  selectedPrice: string = ''

  selectPack(packName: string, price: string) {
    this.selectedPack = packName
    this.selectedPrice = price
    if (this.selectedPack === 'custom') {
      this.selectedPack = 'custom'
    }
  }

  submitForm() {
    let price
    let plan
    if (this.selectedPack === 'custom') {
      plan = 'Custom Plan'
      price = this.customText
    } else {
      plan = this.selectedPack
      price = this.selectedPrice
    }

    const formData = {
      email: this.email,
      plan: plan,
      price: price
    }

    console.log(formData)

    if (this.selectedPack === 'custom' && !this.customText.trim()) {
      alert('Please enter a custom price')
      return
    }

    if (this.isSubmitting) return
    this.isSubmitting = true

    this.http.post('https://voronkov-back.onrender.com/submit-form', formData).subscribe(
      (response) => {
        console.log('Form submitted successfully', response)
        this.isSubmitting = false
        this.message = true

        setTimeout(() => {
          this.email = ''
          this.selectedPrice = ''
          this.selectedPack = ''
          this.customText = ''
          this.activeModal = false
          this.renderer.removeClass(document.body, 'active-modal')
          this.message = false
        }, 3200)
      },
      (error) => {
        console.error('Error submitting form', error)
        this.isSubmitting = false
      }
    )
  }
}
