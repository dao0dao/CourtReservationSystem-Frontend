import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService as PlayerService } from '../players/api.service';
import { Player } from '../players/interfaces';
import { ServicePayment, Services } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private playerService: PlayerService) { }

  getAllPlayers(): Observable<Player[]> {
    return this.playerService.getAllPlayers();
  }

  getAllServices(): Observable<{ [key: string]: Services; }> {
    return this.http.get<{ [key: string]: Services; }>(environment.apiLink + 'price/services');
  }

  submitList(list: { [key: string]: Services; }) {
    return this.http.patch<{ status: 201, message: 'created/updated'; }>(environment.apiLink + 'price/services', list);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete(environment.apiLink + 'price/services/' + id);
  }

  accountChargeOrPayment(data: ServicePayment): Observable<{ status: 201, message: 'updated'; }> {
    return this.http.post<{ status: 201, message: 'updated'; }>(environment.apiLink + 'price/services/charge', data);
  }

}
