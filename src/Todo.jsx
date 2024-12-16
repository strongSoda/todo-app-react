

// create todo
// read todo
// update todo
// delete todo

import { Check, Edit2, ListTodo, Plus, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"

const LOCAL_STORAGE_KEY = 'todo-app-key'

const TodoApp = () => {

  const [todos, setTodos] = useState(() => {
    try {
      const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY)

      return storedTodos ? JSON.parse(storedTodos)  : []

    } catch (e) {
      console.error(e, 'error loading todos');  
      return []
    }
  })

  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  // calc stats
  const totalTodos = todos.length
  const completedTodos = todos.filter(todo => todo.completed).length
  const pendingTodos = totalTodos - completedTodos

  useEffect(() => {
    try {

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))

    } catch (e) {
      console.error(e);      
    }
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if(!newTodo.trim()) return

    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      createdAt: new Date().toISOString()
    }

    setTodos(prev => [...prev, todo])
    setNewTodo('')
  }

  const toggleComplete = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? {
        ...todo,
        completed: !todo.completed,
        updatedAt: new Date().toDateString()
      }
      :
      todo
    ))
  }


  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    if(!editText.trim()) return

    setTodos(prev => prev.map(todo => 
      todo.id === editingId ?
        {
          ...todo,
          text: editText,
          updatedAt: new Date().toDateString()
        }
      : todo
      
    ))
    setEditingId(null)
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const resetLocalStorage = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    } catch(e) {
      console.error(e);      
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 py-8 px-4 ">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Todo App</h1>

          {
            todos.length > 0 && (
              <button
                onClick={resetLocalStorage}
                className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                >
                  Reset All
                </button>
            )
          }
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalTodos}
            </div>
            <div className="text-sm text-gray-600">
              Total
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {completedTodos}
            </div>
            <div className="text-sm text-gray-600">
              Completed
            </div>
          </div>


          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {pendingTodos}
            </div>
            <div className="text-sm text-gray-600">
              Pending
            </div>
          </div>
        </div>

        {/* form */}
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />

            <button 
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 focus:outline-none fpcus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all flex items-center">
                <Plus size={20} />
              </button>
        </form>


        {/* empty state */}
        {todos.length === 0 && (
          <div className="text-center pv-6 text-gray-500">
            <ListTodo className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No todos yet. Add your first task!</p>
          </div>
        )}

        {/* todos list */}

        <ul className="space-y-3">
          {todos.map(todo => (
            <li 
              key={todo.id}
              className="group bg-gray-50 rounded-lg p-4 flex items-center gap-3 transform trnasition-all hover:-transalte-y-1 hover: shadow-md animate-slide-in">
                {editingId === todo.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-3 py-1 rounded vorder border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                    />
                    <button
                    onClick={saveEdit}
                    className="text-green-500 hover:text-green-600 transition-colors"
                    >
                      <Check size={20} />
                    </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) :
                
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500 transition-all" />

                  <span className={`flex-1 ${
                    todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                  } transition-all`}>
                    {todo.text}
                  </span>
                  
                  <button
                    onClick={() => startEdit(todo)}
                    className="text-gray-400 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Edit2 size={20} />
                  </button>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={20} />
                  </button>
                </>
                }
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  )
}

export default TodoApp