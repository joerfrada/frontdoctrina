import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api.service';
import { CategoriaService } from 'src/app/servicios/modulos/categoria.service';

declare var Swal:any;

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent {

  cat: any = {
    nombre: '',
    orden: 1,
    usuario: ''
  };

  categories: any = [];
  loading: boolean = false;
  loadingmodal: boolean = false;
  modal: boolean = false;
  errormodal: boolean = false;
  confirm: boolean = false;
  selectedCat = 0;

  currentUser: any;

  constructor(private router: Router, private api: ApiService, private categoria: CategoriaService) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser") as any);
  }

  ngOnInit(): void {
    this.initData();
  }

  reload() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  showloader(show: boolean){
    let timeout = show ? 0 : 500;
    setTimeout(() => {
      this.loading = show;
    }, timeout);
  }

  initData(){
    this.showloader(true);
    this.categoria.getCategorias().subscribe((data: any) => {
      let response: any = data;
      if (response.tipo == 0) {
        if (response.result.length > 0) {
          this.categories = response.result;
          this.showloader(false);
        }
      }
    })
  }

  closeModal() {
    this.modal = false;
    this.errormodal = false;
    this.cat = {
      nombre: '',
      orden: 0,
      usuario: this.currentUser.usuario
    };
  }

  createCat() {
    this.cat.usuario = this.currentUser.usuario;

    for (let key in this.cat) {
      if (this.cat[key] == '') {
        this.errormodal = true;
        return;
      }
    }
    this.loadingmodal = true;
    this.categoria.createCategorias(this.cat).subscribe(data => {
      let response: any = data;
      if (response.tipo == 0) {
        Swal.fire({
          title: 'Crear Categoría',
          text: response.mensaje,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          icon: 'success'
        }).then((result: any) => {
          this.modal = false;
          this.loadingmodal = false;
          this.reload();
        });
      }
    })
  }

  selectCat(id: any) { 
    if (id > 0 ) {
      this.confirm = true;
      this.selectedCat = id;
    } 
  }

  delete() {
    this.loadingmodal = true;
    let json = {
      categoria_id: this.selectedCat
    }
    this.categoria.deleteCategoria(json).subscribe(data => {
      let response: any = data;
      if (response.tipo == 0) {
        Swal.fire({
          title: 'Eliminar Categoría',
          text: response.mensaje,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          icon: 'success'
        }).then((result: any) => {
          this.modal = false;
          this.loadingmodal = false;
          this.reload();
        });
      }
    });
  }
}
