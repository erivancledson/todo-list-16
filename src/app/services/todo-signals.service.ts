import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/model/todo.model';
import { TodoKeyLocalStorage } from '../models/enum/todoKeyLocalStorage';

@Injectable({
  providedIn: 'root'
})
export class TodoSignalsService {

  //criando o signal. Signal pode melhorar o desempenho da aplicação, evitando verificações desnecessárias de detecção de mudanças
  public todosState = signal<Array<Todo>>([]);

  public updateTodos({ id, title, description, done }: Todo): void {
    if ((title && id && description !== null) || undefined) {
      // mutate é utilizado para manipular arrays. Quando se já tem na lista ele faz um push
      this.todosState.mutate((todos) => {
        if (todos !== null) {
          //se for diferente de nulo ele adiciona
          todos.push(new Todo(id, title, description, done));
        }
      });

      //atualiza o local storage com os dados atuais
      this.saveTodosInLocalStorage();
    }
  }
  //salva as todos no local storage do browser
  public saveTodosInLocalStorage(): void {
    // quando é signal se coloca feito metodo this.todosState(). aqui esta sendo convertido para  utilizar no localstorage
    const todos = JSON.stringify(this.todosState());
    todos && localStorage.setItem(TodoKeyLocalStorage.TODO_LIST, todos); //KEY do local storage e os todos
  }
}
