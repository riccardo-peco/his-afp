import { Component, inject, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Button } from 'primeng/button';
import { Paziente } from '../../core/Pazienti/Pazienti.model';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { CambiaStatusPz } from '../../features/cambia-status-pz/cambia-status-pz';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'his-card-pz',
  imports: [CardModule, Button, TagModule],
  templateUrl: './card-pz.html',
  styleUrl: './card-pz.scss',
  providers: [DialogService]
})
export class CardPz {
  paziente = input.required<Paziente>();
  borderTop = input.required<boolean>();
  readonly #router = inject(Router);
  
  constructor(private dialogService: DialogService) {};

  public navigateToSchedaPaziente() {
    this.#router.navigate([`/modifica-pz/${this.paziente().id}`]);
  }

  public changeStatusPaziente(){
    this.dialogService.open(CambiaStatusPz, {
      header: 'Cambia Stato',
      width: '40rem',
      height: '30rem',
      data:{
        id: this.paziente().id,
        stato: this.paziente().stato
      }
    });
  }

  public getSeverity(stato: string){
    switch(stato) {
      case 'ATT':
        return 'secondary';
      
      case 'VIS':
        return 'info';

      case 'OBI':
        return 'warn';

      case 'RIC':
        return 'danger';

      case 'DIM':
        return 'secondary';
      
      default:
        return 'secondary';
    }
  }

  public setBorder() {
    return this.borderTop() ? 'border-t-8' : 'border-b-8';
  }

  public setColoreDiStato() {
    switch (this.paziente().codiceColore) {
      case 'ROSSO':
        return 'border-red-600';
      case 'ARANCIONE':
        return 'border-orange-400';
      case 'AZZURRO':
        return 'border-blue-600';
      case 'VERDE':
        return 'border-green-600';
      case 'BIANCO':
        return 'border-gray-600';
      default:
        return '';
    }
  }
}
