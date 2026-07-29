import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PatientManager } from '../../core/Pazienti/patient-manager';
import { AccettazioneForm } from './accettazione-form';

@Component({
  selector: 'his-accettazione-pz',
  standalone: true,
  imports: [AccettazioneForm],
  templateUrl: './accettazione-pz.html',
  styleUrls: ['./accettazione-pz.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccettazionePz {
  patientManager = inject(PatientManager);
}
