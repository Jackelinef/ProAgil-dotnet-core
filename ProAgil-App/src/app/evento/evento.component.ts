import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';

// covertendo datas para formato ot-br
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ptBrLocale } from 'ngx-bootstrap/locale';

defineLocale('pt-br', ptBrLocale);

// BsLocaleService, ptBrLocale

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.scss'],
})
 export class EventoComponent implements OnInit {

   eventosFiltrados: Evento[];
   eventos: Evento[];
   evento: Evento;
   modoSalvar: string;

   imagemLargura = 50; // variavel de largura da imagem
   imagemMargem = 2; // variavel de margem da imagem
   mostrarImagem = false;
   // modalRef: BsModalRef;
   registerForm: FormGroup;
   bodyDeletarEvento = '';

// tslint:disable-next-line: variable-name
  _filtroLista = ''; // propriedade de filtro da lista
  // tslint:disable-next-line:

  constructor(
     private eventoService: EventoService,
     private modalService: BsModalService,
     private fb: FormBuilder,
     private localeService: BsLocaleService
     ) {
        this.localeService.use('pt-br');
     }

  // encapsulamento da propriedade _filtroLista
  get filtroLista(): string {
     return this._filtroLista;
  }
  set filtroLista(value: string) {
     this._filtroLista = value;
     this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
     // vai receber a filtragem do item ou todos os itens
  }

  // tslint:disable-next-line: typedef
  editarEvento(evento: Evento, template: any) {
       this.modoSalvar = 'put';
       this.openModal(template);
       this.evento = evento;
       this.registerForm.patchValue(evento);
  }

  // tslint:disable-next-line: typedef
  novoEvento(template: any) {
       this.modoSalvar = 'post';
       this.openModal(template);
  }

  // excluir Evento
  // tslint:disable-next-line: typedef
  excluirEvento(evento: Evento, template: any) {
      this.openModal(template);
      this.evento = evento;
      this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.tema}`;
  }

  // tslint:disable-next-line: typedef
  confirmeDelete(template: any) {
     this.eventoService.deleteEvento(this.evento.id).subscribe(
        () => {
           template.hide();
           this.getEventos();
         }, error => {
            console.log(error);
         });
}

  // tslint:disable-next-line: typedef
  openModal(template: any) {
      // this.modalRef = this.modalService.show(template)
      this.registerForm.reset();
      template.show();
  }
  /* vai ser executado antes da interface ser implementada e do html e css ficarem prontos para carregar */
  ngOnInit(): void {
     this.validation();
     this.getEventos();
  }

  filtrarEventos(filtrarPor: string): Evento[] {
      // vai retornar os itens em cada filtragem
      filtrarPor = filtrarPor.toLocaleLowerCase();
      return this.eventos.filter(
         (evento) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
      );
  }

  // tslint:disable-next-line: typedef
  alternarImagem() {
     this.mostrarImagem = !this.mostrarImagem; // vai fazer com que as imagens suma da tela
  }
  // tslint:disable-next-line: typedef
  validation(): void {
       this.registerForm = this.fb.group({
        // tslint:disable-next-line: new-parens
        // validaçoes dos campos
        tema: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
        // tslint:disable-next-line: new-parens
        local: new FormControl('', [Validators.required, Validators.maxLength(10)]),
        // tslint:disable-next-line: new-parens
        dataEvento: new FormControl('', Validators.required),
        // tslint:disable-next-line: new-parens
        qtdPessoas: new FormControl('', [Validators.required, Validators.max(300)]),
        // tslint:disable-next-line: new-parens
        imagemUrl: new FormControl('', Validators.required),
        // tslint:disable-next-line: new-parens
        telefone: new FormControl('', Validators.required),
        // tslint:disable-next-line: new-parens
        email: new FormControl('', [Validators.required, Validators.email])

     });
       console.log(this.registerForm);
  }

  // salva as alteraçoes apos inserir novos registros na base de dados
  // tslint:disable-next-line: typedef
  salvarAlteracao(template: any) {
     // verificaçao se o formulário está válidado
     if (this.registerForm.valid) {
        if (this.modoSalvar === 'post') {
          this.evento = Object.assign({}, this.registerForm.value); // vai copiar todos os valores do formulário
          this.eventoService.postEvento(this.evento).subscribe(
            (novoEvento: Evento) => {
               console.log(novoEvento);
               template.hide();
               this.getEventos(); // vai atualizar com os novos eventos inseridos
            }, (error) => {
               console.log(error);
            }
         );
        } else {
            this.evento = Object.assign({id: this.evento.id }, this.registerForm.value); // vai copiar todos os valores do formulário
            this.eventoService.putEvento(this.evento).subscribe(
            (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos(); // vai atualizar com os novos eventos inseridos
            }, (error) => {
            console.log(error);
           }
         );
        }

     }
  }

  getEventos(): void {
     /* this.eventos = this.http.get('http://localhost:5000/api/values'); */
     this.eventoService.getAllEvento().subscribe((eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
        console.log(eventos);
      }, error => {
           console.log(error);
        });
  }

}
