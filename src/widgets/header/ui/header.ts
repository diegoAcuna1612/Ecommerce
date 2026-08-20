import { Component } from '@angular/core';
import { Button } from '@shared/ui';
@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
})
export class Header {

  handleIniciarSesion(event:MouseEvent){
    console.log('Inicar sesion handle')
  }
}
