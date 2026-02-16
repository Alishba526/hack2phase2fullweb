// Service to handle todo operations
import { Todo } from '../types/todo';
import { authService } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

class TodoService {
  private baseUrl = `${API_BASE_URL}/todos/`;  // Added trailing slash to prevent redirect

  // Get all todos for the current user
  async getTodos(completed?: boolean): Promise<Todo[]> {
    try {
      let url = this.baseUrl;
      if (completed !== undefined) {
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}completed=${completed}`;
      }

      const response = await authService.makeAuthenticatedRequest(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return (await response.json()) as Todo[];
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch todos:', response.status, errorText);
        throw new Error(`Failed to fetch todos: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }

  // Create a new todo
  async createTodo(todoData: { title: string; description?: string }): Promise<Todo> {
    try {
      const response = await authService.makeAuthenticatedRequest(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        console.error('Failed to create todo:', response.status, errorText);
        throw new Error(`Failed to create todo: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  // Update a todo
  async updateTodo(id: string, todoData: { title?: string; description?: string; is_completed?: boolean }): Promise<Todo> {
    try {
      const response = await authService.makeAuthenticatedRequest(`${this.baseUrl}${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        console.error('Failed to update todo:', response.status, errorText);
        throw new Error(`Failed to update todo: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<boolean> {
    try {
      const response = await authService.makeAuthenticatedRequest(`${this.baseUrl}${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return true;
      } else {
        const errorText = await response.text();
        console.error('Failed to delete todo:', response.status, errorText);
        throw new Error(`Failed to delete todo: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }
}

export const todoService = new TodoService();