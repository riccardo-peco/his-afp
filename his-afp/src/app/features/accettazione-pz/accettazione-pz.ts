import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { GestioneRisorse } from '../../core/Risorse/gestione-risorse';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { DatePicker } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Fieldset } from 'primeng/fieldset';
import { PatientManager } from '../../core/Pazienti/patient-manager';


@Component({
  selector: 'his-accettazione-pz',
  imports: [
    InputText,
    ReactiveFormsModule,
    Button,
    Message,
    DatePicker,
    SelectModule,
    Textarea,
    Fieldset,
  ],
  templateUrl: './accettazione-pz.html',
  styleUrl: './accettazione-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccettazionePz {
  gestioneRisorse = inject(GestioneRisorse);
  patientManager = inject(PatientManager);

  readonly maxDate = new Date();
  readonly sexOption = [
    {
      code: 'M',
      desc: 'Maschio',
    },
    {
      code: 'F',
      desc: 'Femmina',
    },
  ];

  readonly #fb = inject(FormBuilder);

  paziente = this.#fb.group({
    anagrafica: this.#fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      dataNascita: [null as Date | string | null, [Validators.required]],
      codiceFiscale: [
        '',
        [Validators.required, Validators.pattern('[A-Z]{6}\\d{2}[A-Z]\\d{2}[A-Z]\\d{3}[A-Z]')],
        // {pattern: {requiredPattern: '^[a-zA-Z ]*$', actualValue: '1'}}
      ],
      sesso: ['', [Validators.required]],
    }),
    sanitaria: this.#fb.group({
      patologia: ['', [Validators.required]],
      codiceColore: ['', [Validators.required]],
      modArrivo: ['', [Validators.required]],
      noteTriage: ['', [Validators.required, Validators.maxLength(500)]],
    })
  });

  constructor() {
    effect(() => {
      const pSelected = this.patientManager.pazienteSelezionato();

      if(pSelected) {
        const anagraficaGroup = this.paziente.get('anagrafica');

        const dataConvertita = pSelected.dataNascita ? new Date(pSelected.dataNascita) : null;

        anagraficaGroup?.patchValue({
          nome: pSelected.nome || '',
          cognome: pSelected.cognome || '',
          codiceFiscale: pSelected.codiceFiscale || '',
          dataNascita: dataConvertita || '',
          sesso: pSelected.sex || ''
        });

        if (pSelected.id && pSelected.id !== 0) {
          anagraficaGroup?.disable();
        } else {
          anagraficaGroup?.enable();
        }

      } else {
        this.paziente.reset();
        this.paziente.get('anagrafica')?.enable();
      }
    });
  }

  checkFormControl(control: string) {
    const fc = this.paziente.get(control);
    // nome.invalid && (nome.touched || nome.dirty)
    return fc?.invalid && (fc.touched || fc.dirty);
  }

  checkFormControlError(control: string, err: string) {
    const fc = this.paziente.get(control);

    if (fc && fc.hasError(err)) {
      return fc.getError(err);
    } else {
      return null;
    }
  }

  resetSanitaria() {
    console.log('RESET SANITARIA');

    this.paziente.get('sanitaria')?.reset();

    console.log(this.paziente.getRawValue());
  }

  onSubmit() {
    if (this.paziente.valid) {
      const formValue = this.paziente.getRawValue();
      
      let dataStringa = typeof formValue.anagrafica.dataNascita === 'string' 
        ? formValue.anagrafica.dataNascita 
        : formValue.anagrafica.dataNascita?.toISOString().split('T')[0] || '';

      const payload = {
        anagrafica: {
          nome: formValue.anagrafica.nome ?? '',
          cognome: formValue.anagrafica.cognome ?? '',
          dataNascita: dataStringa,
          codiceFiscale: formValue.anagrafica.codiceFiscale ?? '',
          sesso: formValue.anagrafica.sesso ?? ''
        },
        sanitaria: {
          patologia: formValue.sanitaria.patologia ?? '',
          codiceColore: formValue.sanitaria.codiceColore ?? '', 
          modArrivo: formValue.sanitaria.modArrivo ?? '',       
          noteTriage: formValue.sanitaria.noteTriage ?? ''      
        },
        residenza: {
          via: '',
          civico: '',
          comune: '',
          provincia: ''
        }
      };

      this.patientManager.admitPatient(payload);
    }
  }
}