import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2/src/sweetalert2.js'


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  user: UserModel = new UserModel();
  remindUser: boolean = false;

  constructor ( private authService: AuthService, private router: Router ) { }

  onSubmit( registerForm: NgForm ) {
    if( registerForm.invalid ) return;

    Swal.fire({
      allowOutsideClick: false,
      text: 'Creando Cuenta',
      icon: 'info',
      width: 300,
      showCloseButton: true,
      showClass: { popup: 'animated__faster fadeInDown' },
      hideClass: { popup: 'animated__faster fadeOutUp' }
    });
    Swal.showLoading();
    
    this.authService.register( this.user ).subscribe(
      response => {
        Swal.close();
        if( this.remindUser ){
          console.log(this.remindUser);
          localStorage.setItem('remindEmail', this.user.email);
        } else {
          localStorage.removeItem('remindEmail');
        }
        registerForm.resetForm();
        this.router.navigateByUrl('/home');
      },
      error => {
        Swal.fire({
          title: 'Registro Fallido',
          text: error.error.error.message,
          icon: 'question',
          width: 300,
          showCloseButton: true,
          showCancelButton: false,
          showConfirmButton: false,
          showClass: { popup: 'animated__faster fadeInDown' },
          hideClass: { popup: 'animated__faster fadeOutUp' }
        });
      });
  }


}
