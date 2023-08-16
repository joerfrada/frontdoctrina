import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from '../views/home/home.component';
import { AnalisisComponent } from '../views/analisis/analisis.component';
import { CategoriaComponent } from '../views/categoria/categoria.component';
import { ArticuloComponent } from '../views/articulo/articulo.component';
import { SettingComponent } from '../views/setting/setting.component';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    AnalisisComponent,
    CategoriaComponent,
    ArticuloComponent,
    SettingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
