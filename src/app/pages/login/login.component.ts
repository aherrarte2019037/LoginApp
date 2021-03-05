import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2/src/sweetalert2.js'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  user: UserModel = new UserModel();
  remindUser: boolean = false;

  constructor ( private authService: AuthService, private router: Router ) { }

  ngOnInit() {
    this.user.email = localStorage.getItem('remindEmail');
    if(this.user.email) this.remindUser = true;
  }

  onSubmit( loginForm: NgForm ) {
    if (loginForm.invalid) return;

    Swal.fire({
      allowOutsideClick: false,
      text: 'Iniciando Sesión',
      icon: 'info',
      width: 300,
      showCloseButton: true,
      showClass: { popup: 'animated__faster fadeInDown' },
      hideClass: { popup: 'animated__faster fadeOutUp' }
    });
    Swal.showLoading();

    this.authService.login( this.user ).subscribe( 
        response => {
          Swal.close();
          if( this.remindUser ){
            localStorage.setItem('remindEmail', this.user.email);
          } else {
            localStorage.removeItem('remindEmail');
          }
          this.router.navigateByUrl('/home');
          
        },
        error => {
          Swal.fire({
            title: 'Inicio Fallido',
            text: error.error.error.message,
            icon: 'question',
            width: 300,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            showClass: { popup: 'animated__faster fadeInDown' },
            hideClass: { popup: 'animated__faster fadeOutUp' }
          });
        }
      );
  }

}
