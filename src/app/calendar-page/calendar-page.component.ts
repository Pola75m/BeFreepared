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
import { CalendarComponent } from "../calendar/calendar.component";
import { Meetings } from '../calendar/meetings.interface';
import { TaskService } from '../task.service';


@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './calendar-page.component.html'
})
export class CalendarPageComponent {
  meetings: Meetings = {};
  userId: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.userId = user?.Uid;
    if (this.userId) {
      this.taskService.getTasksForUser(this.userId).subscribe((tasks) => {
        tasks.forEach(task => {
          if (task.deadline) {
            const date = DateTime.fromISO(task.deadline).toISODate()!;
            if (!this.meetings[date]) {
              this.meetings[date] = [];
            }
            this.meetings[date].push(task.task_name);
          }
        });
      });
    }
  }
}
