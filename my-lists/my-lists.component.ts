import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Add this

@Component({
  selector: 'app-my-lists',
  imports: [CommonModule,FormsModule],
  templateUrl: './my-lists.component.html',
  styleUrl: './my-lists.component.css'
})
export class MyListsComponent {
  newTask: string = '';
  tasks: string[] = [];

  dodawanietasks(){
    if( this.newTask.trim()){
      this.tasks.push(this.newTask.trim());
      this.newTask ='';
    }
  }

  usuwanietasks(id: number){
    this.tasks.splice(id, 1);
  }
}
