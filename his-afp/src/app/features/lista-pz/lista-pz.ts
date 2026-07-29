import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabellaPz } from '../../pattern/tabella-pz/tabella-pz';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'his-lista-pz',
  imports: [TabellaPz, ToastModule],
  templateUrl: './lista-pz.html',
  styleUrl: './lista-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class ListaPz {}
