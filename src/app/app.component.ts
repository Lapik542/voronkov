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
  touchStartX: number = 0
  touchEndX: number = 0
  email: string = ''
  message: boolean = false
  isSubmitting: boolean = false
  selectedPack: string = ''
  customText: string = ''
  selectedPrice: string = ''

  imagesWork = [
    {
      main: '../assets/images/my-works/adobe.webp',
      blured: '../assets/images/my-works/adobe.webp',
      title: 'ADOBE',
      description:
        'One day I saw an Adobe blog and thought, “How would I draw illustrations for this blog?”'
    },
    {
      main: '../assets/images/my-works/neuron.webp',
      blured: '../assets/images/my-works/neuron.webp',
      title: 'NEURON AI',
      description: 'Images for the "NEURON AI" Project Telegram Channel'
    },
    {
      main: '../assets/images/my-works/nvidia.webp',
      blured: '../assets/images/my-works/nvidia.webp',
      title: 'NVIDIA',
      description:
        'Once again, “How would I draw illustrations for this blog?”. This is what I got:'
    },
    {
      main: '../assets/images/my-works/tgse.webp',
      blured: '../assets/images/my-works/tgse.webp',
      title: 'TGSE',
      description:
        'A short story about the process of creating social media posts for TGSE'
    },
    {
      main: '../assets/images/my-works/unexa.webp',
      blured: '../assets/images/my-works/unexa.webp',
      title: 'UNEXA',
      description:
        'A short story about the process of creating illustrations for Unexa'
    }
  ]

  images = [
    {
      src: '../assets/images/work-illus/ADOBE-1.webp',
      alt: 'ADOBE',
      description: 'ADOBE'
    },
    {
      src: '../assets/images/work-illus/ADOBE.webp',
      alt: 'ADOBE',
      description: 'ADOBE'
    },
    {
      src: '../assets/images/work-illus/ALCHEMY.webp',
      alt: 'ALCHEMY',
      description: 'ALCHEMY'
    },
    {
      src: '../assets/images/work-illus/LEND-API.webp',
      alt: 'LEND API',
      description: 'LEND API'
    },
    {
      src: '../assets/images/work-illus/NEURON-AI.webp',
      alt: 'NEURON AI',
      description: 'NEURON AI'
    },
    {
      src: '../assets/images/work-illus/NVIDIA-2.webp',
      alt: 'NVIDIA',
      description: 'NVIDIA'
    },
    {
      src: '../assets/images/work-illus/NVIDIA.webp',
      alt: 'NVIDIA',
      description: 'NVIDIA'
    },
  ]

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
    if (!this.openModalMobile) {
      document.body.style.overflow = 'auto'
    }
    if (this.activeModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }

  closeModal() {
    this.activeModal = false
    if (!this.openModalMobile) {
      document.body.style.overflow = 'auto'
    }
    if (this.activeModal) {
      document.body.style.overflow = 'hidden'
    } else {
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

  openModalImg(image: string, description: string): void {
    this.currentImageDescription = description
    this.currentImage = image
    this.isModalOpen = true
  }

  closeModalImg(): void {
    this.isModalOpen = false
    this.currentImage = ''
  }

  currentImageWork = this.imagesWork[this.currentIndex]

  changeImage(index: number): void {
    this.currentIndex = index
    this.currentImageWork = this.imagesWork[index]
  }

  fadeOut() {
    const images = document.querySelectorAll(
      '.image-work-frilancer, .img-blure-work'
    )
    images.forEach((image) => image.classList.add('fade-out'))
  }

  fadeIn() {
    const images = document.querySelectorAll(
      '.image-work-frilancer, .img-blure-work'
    )
    images.forEach((image) => image.classList.remove('fade-out'))
  }

  prevSlide() {
    this.fadeOut()
    setTimeout(() => {
      this.currentIndex =
        this.currentIndex === 0
          ? this.imagesWork.length - 1
          : this.currentIndex - 1
      this.fadeIn()
    }, 400)
  }

  nextSlide() {
    this.fadeOut()
    setTimeout(() => {
      this.currentIndex =
        this.currentIndex === this.imagesWork.length - 1
          ? 0
          : this.currentIndex + 1
      this.fadeIn()
    }, 400)
  }

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

  selectPack(packName: string) {
    this.selectedPack = packName
    if (this.selectedPack === 'custom') {
      this.selectedPack = 'custom'
    }
  }

  submitForm() {
    if (this.selectedPack === 'custom') {
      this.selectedPack = this.customText
    }

    const formData = {
      email: this.email,
      pack: this.selectedPack
    }

    if (this.isSubmitting) return
    this.isSubmitting = true

    this.http
      .post('https://voronkov-back.onrender.com/submit-form', formData)
      .subscribe(
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
            this.message = false
            if (!this.activeModal) {
              document.body.style.overflow = 'auto'
            }
          }, 3200)
        },
        (error) => {
          console.error('Error submitting form', error)
          this.isSubmitting = false
          this.renderer.removeClass(document.body, 'active')
        }
      )
  }
}
