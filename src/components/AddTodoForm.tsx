// Add Todo Form Component
'use client'

import React, { useState } from 'react'
import { CreateTodoData } from '@/types'

interface AddTodoFormProps {
  onAdd: (todoData: CreateTodoData) => void
  isLoading: boolean
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<CreateTodoData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title.trim()) {
      onAdd(formData)
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
      })
      setIsOpen(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
    })
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          + Add New Todo
        </button>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Todo Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What do you need to do?"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add more details..."
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as CreateTodoData['priority'] })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Todo'}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}