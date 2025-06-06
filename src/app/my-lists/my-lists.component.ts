import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../task.service';
import { CalendarComponent } from '../calendar/calendar.component';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-my-lists',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: 'my-lists.component.html',
})
export class MyListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = {id: '', task_name: '', task_status: '', deadline: '', userId: '' };
  userId: string ='';
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) {}

  // interface do meetingow
  get meetings(): { [date: string]: string[] } {
    const result: { [date: string]: string[] } = {};

    for (const task of this.tasks) {
      if (!task.deadline || task.deadline === null) continue;

      const date = task.deadline;

      if (!result[date]) {
        result[date] = [];
      }
      result[date].push(task.task_name);
    }
    return result;
  }


  // formatowanie daty
  formatDate(dateString: string): string {
    if (dateString === null || !dateString) return '-';
    //const date = new Date(dateString);
    return DateTime.fromISO(dateString, { zone: 'utc' }).startOf('day').toFormat('yyyy-MM-dd');
  }

  // pokazywanie istniejacych zadan
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.userId = user?.Uid;
    this.fetchTasks();
  }

  // dodawanie zadan
  addTask() {
    if (!this.newTask.task_name || !this.userId) return;
    this.newTask.userId= this.userId;

    if (!this.newTask.deadline) {
      this.newTask.deadline = null;
    }
    this.taskService.addTask(this.newTask).subscribe((task) => {
      if (task.deadline === '-' || task.deadline === null) {
        task.deadline = null;
      } else {
        task.deadline = this.formatDate(task.deadline);
      }
      this.tasks.push(task);
      this.newTask = { id: '', task_name: '', task_status: '', deadline: '', userId: '' };
      // w takiej kolejnosci jak w bazie danych ^
    });
  }

  // edytowanie zadan
  startEdit(task: Task) {
    this.editingTask = { ...task };
    if (!this.editingTask.deadline || this.editingTask.deadline === '-') {
      this.editingTask.deadline = '';
    }
  }
  saveEdit() {
    if (!this.editingTask) return;
    if (!this.editingTask.deadline || this.editingTask.deadline === '') {
      this.editingTask.deadline = null;
      }
    this.taskService.updateTask(this.editingTask).subscribe(
      (updatedTask) => {
        const index = this.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = {
            ...this.tasks[index],
            ...updatedTask
          };
        }

        this.editingTask = null;
        this.fetchTasks();
        
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }
  cancelEdit() {
    this.editingTask = null;
  }

  // usuwanie zadan
  deleteTask(id: string) {
    if (!confirm('Jesteś pewny, że chcesz usunąć to zadanie? Nie będzie można cofnąć :c ')) return;
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.fetchTasks();
    },
    (error) => {
      console.error('Błąd usuwania zadania', error);
    }
    );
  }

  // zebranie zadan w calosc
  fetchTasks() {
    if (!this.userId) return;
    this.tasks = [];
    this.taskService.getTasksForUser(this.userId).subscribe((tasks) => {
      this.tasks = tasks
      .map(task => ({
        ...task,
        deadline: task.deadline === null || task.deadline === '-' ? '-' : this.formatDate(task.deadline)
      }))
    });
  }
}
