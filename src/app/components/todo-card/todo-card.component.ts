import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TodoSignalsService } from 'src/app/services/todo-signals.service';
import { TodoKeyLocalStorage } from 'src/app/models/enum/todoKeyLocalStorage';
import { Todo } from 'src/app/models/model/todo.model';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgTemplateOutlet,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
  ],
  templateUrl: './todo-card.component.html',
  styleUrls: [],
})
export class TodoCardComponent implements OnInit {
  private todoSignalsService = inject(TodoSignalsService);
  //retorna os dados do array de todo
  private todosSignal = this.todoSignalsService.todosState;
  // computed para criar os valores computados, são valores que depende do valor de um signal
  public todosList = computed(() => this.todosSignal());

  public ngOnInit(): void {
    //carrega todos os dados que estão no local storage
    this.getTodosInLocalStorage();
  }

  private getTodosInLocalStorage(): void {
    //getItem ele espera a key que grava no local storage
    const todosDatas = localStorage.getItem(
      TodoKeyLocalStorage.TODO_LIST
    ) as string;
    todosDatas && this.todosSignal.set(JSON.parse(todosDatas)); //set = seta um valor para o signal
  }

  //salva as todos após deletar uma
  private saveTodosInLocalStorage(): void {
    this.todoSignalsService.saveTodosInLocalStorage();
  }

  public handleDoneTodo(todoId: number): void {
    if (todoId) {
      this.todosSignal.mutate((todos) => {
        //busca a todo pelo id
        const todoSelected = todos.find((todo) => todo?.id === todoId) as Todo;
        todoSelected && (todoSelected.done = true); //atualiza o done para true
      });
    }
  }

  public handleDeleteTodo(todo: Todo): void {
    if (todo) {
      //busca a todo
      const index = this.todosList().indexOf(todo);

      if (index !== -1) { //se realmente existir a todo
        this.todosSignal.mutate((todos) => {
          todos.splice(index, 1); //remove o valor da todo
          this.saveTodosInLocalStorage(); //salva os dados atuais das todos
        });
      }
    }
  }
}
