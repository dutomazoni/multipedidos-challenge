import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {WebsocketService} from "../websocket.service";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-modal',
  template: `
    <div class="overlay">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">
            <h1>Pesagem</h1>
          </div>
          <button type="button" class="btn close" aria-label="Close" (click)="closeModal()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Configurações da Balança:</p>
          <div class="scale-config">
            <label for="mode">Modo:</label>
            <select id="mode" [(ngModel)]="selectedValue" (ngModelChange)="onChange($event)">
              <option value="g">Gramas</option>
              <option value="kg">Kg</option>
            </select>
          </div>
          <br/>
          <ul>
            <li style="color: green">Livre: R$ 30,00</li>
            <li style="color: #fa6400">Kg: R$ 50,00</li>
          </ul>
          <p style="text-align: center">Peso inicial:</p>
          <p style="text-align: center">{{ currWeight ? currWeight + ' g' : '' }}</p>
          <button type="button" class="btn" [disabled]="disableBtn" (click)="sendMessage()">Novo Pedido</button>
          <p style="font-weight: bold"> {{ receivedWeight ? 'Pedido recebido!' : '' }}</p>
          <p>Peso estabilizado: {{ receivedWeight ? (receivedWeight + ' ' + receivedUnit) : ('') }}</p>
          <p>Valor: {{ receivedValue ? 'R$ ' + receivedValue : '' }}</p>
          <div *ngIf="receivedMode==='Kg'">
            <p>Modo: <span style="color: #fa6400">{{ receivedMode }}</span></p>
          </div>
          <div *ngIf="receivedMode!=='Kg'">
            <p>Modo: <span style="color: green">{{ receivedMode }}</span></p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" (click)="closeModal()">Fechar</button>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  selectedValue: string = 'g';
  currWeight: string = '0.00';
  weightArray: number[] = [];
  receivedWeight: string = ''
  receivedValue: string = ''
  receivedMode: string = ''
  receivedUnit: string = ''
  disableBtn: boolean = false

  constructor(
    public activeModal: NgbActiveModal,
    private websocketService: WebsocketService
  ) {
  }

  closeModal(): void {
    this.activeModal.close();
  }

  onChange(newValue: any): void {
    this.selectedValue = newValue
  }

  sendMessage(): void {
    this.disableBtn = true
    this.websocketService.sendMessage({message: 'start', measureUnit: this.selectedValue, weight: this.weightArray });
  }

  ngOnInit() {
    this.websocketService.getMessages().subscribe((message) => {
      console.log('Received message:', {message});
      if(message.weight) {
        this.receivedValue = message.value;
        this.receivedMode = message.mode;
        this.receivedWeight = message.weight
        this.receivedUnit = message.unit;
      } else {
        this.currWeight = message.currWeight[0];
        this.weightArray = message.currWeight
      }
      this.disableBtn = false

    });
  }
}
