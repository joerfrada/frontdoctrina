import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../servicios/api.service';
import { LoginService } from '../servicios/auth/login.service';

declare var Swal:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userData: any = {
    usuario: "",
    password: ""
  };
  
  loading: boolean = false;
  error: boolean = false;
  show_loader = false;

  constructor(private router: Router, private api: ApiService, private loginService: LoginService) {
    let t = localStorage.getItem("_expiredTime");
    if (t != null || t != undefined) {
      localStorage.removeItem("_expiredTime");
    }
    localStorage.setItem("isLoggedIn", "0");
  }

  ngOnInit(): void {
  }

  loginAction() {
    this.loading = true;

    this.loginService.login(this.userData).subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        this.loading = false;

        localStorage.setItem("currentUser", JSON.stringify(response.user.result));
        localStorage.setItem("isLoggedIn", "1");
        
        setTimeout(() => {
          this.router.navigate(['/dashboard/home']);
        }, 1000);        
      }
      else {
        Swal.fire({
          title: 'Error',
          text: response.mensaje,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          icon: 'error'
        }).then((result: any) => {
          if (result) {
            this.loading = false;
            this.userData.password = "";
          }
        });
      }
    });
  }

}
