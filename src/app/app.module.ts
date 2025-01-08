import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { CommonModule, NgClass } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms' 

@NgModule({
  imports: [NgClass, CommonModule, BrowserModule, FormsModule],
  exports: [],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
