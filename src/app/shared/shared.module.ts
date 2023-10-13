import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputComponent } from './components/input/input.component';
import { HeaderComponent } from './components/header/header.component';
import { QuestionComponent } from './components/question/question.component';
import { NewFormComponent } from './components/new-form/new-form.component';



@NgModule({
  declarations: [
    InputComponent,
    HeaderComponent,
    QuestionComponent,
    NewFormComponent
  ],
  exports: [
    InputComponent,
    HeaderComponent,
    QuestionComponent,
    NewFormComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SharedModule { }
