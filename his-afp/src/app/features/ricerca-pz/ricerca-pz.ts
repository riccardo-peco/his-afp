import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PatientManager } from '../../core/Pazienti/patient-manager';
import { CommonModule } from '@angular/common';
import { PazienteDTO } from '../../core/Pazienti/Pazienti.model';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'his-ricerca-pz',
  imports: [
    CommonModule,
    InputTextModule,
    TableModule,
    DatePicker,
    ButtonModule
  ],
  templateUrl: './ricerca-pz.html',
  styleUrl: './ricerca-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RicercaPz {
  patientManager = inject(PatientManager);

  readonly maxDate = new Date();

  public onSearchByCF(codiceFiscale: string): void {
    const CF = codiceFiscale.trim().toUpperCase();

    if (CF) {
      this.patientManager.searchPatientByCF(CF);
    }
  }

  public onSearchByAnag(nome: string, cognome: string, dataNascita: Date | string): void {
    if(nome && cognome && dataNascita){

      let dataFormattata: string = '';
      if (dataNascita instanceof Date) {
        const anno = dataNascita.getFullYear();
        const mese = String(dataNascita.getMonth() + 1).padStart(2, '0');
        const giorno = String(dataNascita.getDate()).padStart(2, '0');

        dataFormattata = `${anno}-${mese}-${giorno}`;
      }

      this.patientManager.searchPatientByAnag(nome, cognome, dataFormattata);
    }
  }

  public onSelectPatient(paziente: PazienteDTO): void {
    this.patientManager.selectPatient(paziente);
  }
}