import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { PatientManager } from '../../core/Pazienti/patient-manager';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from "primeng/button";
import { RouterLink } from '@angular/router';

interface Status {
  label: string;
  value: string; 
}

@Component({
  selector: 'his-cambia-status-pz',
  imports: [SelectModule, FormsModule, ToastModule, ButtonModule],
  templateUrl: './cambia-status-pz.html',
  styleUrl: './cambia-status-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CambiaStatusPz {
  patientManager = inject(PatientManager);
  private messageService = inject(MessageService);
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) {}

  status: Status[] = [
    { label: 'In Attesa', value: 'ATT' },
    { label: 'In Visita', value: 'VIS' },
    { label: 'Osservazione Breve Intensiva', value: 'OBI'},
    { label: 'Ricovero', value: 'RIC' },
    { label: 'Dimesso', value: 'DIM' },
  ];

  selectedStatus: string | undefined;

  public cambiaStatus() {
    if (this.selectedStatus){
      this.patientManager.changePatientStatus(this.config.data.id, this.selectedStatus)
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'OK',
            detail: 'Stato aggiornato!'
          });
          this.ref.close(true);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'ERROR',
            detail: 'Aggiornamento fallito!'
          })
        }
      })
    }
  }
}
