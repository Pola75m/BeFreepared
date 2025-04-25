import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // needed for *ngFor, *ngIf
import { FormsModule } from '@angular/forms'; // <-- add this!
import { TaskService, Task } from '../task.service';

//delete - nie dziala, wyswietla sie komunikat ale brak efektu
//savetask - rowniez jeszcze nie dziala, mozna kliknac ale nie zapisuje
//zmian jakie dokonanmy w zadaniu, forms editu sie wyswietla :)

@Component({
  selector: 'app-my-lists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'my-lists.component.html',
})
export class MyListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = {id: '', task_name: '', task_status: '', deadline: '', userId: '' };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.fetchTasks();
  }

  addTask() {
    if (!this.newTask.task_name) return;
    this.newTask.userId= '1'; // temporary hardcoded value
    this.taskService.addTask(this.newTask).subscribe((task) => {
      this.tasks.push(task);
      this.newTask = { id: '', task_name: '', task_status: '', deadline: '', userId: '' };
    });
  }


fetchTasks() {
  this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
}
}