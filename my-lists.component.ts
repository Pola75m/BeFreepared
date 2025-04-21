import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // needed for *ngFor, *ngIf
import { FormsModule } from '@angular/forms'; // <-- add this!
import { TaskService, Task } from '../task.service';

@Component({
  selector: 'app-my-lists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'my-lists.component.html',
})
export class MyListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = {idZad: '', task_name: '', userId: '', task_status: '', deadline: '' };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
  }

  addTask() {
    if (!this.newTask.task_name) return;

    this.taskService.addTask(this.newTask).subscribe((task) => {
      this.tasks.push(task);
      this.newTask = { idZad: '', task_name: '', userId: '', task_status: '', deadline: '' };
    });
  }
}
