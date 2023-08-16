import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api.service';
import { ArticuloService } from 'src/app/servicios/modulos/articulo.service';
import { CategoriaService } from 'src/app/servicios/modulos/categoria.service';

declare var Swal:any;

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss']
})
export class ArticuloComponent implements OnInit {

  article: any = {
    recomendado: false,
    categoria_id: 0,
    titulo: '',
    subtitulo: '',
    descripcion: '',
    keywords: '',
    num_pagina: 0,
    videol: '',
    audiol: '',
    usuario: ''
  };
  articles: any = [];
  categories: any = [];
  loading: boolean = false;
  loadingmodal: boolean = false;
  modal: boolean = false;
  errormodal: boolean = false;
  confirm: boolean = false;
  selectedArt = 0;

  fileCover: any;
  fileDoc: any;
  fileAudio: any;
  fileVideo: any;

  currentUser: any;

  constructor(private router: Router, private api: ApiService, private articulo: ArticuloService, private categoria: CategoriaService) {
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

  showloader(show: boolean) {
    let timeout = show ? 0 : 500;
    setTimeout(() => {
      this.loading = show;
    }, timeout);
  }

  initData() {
    this.showloader(true);

    this.articulo.getArticulos().subscribe(data => {
      let response: any = data;
      if (response.tipo == 0) {
        if (response.result.length > 0) {
          this.articles = response.result;
          this.articles.reverse();

          this.categoria.getCategorias().subscribe(data1 => {
            let response1: any = this.api.ProcesarRespuesta(data1);
            if (response.tipo == 0) {
              if (response1.result.length > 0) {
                this.categories = response1.result;
                this.showloader(false);
              }
            }
          });
        }
      }
    });
  }

  foundCats(id: any) {
    let found = this.categories.filter((cat: any) => {
      return cat.categoria_id == id;
    });
    return found.length > 0 ? found[0].name : '';
  }

  onFileChangeCover(event: any) {
    this.fileCover = event.target.files[0];
  }

  onFileChangeDoc(event: any) {
    this.fileDoc = event.target.files[0];
  }

  onFileChangeAudio(event: any) {
    this.fileAudio = event.target.files[0];
  }

  onFileChangeVideo(event: any) {
    this.fileVideo = event.target.files[0];
  }

  closeModal() {
    this.modal = false;
    this.errormodal = false;
    this.article = {
      recomendado: false,
      categoria_id: 0,
      titulo: '',
      subtitulo: '',
      descripcion: '',
      keywords: '',
      num_pagina: 0,
      videol: '',
      audiol: '',
      usuario: this.currentUser.usuario
    };
  }

  createArticle() {
    this.article.categoria_id = Number(this.article.categoria_id);
    this.article.usuario = this.currentUser.usuario;

    for (let key in this.article) {
      if (this.article[key] == '') {
        this.errormodal = true;
        return;
      }
    }
    this.loadingmodal = true;

    var formData = new FormData();
    formData.append('modelo', JSON.stringify(this.article));
    formData.append('cover', this.fileCover);
    formData.append('doc', this.fileDoc);
    formData.append('audio', this.fileAudio);
    formData.append('video', this.fileVideo);

    this.articulo.createArticulos(formData).subscribe(data => {
      let response: any = data;
      if (response.tipo == 0) {
        Swal.fire({
          title: 'Crear Artículo',
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

  selectArt(id: any) { 
    if( id > 0) {
      this.confirm = true;
      this.selectedArt = id;
    } 
  }

  delete() {
    this.loadingmodal = true;
    let json = {
      articulo_id: this.selectedArt
    }
    this.articulo.deleteArticulo(json).subscribe(data => {
      let response: any = data;
      if (response.tipo == 0) {
        Swal.fire({
          title: 'Eliminar Artículo',
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
