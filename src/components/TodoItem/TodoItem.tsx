/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
interface Props {
  todosToDelete?: number[];
  todo: Todo;
  onTodosToDelete: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoItem: React.FC<Props> = ({
  todosToDelete,
  todo,
  onTodosToDelete,
}) => {
  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() =>
          onTodosToDelete(currentTodos => [...currentTodos, todo.id])
        }
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': !todo.id || todosToDelete?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
