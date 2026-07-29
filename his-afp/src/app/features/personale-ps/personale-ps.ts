import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { PersonaleManager } from '../../core/Personale/personale-manager';
import { catchError, first, map, of, switchMap, timer } from 'rxjs';
import { User } from '../../core/Personale/Personale.model';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'his-personale-ps',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    DividerModule,
    TableModule
  ],
  templateUrl: './personale-ps.html',
  styleUrl: './personale-ps.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalePs implements OnInit {
  readonly personaleManager = inject(PersonaleManager);
  readonly maxDate = new Date();
  isDialogVisible = signal<boolean>(false);
  operatoreInModifica = signal<User | null>(null);

  operatoriAttivi = computed(() => this.personaleManager.listaPS().filter( u => u.isActive));
  operatoriInattivi = computed(() => this.personaleManager.listaPS().filter( u => !u.isActive))

  // Richiami gli elementi nel DB
  ngOnInit(): void {
    this.personaleManager.fetchStaff();
  }

  //Funzione per aprire il dialog di inserimento di un nuovo operatore
  apriPerNuovo() {
    this.operatoreInModifica.set(null);
    this.personale.reset();

    this.personale.get('username')?.enable();
    this.personale.get('password')?.enable();

    this.personale.get('username')?.setValidators([Validators.required]);
    this.personale.get('password')?.setValidators([Validators.required]);

    this.personale.updateValueAndValidity();
    this.isDialogVisible.set(true);
  }

  //Funzione per aprire il dialog di modifica di un operatore
  apriPerModifica(utente: User) {
    this.operatoreInModifica.set(utente);
    this.personale.reset();

    this.personale.patchValue({
      username: utente.username,
      role: utente.role
    });

    this.personale.get('username')?.disable();
    this.personale.get('password')?.disable();

    this.isDialogVisible.set(true);
  }

  disattivaOperatore(id:number): void {
    this.personaleManager.deactivateOperator(id);
  }

  attivaOperatore(id:number): void {
    this.personaleManager.activateOperator(id);
  }

  eliminaOperatore(id:number): void {
    if (confirm("Sei sicuro di voler eliminare definitivamente questo operatore?")) {
      this.personaleManager.deleteOperator(id);
    }
  }

  onSubmit() {
    if (this.personale.invalid) {
      return; // Se ci sono errori si ferma
    }

    const datiForm = this.personale.getRawValue() as User;

    if (this.operatoreInModifica() === null) {
      // Modalità NUOVO
      this.personaleManager.addNewOperator(datiForm);
    } else {
      // Modalità MODIFICA
      const idDaModificare = this.operatoreInModifica()!.id;
      this.personaleManager.modifyOperator(idDaModificare, datiForm.role);
    }
    // Reset del popup
    this.isDialogVisible.set(false);
    this.personale.reset();
    this.operatoreInModifica.set(null);
  }

  // Funzione di controllo esistenza username
  checkUsernameExists = (control: AbstractControl) => {
    const username = control.value;

    if(!username || !username.trim()) {
      return of(null);
    }

    return timer(300).pipe(
      switchMap(() => this.personaleManager.checkUsernameExists(username.trim())),
      map(esiste => (esiste ? { usernameDuplicato: true } : null)),
      first(),
      catchError(() => of(null))
    );
  };

  checkFormControl(controlName: string): boolean {
    const control = this.personale.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  checkFormControlError(controlName: string, errorName: string): any {
    return this.personale.get(controlName)?.getError(errorName);
  }

  readonly staffOption = [
    { code: 'DOC', desc: 'Medico' },
    { code: 'INF', desc: 'Infermiere' },
    { code: 'AMM', desc: 'Amministrativo' }
  ]

  readonly #fb = inject(FormBuilder);
  personale = this.#fb.group({
    username: ['', [Validators.required], [this.checkUsernameExists]],
    password: ['', [Validators.required]],
    role: ['', [Validators.required]]
  });

  getRuoloLabel(role: string): string {
    switch(role) {
      case 'DOC':
        return 'Medico';
      case 'INF':
        return 'Infermiere';
      case 'AMM':
        return 'Amministrativo';
      default:
        return 'Sconosciuto';
    }
  }
}