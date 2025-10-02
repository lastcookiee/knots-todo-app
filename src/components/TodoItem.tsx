// Individual Todo Item Component  
'use client'

import React, { useState } from 'react'
import { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onUpdate: (todoId: string, updates: Partial<Todo>) => void
  onDelete: (todoId: string) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')

  const priorityColors = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800', 
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  }

  const handleToggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed })
  }

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setIsEditing(false)
  }

  const handlePriorityChange = (priority: Todo['priority']) => {
    onUpdate(todo.id, { priority })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 ${
      todo.completed ? 'opacity-75 border-gray-200' : 'border-gray-200 hover:border-blue-300'
    }`}>
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
        />

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {isEditing ? (
            /* Edit Mode */
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent break-words"
                placeholder="Todo title"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent break-words resize-none"
                placeholder="Description (optional)"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div>
              <h3 className={`text-lg font-medium break-words overflow-wrap-anywhere ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`mt-1 text-sm break-words overflow-wrap-anywhere ${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Priority Badge */}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[todo.priority]}`}>
                    {todo.priority}
                  </span>
                  
                  {/* Date */}
                  <span className="text-xs text-gray-500">
                    Created {formatDate(todo.createdAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {/* Priority Selector */}
                  <select
                    value={todo.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as Todo['priority'])}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => onDelete(todo.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}