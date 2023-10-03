import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from '../views/home/home.component';
import { AnalisisComponent } from '../views/analisis/analisis.component';
import { CategoriaComponent } from '../views/categoria/categoria.component';
import { ArticuloComponent } from '../views/articulo/articulo.component';
import { SettingComponent } from '../views/setting/setting.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, canActivateChild: [AuthGuard], children:
    [
      { path: 'home', component: HomeComponent },
      { path: 'categorias', component: CategoriaComponent },
      { path: 'articulos', component: ArticuloComponent },
      { path: 'analisis', component: AnalisisComponent },
      { path: 'settings', component: SettingComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
