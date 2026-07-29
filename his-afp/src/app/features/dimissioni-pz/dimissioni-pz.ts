import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PatientManager } from '../../core/Pazienti/patient-manager';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'his-dimissioni-pz',
  imports: [TableModule, DatePipe, TagModule],
  templateUrl: './dimissioni-pz.html',
  styleUrl: './dimissioni-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DimissioniPz {
  patientManager = inject(PatientManager);

  // Richiamo i dimessi
  ngOnInit(){
    this.patientManager.fetchDimissioni();
  }
}
