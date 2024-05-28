import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

// Define the Todo type
interface Todo {
  id: string;
  content: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const client = generateClient<Schema>();

  useEffect(() => {
    async function fetchTodos() {
      const todos = await client.models.Todo.list();
      setTodos(todos.items);
    }

    fetchTodos();
  }, []); // Add an empty dependency array to run only once

  async function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      const newTodo = await client.models.Todo.create({ content });
      setTodos([...todos, newTodo]);
    }
  }

  async function deleteTodo(id: string) {
    await client.models.Todo.delete({ id });
    setTodos(todos.filter(todo => todo.id !== id));
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>My todos</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
                {todo.content}
              </li>
            ))}
          </ul>
          <div>
            <a href="https://docs.amplify.aws/ui/start">
              Review next step of this tutorial.
            </a>
          </div>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
