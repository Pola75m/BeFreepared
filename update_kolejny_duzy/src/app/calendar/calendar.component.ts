import {
  Component,
  Input,
  Output,
  EventEmitter,
  Signal,
  WritableSignal,
  computed,
  signal
} from '@angular/core';
import { DateTime, Info } from 'luxon';
import { CommonModule } from '@angular/common';
import { Meetings } from './meetings.interface';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class CalendarComponent {
  @Input() meetings: Meetings | undefined;
  @Output() daySelected = new EventEmitter<DateTime | null>();
  //wazne deklaracje
  today: Signal<DateTime> = signal(DateTime.local());
  firstDayOfActiveMonth: WritableSignal<DateTime> = signal(
    this.today().startOf('month'),
  );
  activeDay: WritableSignal<DateTime | null> = signal(null);
  weekDays: Signal<string[]> = signal(Info.weekdays('short'));
  daysOfMonth: Signal<DateTime[]> = computed(() => {
    const firstDay = this.firstDayOfActiveMonth();
    const start = firstDay.startOf('week');
    const end = firstDay.endOf('month').endOf('week');

    const days: DateTime[] = [];
    let current = start;

    while (current <= end) {
      days.push(current);
      current = current.plus({ days: 1 });
    }
    return days;
  });
  //zabawa z datami
  DATE_MED = DateTime.DATE_MED;
  activeDayMeetings: Signal<string[]> = computed(() => {
    const meetings = this.meetings;
    if (!meetings) {
      return [];
    }
    const activeDay = this.activeDay();
    if (!activeDay) {
      return [];
    }
    const activeDayISO = activeDay.toISODate();
    if (activeDayISO === null) {
      return [];
    }
    return meetings[activeDayISO] ?? [];
  });
  //licznik zadan
  monthlyTaskCount: Signal<number> = computed(() => {
    const meetings = this.meetings;
    if (!meetings) {
      return 0;
    }
    const firstDay = this.firstDayOfActiveMonth();
    const month = firstDay.month;
    const year = firstDay.year;

    let count = 0;

    for (const dateStr in meetings) {
      const date = DateTime.fromISO(dateStr);
      if (date.month === month && date.year === year) {
        count += meetings[dateStr]?.length ?? 0;
      }
    }

    return count;
  });
  //funkcje...
  goToPreviousMonth(): void {
    const newMonth = this.firstDayOfActiveMonth().minus({ month: 1 });
    this.firstDayOfActiveMonth.set(newMonth);
  }

  goToNextMonth(): void {
    const newMonth = this.firstDayOfActiveMonth().plus({ month: 1 });
    this.firstDayOfActiveMonth.set(newMonth);
  }

  goToToday(): void {
    const today = this.today();
    this.firstDayOfActiveMonth.set(this.today().startOf('month'));
    this.activeDay.set(this.today());
    this.daySelected.emit(this.today());
  }

  selectDay(day: DateTime): void {
    this.activeDay.set(day);
    this.daySelected.emit(day);
  }
}
