import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MainContainerComponent } from './components/main-container/main-container.component';
import { FormComponent } from './components/form/form.component';
import { HighlighterComponent } from './components/highlighter/highlighter.component';
import { FormsModule } from '@angular/forms';
// import { SentenceHighlighterComponent } from './components/sentence-highlighter/sentence-highlighter.component';
// import { ParagraphHighlighterComponent } from './components/paragraph-highlighter/paragraph-highlighter.component';
// import { CustomHighlighterComponent } from './components/custom-highlighter/custom-highlighter.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainContainerComponent,
    FormComponent,
    HighlighterComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule//for two way data binding
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
