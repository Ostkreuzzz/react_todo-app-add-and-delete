/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { ErrorMessages } from './types/ErrorTypes';
import { FilterTypes } from './types/FilterTypes';

import { getVisibleTodos } from './utils/getVisibleTodos';
import { handleError } from './utils/handleError';

import * as todoService from './api/todos';

import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { ErrorPannel } from './components/ErrorPannel/ErrorPannel';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosToDelete, setTodosToDelete] = useState<number[]>([]);
  const [selectedFilterType, setSelectedFilterType] = useState<FilterTypes>(
    FilterTypes.ALL,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NONE,
  );

  function handleUpload() {
    getTodos()
      .then(setTodos)
      .catch(() => handleError(setErrorMessage, ErrorMessages.LOAD_FAIL));
  }

  const isAllCompleted =
    todos.every(todo => todo.completed) && todos.length !== 0;
  const isSomeCompleted =
    todos.some(todo => todo.completed) && todos.length !== 0;
  const filteredTodos = getVisibleTodos(todos, selectedFilterType);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  function handleClearCompleted() {
    const toDelete = todos.filter(todo => todo.completed);

    setTodosToDelete(toDelete.map(todo => todo.id));
  }

  useEffect(handleUpload, [todosToDelete.length]);

  function deleteTodo(idsToDelete: number[]) {
    Promise.allSettled(
      idsToDelete.map(id => {
        todoService
          .deleteTodo(id)
          .then(() => {
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
            setTodosToDelete(() => []);
          })
          .catch(() => {
            setTodos(todos);
            handleError(setErrorMessage, ErrorMessages.DELETE_FAIL);
            setTodosToDelete(() => []);
          });
      }),
    );
  }

  function addTodo({ title, userId, completed }: Todo) {
    return todoService
      .addTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTempTodo(null);
      })
      .catch(error => {
        setTempTodo(null);
        handleError(setErrorMessage, ErrorMessages.ADD_FAIL);

        throw error;
      });
  }

  if (!!todosToDelete.length) {
    deleteTodo(todosToDelete);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onTempTodo={setTempTodo}
          onErrorMessage={setErrorMessage}
          isAllCompleted={isAllCompleted}
          onAdd={addTodo}
          todos={todos}
        />
        {!!todos.length && (
          <>
            <TodoList
              onTodosToDelete={setTodosToDelete}
              todos={filteredTodos}
              todosToDelete={todosToDelete}
              tempTodo={tempTodo}
            />
            <TodoFooter
              onSelectedFilterType={setSelectedFilterType}
              selectedFilterType={selectedFilterType}
              activeTodosCount={activeTodosCount}
              onClearCompleted={handleClearCompleted}
              isSomeCompleted={isSomeCompleted}
            />
          </>
        )}
      </div>
      <ErrorPannel errorMessage={errorMessage} />
    </div>
  );
};
