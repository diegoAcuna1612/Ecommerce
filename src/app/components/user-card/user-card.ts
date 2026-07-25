import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
})
export class UserCard {
    @Input() name:string='Nombre de usuario';
    @Input() email:string='Correo de usuario';

}
