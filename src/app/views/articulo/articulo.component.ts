import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
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
    articulo_id: 0,
    recomendado: false,
    categoria_id: 0,
    titulo: '',
    subtitulo: '',
    descripcion: '',
    keywords: '[]',
    num_pagina: 0,
    videol: '',
    audiol: '',
    archivo_existe: 0,
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
  title: any;
  IsEdit: boolean = false;
  coverModal: boolean = false;
  docModal: boolean = false;
  audioModal: boolean = false;
  videoModal: boolean = false;

  fileCover: any;
  fileDoc: any;
  fileAudio: any;
  fileVideo: any;

  url: any;

  currentUser: any;

  constructor(private router: Router, private sanitizer: DomSanitizer, private api: ApiService, private articulo: ArticuloService, private categoria: CategoriaService) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser") as any);
  }

  ngOnInit(): void {
    this.initData();

    this.url = "<iframe src=\"{0}\" width=\"100%\" height=\"500\"><iframe>";
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

  loadImage(ctx: any, filename: any) {
    var img = new Image;
    img.src = filename;
    img.onload = () => {
      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    }
  }

  foundCats(id: any) {
    let found = this.categories.filter((cat: any) => {
      return cat.categoria_id == id;
    });
    return found.length > 0 ? found[0].name : '';
  }

  onFileChangeCover(event: any) {
    var filename = event.target.files[0].name;
    var ext = filename.split('.').pop();
    if (ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
      this.fileCover = event.target.files[0];
    }
    else {
      Swal.fire({
        title: 'ERROR',
        text: 'Por favor seleccione una imagen (jpg, jpeg y png)',
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        icon: 'error'
      });
      return;
    }
  }

  onFileChangeDoc(event: any) {
    var filename = event.target.files[0].name;
    var ext = filename.split('.').pop();
    if (ext == 'pdf') {
      this.fileDoc = event.target.files[0];
    }
    else {
      Swal.fire({
        title: 'ERROR',
        text: 'Por favor seleccione un documento PDF',
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        icon: 'error'
      });
      return;
    }
  }

  onFileChangeAudio(event: any) {
    var filename = event.target.files[0].name;
    var ext = filename.split('.').pop();
    if (ext == 'mp3' || ext == 'mp4' || ext == 'wav') {
      this.fileAudio = event.target.files[0];
    }
    else {
      Swal.fire({
        title: 'ERROR',
        text: 'Por favor seleccione un audio (mp3, mp4 y wav)',
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        icon: 'error'
      });
      return;
    }
  }

  onFileChangeVideo(event: any) {
    var filename = event.target.files[0].name;
    var ext = filename.split('.').pop();
    if (ext == 'avi' || ext == 'mov' || ext == 'mp4' || ext == 'wmv') {
      this.fileVideo = event.target.files[0];
    }
    else {
      Swal.fire({
        title: 'ERROR',
        text: 'Por favor seleccione un video (avi, mov, mp4 y wmv)',
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        icon: 'error'
      });
      return;
    }
  }

  openArticuloModal() {
    this.modal = true;
    this.title = "Crear Artículo";
    this.IsEdit = false;
  }

  editArticulo(data: any) {
    this.modal = true;
    this.title = "Actualizar Artículo - ID: " + data.articulo_id;
    this.IsEdit = true;

    this.article.articulo_id = data.articulo_id;
    this.article.recomendado = data.feature == 1 ? true : false;
    this.article.categoria_id = data.categoria_id;
    this.article.titulo = data.titulo;
    this.article.subtitulo = data.subtitulo;
    this.article.descripcion = data.descripcion;
    this.article.keywords = data.keywords;
    this.article.num_pagina = data.num_pagina;
    this.article.videol = data.videol;
    this.article.audiol = data.audiol;
    this.article.archivo_existe = data.archivo_existe;
  }

  closeModal() {
    this.modal = false;
    this.errormodal = false;
    this.article = {
      articulo_id: 0,
      recomendado: false,
      categoria_id: 0,
      titulo: '',
      subtitulo: '',
      descripcion: '',
      keywords: '[]',
      num_pagina: 0,
      videol: '',
      audiol: '',
      archivo_existe: 0,
      usuario: this.currentUser.usuario
    };
    this.reload();
  }

  createArticle() {
    this.article.categoria_id = Number(this.article.categoria_id);
    this.article.usuario = this.currentUser.usuario;

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

  updateArticle() {
    this.article.categoria_id = Number(this.article.categoria_id);
    this.article.usuario = this.currentUser.usuario;
    
    this.loadingmodal = true;

    var formData = new FormData();
    formData.append('modelo', JSON.stringify(this.article));
    formData.append('cover', this.fileCover);
    formData.append('doc', this.fileDoc);
    formData.append('audio', this.fileAudio);
    formData.append('video', this.fileVideo);

    this.articulo.updateArticulos(formData).subscribe(data => {
      let response: any = data;
      if (response.tipo == 0) {
        Swal.fire({
          title: 'Actualizar Artículo',
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

  openPreviewCover(data: any) {
    this.coverModal = true;
    this.url = this.articulo.getPreviewCover(data.articulo_id);
  }

  closePreviewCoverModal() {
    this.coverModal = true;
    this.reload();
  }

  openPreviewDoc(data: any) {
    this.docModal = true;
    this.url = this.sanitizer.bypassSecurityTrustHtml(this.url.replace("{0}", this.articulo.getPreviewDocumento(data.articulo_id) + "#zoom=100&toolbar=0"));
  }

  closePreviewDocModal() {
    this.docModal = false;
    this.reload();
  }
}
