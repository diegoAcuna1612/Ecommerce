import { Component, input,output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
})
export class Button {
  title= input<string>('')
  isDisabled = input<boolean>(false);
  onClick=output<MouseEvent>()
  

}
