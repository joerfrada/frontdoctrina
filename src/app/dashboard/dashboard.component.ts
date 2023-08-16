import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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

  constructor(private router: Router) {
    this.userData = JSON.parse(localStorage.getItem("currentUser") as any);
  }

  ngOnInit(): void {}

  goTab(item: any) {
    this.actualView = item.id;
    this.router.navigate([item.tab]);
  }

  logout(){
    setTimeout(() => {
      localStorage.clear();
      this.router.navigate(['/']);    
    }, 100);
  }

}
