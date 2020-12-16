import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
 baseURL = 'http://localhost:5000/api/evento';

 constructor(private http: HttpClient) { }

 getAllEvento(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseURL);
 }

  getEventoByTema(tema: string): Observable<Evento[]> {
  return this.http.get<Evento[]>(`${this.baseURL}/getByTema/${tema}`);
}

getEventoById(id: number): Observable<Evento[]> {
 return this.http.get<Evento[]>(`${this.baseURL}/${id}`);
}

// recebimento via POST dos formuláios
// tslint:disable-next-line: typedef
postEvento(evento: Evento) {
   return this.http.post(`${this.baseURL}`, evento);
}

// tslint:disable-next-line: typedef
putEvento(evento: Evento) {
   return this.http.put(`${this.baseURL}/${evento.id}`, evento);
}

// tslint:disable-next-line: typedef
deleteEvento(id: number) {
   return this.http.delete(`${this.baseURL}/${id}`);
}

}
