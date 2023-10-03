import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../servicios/api.service';
import { LoginService } from '../servicios/auth/login.service';
import IdleTimer from '../../assets/IdleTimer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  menu: any = [
    {
      id: 0,
      name: "Inicio",
      icon: "fa-house-user",
      tab: "dashboard/home"
    },
    {
      id: 1,
      name: "Categorías",
      icon: "fa-layer-group",
      tab: "dashboard/categorias"
    },
    {
      id: 2,
      name: "Artículos",
      icon: "fa-cubes",
      tab: "dashboard/articulos"
    },
    {
      id: 3,
      name: "Análisis",
      icon: "fa-chart-column",
      tab: "dashboard/analisis"
    },
    {
      id: 4,
      name: "Configuración",
      icon: "fa-gears",
      tab: "dashboard/settings"
    }
  ];

  actualView: number = 0;

  userData: any;

  timer: any;

  imgAvatar: any;

  constructor(private router: Router, private api: ApiService, private login: LoginService) {
    this.userData = JSON.parse(localStorage.getItem("currentUser") as any);
  }

  ngOnInit(): void {
    this.login.getImagenFuncionario({ identificacion: this.userData.identificacion}).subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        this.imgAvatar = "../../assets/img/" + response.result;
      }
    });

    let t = localStorage.getItem("_expiredTime");
    if (t == null || t == undefined) {
      localStorage.removeItem("_expiredTime");

      this.timer = new IdleTimer({
        timeout: 60 * 5, //expired after 10 min
        onTimeout: () => {
          this.logout();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.timer = null;
  }

  goTab(item: any) {
    this.actualView = item.id;
    this.router.navigate([item.tab]);
  }

  logout() {
    localStorage.clear();
    setTimeout(() => {      
      this.router.navigate(['login']);    
    }, 100);
  }

}
