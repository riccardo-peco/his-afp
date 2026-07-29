import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { DatePicker } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Fieldset } from 'primeng/fieldset';
import { PatientManager } from '../../core/Pazienti/patient-manager';
import { PazienteDTO, PatientAdmission } from '../../core/Pazienti/Pazienti.model';
import { GestioneRisorse } from '../../core/Risorse/gestione-risorse';

@Component({
  selector: 'his-accettazione-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    Message,
    DatePicker,
    SelectModule,
    Textarea,
    Fieldset,
  ],
  templateUrl: './accettazione-form.html',
  styleUrls: ['./accettazione-pz.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccettazioneForm implements OnChanges {
  @Input() selectedPatient: Partial<PazienteDTO> | null = null;
  @Input() showForm = false;

  gestioneRisorse = inject(GestioneRisorse);
  patientManager = inject(PatientManager);
  readonly #fb = inject(FormBuilder);

  readonly maxDate = new Date();
  readonly sexOption = [
    { code: 'M', desc: 'Maschio' },
    { code: 'F', desc: 'Femmina' },
  ];

  paziente = this.#fb.group({
    anagrafica: this.#fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      dataNascita: [null as Date | string | null, [Validators.required]],
      codiceFiscale: [
        '',
        [Validators.required, Validators.pattern('[A-Z]{6}\\d{2}[A-Z]\\d{2}[A-Z]\\d{3}[A-Z]')],
      ],
      sesso: ['', [Validators.required]],
    }),
    sanitaria: this.#fb.group({
      patologia: ['', [Validators.required]],
      codiceColore: ['', [Validators.required]],
      modArrivo: ['', [Validators.required]],
      noteTriage: ['', [Validators.required, Validators.maxLength(500)]],
    }),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPatient']) {
      this.syncSelectedPatient();
    }
  }

  private syncSelectedPatient(): void {
    const pSelected = this.selectedPatient;
    const anagraficaGroup = this.paziente.get('anagrafica');

    if (!pSelected) {
      this.paziente.reset();
      this.paziente.get('anagrafica')?.enable();
      return;
    }

    const dataConvertita = pSelected.dataNascita ? new Date(pSelected.dataNascita) : null;

    anagraficaGroup?.patchValue({
      nome: pSelected.nome || '',
      cognome: pSelected.cognome || '',
      codiceFiscale: pSelected.codiceFiscale || '',
      dataNascita: dataConvertita || '',
      sesso: pSelected.sex || '',
    });

    if (pSelected.id && pSelected.id !== 0) {
      anagraficaGroup?.disable();
    } else {
      anagraficaGroup?.enable();
    }
  }

  checkFormControl(control: string) {
    const fc = this.paziente.get(control);
    return fc?.invalid && (fc.touched || fc.dirty);
  }

  checkFormControlError(control: string, err: string) {
    const fc = this.paziente.get(control);
    if (fc && fc.hasError(err)) {
      return fc.getError(err);
    }
    return null;
  }

  resetSanitaria() {
    this.paziente.get('sanitaria')?.reset();
  }

  onSubmit() {
    if (this.paziente.valid) {
      const formValue = this.paziente.getRawValue();
      const dataStringa =
        typeof formValue.anagrafica.dataNascita === 'string'
          ? formValue.anagrafica.dataNascita
          : formValue.anagrafica.dataNascita?.toISOString().split('T')[0] || '';

      const payload: PatientAdmission = {
        anagrafica: {
          nome: formValue.anagrafica.nome ?? '',
          cognome: formValue.anagrafica.cognome ?? '',
          dataNascita: dataStringa,
          codiceFiscale: formValue.anagrafica.codiceFiscale ?? '',
          sesso: formValue.anagrafica.sesso ?? '',
        },
        sanitaria: {
          patologia: formValue.sanitaria.patologia ?? '',
          codiceColore: formValue.sanitaria.codiceColore ?? '',
          modArrivo: formValue.sanitaria.modArrivo ?? '',
          noteTriage: formValue.sanitaria.noteTriage ?? '',
        },
        residenza: {
          via: '',
          civico: '',
          comune: '',
          provincia: '',
        },
      };

      this.patientManager.admitPatient(payload);
    }
  }
}
