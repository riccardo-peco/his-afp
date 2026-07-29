import { inject, Injectable, signal } from '@angular/core';
import { PatientAdmission, PatientAdmissionRes, Paziente, PazienteDTO } from './Pazienti.model';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../models/APIResponse.model';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PatientManager {
  timer_id = signal<number>(-1);
  #http = inject(HttpClient);
  readonly #router = inject(Router);
  #listaPZ = signal<Paziente[]>([]);
  #listaPZFiltered = signal<Paziente[]>(this.#listaPZ());
  listaPZ = this.#listaPZFiltered.asReadonly();
  
  risultatiRicerca = signal<PazienteDTO[]>([]);
  pazienteSelezionato = signal<Partial<PazienteDTO> | null>(null);
  attivaNuovoPaziente = signal<boolean>(false);
  giaCercato = signal<boolean>(false);
  apriForm = signal<boolean>(false);

  // constructor() {
  //   this.fetchPazienti();
  // }

  /**
   * Creazione timer di t secondi
   */
  public refreshPazienti() {
    if (this.timer_id() >= 0) return;
    let id = setInterval(() => this.fetchPazienti(), 1000);
    this.timer_id.set(id);
  }

  public stopRefreshPazienti() {
    clearInterval(this.timer_id());
    this.timer_id.set(-1);
  }

  public fetchPazienti() {
    this.#http.get<APIResponse<PazienteDTO[]>>(`/api/admissions`).subscribe({
      next: (res) => {
        const pz = res.data.map((p) => this.mapPazienteDTOToPaziente(p));
        this.#listaPZ.set(pz);
      },
      error: (err) => {
        console.error('Errore durante il fetch dei pazienti:', err);
      },
    });
  }

  public admitPatient(pz: PatientAdmission) {
    this.#http
      .post<APIResponse<PatientAdmissionRes>>(`api/admissions`, pz)
      .subscribe({
        next: (res) => {
          this.#router.navigate([`/lista-pz`]);
          window.location.reload();
        },
        error: (err) => {
          console.error("Errore durante l'ammissione del paziente:", err);
        },
      });
  }

  public updatePatientInfo(pzId: number, residenza: PatientAdmission['residenza']) {
    this.#http
      .patch<APIResponse<PatientAdmissionRes>>(`api/patients/${pzId}`, residenza)
      .subscribe({
        next: (res) => {
          this.#router.navigate([`/lista-pz`]);
        },
        error: (err) => {
          console.error("Errore durante l'aggiornamento delle informazioni del paziente:", err);
        },
      });
  }

  public mapPazienteDTOToPaziente(pz: PazienteDTO): Paziente {
    return {
      id: pz.id.toString(),
      nome: pz.nome,
      cognome: pz.cognome,
      braccialetto: pz.braccialetto,
      codiceColore: pz.coloreCode,
      note: pz.noteTriage,
      patologia: pz.patologiaCode,
      eta: this.calcolaEta(pz.dataNascita),
    };
  }

  public calcolaEta(dataNascita: string): number {
    const today = new Date();
    const birthDate = new Date(dataNascita);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  public filterByName(name: string) {
    const filtered = this.#listaPZ().filter((p) => {
      const fullName = `${p.nome} ${p.cognome}`.toLowerCase();
      return fullName.includes(name.toLowerCase());
    });
    this.#listaPZFiltered.set(filtered);
  }

  public searchPatientByCF(codiceFiscale: string) {
    const CFpulito = codiceFiscale.trim().toUpperCase();

    this.#http
      .get<APIResponse<PazienteDTO[]>>(`/api/patients/search`, {
        params: {cf: CFpulito}
      })
      .subscribe({
        next: (res) => {
          this.giaCercato.set(true);

          if (res.status === 'success' && res.data) {
            this.risultatiRicerca.set(res.data);
          } else {
            this.risultatiRicerca.set([])
          }
        },
        error: (err) => {
          this.giaCercato.set(true);
          console.error("Errore durante la ricerca nel DB tramite CF: ", err);
          this.risultatiRicerca.set([]);
        }
      });
  }

  public searchPatientByAnag(nome: string, cognome: string, dataNascita:string) {
    this.#http
      .get<APIResponse<PazienteDTO[]>>(`/api/patients/search`, {
        params: {
          nome: nome.trim(),
          cognome: cognome.trim(),
          data_nascita: dataNascita 
        }
      })
      .subscribe({
        next: (res) => {
          this.giaCercato.set(true);
          if (res.status === 'success' && res.data) {
            this.risultatiRicerca.set(res.data);
          } else {
            this.risultatiRicerca.set([]);
          }
        },
        error: (err) => {
          console.error("Errore durante la ricerca nel DB tramite nome, cognome e dataNascita: ", err);
          this.giaCercato.set(true);
          this.risultatiRicerca.set([]);
        } 
      });
  }
  
  public selectPatient(paziente: PazienteDTO) {
    this.attivaNuovoPaziente.set(false);
    this.pazienteSelezionato.set(paziente);
    this.apriForm.set(true);

    this.#router.navigate(['/accettazione-pz'])
  }

  public apriFormPaziente (datiRicerca?: { nome?: string, cognome?: string, cf?: string, dataNascita?: string }) {
    this.attivaNuovoPaziente.set(true);

    this.pazienteSelezionato.set({
      id: 0,
      nome: datiRicerca?.nome || '',
      cognome: datiRicerca?.cognome || '',
      codiceFiscale: datiRicerca?.cf || '',
      dataNascita: datiRicerca?.dataNascita || '',
      sex: ''
    });

    this.apriForm.set(true);
    this.#router.navigate(['/accettazione-pz'])
  }
}