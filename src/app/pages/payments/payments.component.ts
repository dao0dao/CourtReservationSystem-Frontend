import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginStateService } from '../login-state.service';
import { Player } from '../players/interfaces';
import { ApiService } from './api.service';
import { Action, ServicePayment, Services } from './interfaces';
import { SelectHandlerService } from './select-handler.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  constructor(
    private api: ApiService,
    public selectHandler: SelectHandlerService,
    public loginService: LoginStateService
  ) { }

  environment = environment;

  services: { [key: string]: Services; } = {};

  isLoadedServices: boolean = false;
  isLoadedPlayers: boolean = false;

  players: Player[] = [];
  selectedPlayer: Player | undefined;
  playerInput: string = '';
  action: Action;

  inputCharge: number = 0;

  selectService: string = '';
  inputService: number | undefined;

  isServiceList: boolean = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.api.getAllPlayers().pipe(take(1)).subscribe((res) => {
      this.players = res;
      this.selectHandler.filteredPlayers = res;
      this.isLoadedPlayers = true;
    });
    this.api.getAllServices().subscribe((res) => {
      this.services = res;
      this.isLoadedServices = true;
    });
  }

  changeAction(name: Action) {
    this.action = name;
  }

  checkInput(e?: KeyboardEvent) {
    if (this.playerInput.length === 0 || !this.playerInput || (e?.key === 'Backspace' && this.selectedPlayer)) {
      this.resetPayments();
    }
  }

  resetPayments() {
    this.action = undefined;
    this.selectedPlayer = undefined;
    this.playerInput = '';
    this.inputCharge = 0;
    this.inputService = undefined;
    this.selectService = '';
  }

  selectPlayer() {
    this.selectedPlayer = this.selectHandler.selectPlayer();
    if (this.selectedPlayer) {
      this.playerInput = this.selectedPlayer?.name + ' ' + this.selectedPlayer?.surname;
    } else {
      this.resetPayments();
    }
  }

  selectPlayerOnClick(id: string | null) {
    if (id === null) {
      this.resetPayments();
      return;
    }
    this.selectedPlayer = this.players.find(pl => pl.id === id);
    this.playerInput = this.selectedPlayer?.name + ' ' + this.selectedPlayer?.surname;
  }

  checkCharge() {
    if (this.inputCharge !== undefined && (this.inputCharge < 0 || this.inputCharge === -0)) {
      this.inputCharge = 0;
    }
  }

  changeService() {
    if (this.selectService) {
      for (let i in this.services) {
        const s = this.services[i];
        if (s.name === this.selectService) {
          this.inputService = s.cost;
        }
      }
    } else {
      this.inputService = undefined;
    }
  }

  openServiceList() {
    this.isServiceList = true;
  }

  closeServiceList() {
    this.services = {};
    this.isServiceList = false;
    this.isLoadedServices = false;
    this.api.getAllServices().subscribe({
      next: (res) => {
        this.services = res;
        this.isLoadedServices = true;
      },
      error: (err) => {
        this.isLoadedServices = true;
      }
    });
  }

  chargeAccount() {
    const data: ServicePayment = {
      id: this.selectedPlayer?.id!,
      value: this.inputCharge,
      name: this.selectedPlayer?.name! + ' ' + this.selectedPlayer?.surname!,
      serviceName: 'Doładowanie konta',
      paymentMethod: 'charge'
    };
    this.api.accountChargeOrPayment(data).subscribe({
      next: (res) => {
        this.resetPayments();
      }
    });
  }

  getPaymentForService(paymentMethod: 'payment' | 'cash' | 'transfer') {
    const data: ServicePayment = {
      id: this.selectedPlayer?.id!,
      value: this.inputService!,
      name: this.selectedPlayer?.name! + ' ' + this.selectedPlayer?.surname!,
      serviceName: this.selectService,
      paymentMethod
    };
    this.api.accountChargeOrPayment(data).subscribe({
      next: (res) => {
        this.resetPayments();
      }
    });
  }

}
