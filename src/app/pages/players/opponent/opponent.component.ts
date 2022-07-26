import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Opponent, OpponentSql } from '../interfaces';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-opponent',
  templateUrl: './opponent.component.html',
  styleUrls: ['./opponent.component.scss']
})
export class OpponentComponent implements OnInit, OnChanges {

  @Output() outputOpponents: EventEmitter<OpponentSql[]> = new EventEmitter<OpponentSql[]>();
  @Input() opponents: Opponent[] = [];
  @Input() changeStatus: boolean = false;
  @Input() error: boolean | undefined;
  @Input() editFilteredOpponents: Opponent[] | undefined = undefined;
  @Input() editChosenOpponents: Opponent[] | undefined = undefined;
  @Input() edition: boolean = false;
  @Input() isView: boolean | undefined;

  environment = environment;

  constructor(private fb: FormBuilder) { }

  formOpponent: FormGroup = new FormGroup({});

  filteredOpponents: Opponent[] = [];
  chosenOpponents: Opponent[] = [];
  opponentsId: OpponentSql[] = [];

  ngOnInit(): void {
    this.formOpponent = this.fb.group({
      opponent: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['edition']?.currentValue === true) {
      this.filteredOpponents = [...this.editFilteredOpponents!];
      this.chosenOpponents = [...this.editChosenOpponents!];
      this.setOpponentsId(this.chosenOpponents);
      this.outputOpponents.emit(this.opponentsId);
    } else {
      this.formOpponent.reset();
      this.filteredOpponents = this.opponents;
      this.chosenOpponents = [];
      this.opponentsId = [];
      this.outputOpponents.emit([]);
    }
  }

  ngAfterViewInit() {
    if (!this.edition) {
      this.filteredOpponents = this.opponents;
    }
  }

  addOpponent() {
    const id: string = this.formOpponent.get('opponent')?.value;
    const index: number = this.filteredOpponents.findIndex(op => op.id === id);
    this.chosenOpponents.push(this.filteredOpponents[index]);
    this.opponentsId.push({ id: this.filteredOpponents[index].id });
    this.outputOpponents.emit(this.opponentsId);
    this.formOpponent.reset();
    this.filteredOpponents.splice(index, 1);
  }

  removeOpponent(id: string) {
    const index: number = this.chosenOpponents.findIndex(op => op.id === id);
    this.chosenOpponents.splice(index, 1);
    const op: Opponent = this.opponents.find(el => el.id === id)!;
    this.filteredOpponents.push(op);
    this.opponentsId = this.opponentsId.filter(e => e.id !== op.id);
    this.outputOpponents.emit(this.opponentsId);
  }

  setOpponentsId(opponents: Opponent[]) {
    opponents.forEach(op => { this.opponentsId.push({ id: op.id }); });
  }

}
