import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild
} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import imagesWork from './imagesWork.json'
import images from './images.json'

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
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

  workData = imagesWork
  images = images

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  ngAfterViewInit(): void {
    const videoElement =
      document.querySelector<HTMLVideoElement>('.illus-brand-video')

    if (videoElement) {
      videoElement.autoplay = true
      videoElement.loop = true
      videoElement.muted = true
      videoElement.playsInline = true
      videoElement.src = '../assets/video/video.webm'
      videoElement.className = 'illus-brand-video'
    }
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
          ? this.workData.length - 1
          : this.currentIndex - 1
      this.fadeIn()
      this.cdr.detectChanges()
    }, 400)
  }

  nextSlide() {
    this.fadeOut()
    setTimeout(() => {
      this.currentIndex =
        this.currentIndex === this.workData.length - 1
          ? 0
          : this.currentIndex + 1
      this.fadeIn()
      this.cdr.detectChanges()
    }, 400)
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

  // onTouchStart(event: TouchEvent, container: HTMLElement) {
  //   this.isDragging = true
  //   this.startX = event.touches[0].pageX - container.offsetLeft
  //   this.scrollLeft = container.scrollLeft

  //   container.classList.add('paused')
  // }

  // onTouchMove(event: TouchEvent, container: HTMLElement) {
  //   if (!this.isDragging) return
  //   const x = event.touches[0].pageX - container.offsetLeft
  //   const walk = x - this.startX
  //   container.scrollLeft = this.scrollLeft - walk
  // }

  // onTouchEnd(container: HTMLElement) {
  //   this.isDragging = false
  //   container.classList.remove('paused')
  // }

  openModalImg(image: string, description: string): void {
    this.currentImageDescription = description
    this.currentImage = image
    this.isModalOpen = true
    if (this.isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }

  closeModalImg(): void {
    this.isModalOpen = false
    this.currentImage = ''
    if (this.isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }

  currentImageWork = this.workData[this.currentIndex]

  changeImage(index: number): void {
    this.currentIndex = index
    this.currentImageWork = this.workData[index]
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
      .post('https://voronkov-back.vercel.app/submit-form', formData)
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
          }, 3400)
        },
        (error) => {
          console.error('Error submitting form', error)
          this.isSubmitting = false
          this.renderer.removeClass(document.body, 'active')
        }
      )
  }
}
