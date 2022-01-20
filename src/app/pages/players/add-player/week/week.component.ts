import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

interface Week {
  days: {
    0?: boolean | undefined;
    1?: boolean | undefined;
    2?: boolean | undefined;
    3?: boolean | undefined;
    4?: boolean | undefined;
    5?: boolean | undefined;
    6?: boolean | undefined;
  };
  time: {
    from: string;
    to: string;
  };
}

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnInit {

  environment = environment;

  weeks: Week[] = [];
  formWeek: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  checkDay() {
    let isDay: boolean | string = '';
    for (let i = 0; i < 7; i++) {
      const day = this.formWeek.get(`${i}`);
      day?.value === true ? isDay = true : null;
    }
    this.formWeek.get('isDay')?.setValue(isDay);
    this.formWeek.get('isDay')?.updateValueAndValidity();
  }

  checkHour() {
    let isHour: boolean | string = '';
    const from = this.formWeek.get('from')?.value;
    const to = this.formWeek.get('to')?.value;
    from !== '' ? isHour = true : null;
    to !== '' ? isHour = true : null;
    this.formWeek.get('isHour')?.setValue(isHour);
    this.formWeek.get('isHour')?.updateValueAndValidity();
  }

  addTerm() {
    const week: Week = {
      days: {

      },
      time: {
        from: this.formWeek.get('from')?.value,
        to: this.formWeek.get('to')?.value
      }
    };
    for (let i = 0; i < 7; i++) {
      const day: boolean | undefined = this.formWeek.get(`${i}`)?.value;
      week.days = Object.assign({}, week.days, { [i]: day });
    }
    this.weeks.push(week);
    this.formWeek.reset();
  }

  removeTerm(index: number) {
    this.weeks = this.weeks.filter((el, i) => {
      i !== index ? el : null;
    });
  }

  ngOnInit(): void {
    this.formWeek = this.fb.group({
      isDay: ['', Validators.required],
      0: [''],
      1: [''],
      2: [''],
      3: [''],
      4: [''],
      5: [''],
      6: [''],
      isHour: ['', Validators.required],
      from: [''],
      to: ['']
    });
  }

}