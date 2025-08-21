import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Currency formatting
export function formatCurrency(amount: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

// Number formatting
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

// Weight/quantity formatting
export function formatQuantity(quantity: number, unit: string): string {
  return `${formatNumber(quantity)} ${unit}`
}

// File size formatting
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// String utilities
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Array utilities
export function groupBy<T>(array: T[], keyFn: (item: T) => string | number): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item).toString()
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+254|0)[17][0-9]{8}$/
  return phoneRegex.test(phone)
}

// Color utilities for status
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    active: 'text-green-600 bg-green-100',
    inactive: 'text-gray-600 bg-gray-100',
    pending: 'text-yellow-600 bg-yellow-100',
    completed: 'text-blue-600 bg-blue-100',
    cancelled: 'text-red-600 bg-red-100',
    approved: 'text-green-600 bg-green-100',
    rejected: 'text-red-600 bg-red-100',
    open: 'text-green-600 bg-green-100',
    closed: 'text-gray-600 bg-gray-100',
    in_progress: 'text-blue-600 bg-blue-100',
    delivered: 'text-green-600 bg-green-100',
    in_transit: 'text-blue-600 bg-blue-100',
    available: 'text-green-600 bg-green-100',
    sold: 'text-gray-600 bg-gray-100',
    reserved: 'text-yellow-600 bg-yellow-100',
    low_stock: 'text-orange-600 bg-orange-100',
    out_of_stock: 'text-red-600 bg-red-100',
    expired: 'text-red-600 bg-red-100',
  }
  return statusColors[status] || 'text-gray-600 bg-gray-100'
}

export function getPriorityColor(priority: string): string {
  const priorityColors: Record<string, string> = {
    High: 'text-red-600 bg-red-100',
    Medium: 'text-yellow-600 bg-yellow-100',
    Low: 'text-green-600 bg-green-100',
  }
  return priorityColors[priority] || 'text-gray-600 bg-gray-100'
}

// Time utilities
export function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

export function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Analytics utilities
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

// Sorting utilities
export function sortByDate<T>(array: T[], dateField: keyof T, ascending: boolean = false): T[] {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateField] as string).getTime()
    const dateB = new Date(b[dateField] as string).getTime()
    return ascending ? dateA - dateB : dateB - dateA
  })
}

export function sortByField<T>(array: T[], field: keyof T, ascending: boolean = true): T[] {
  return [...array].sort((a, b) => {
    const valA = a[field]
    const valB = b[field]
    
    if (typeof valA === 'string' && typeof valB === 'string') {
      return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    
    if (typeof valA === 'number' && typeof valB === 'number') {
      return ascending ? valA - valB : valB - valA
    }
    
    return 0
  })
}

// Search utilities
export function searchItems<T>(items: T[], searchTerm: string, fields: (keyof T)[]): T[] {
  if (!searchTerm.trim()) return items
  
  const lowercaseSearch = searchTerm.toLowerCase()
  
  return items.filter(item =>
    fields.some(field => {
      const value = item[field]
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowercaseSearch)
      }
      if (Array.isArray(value)) {
        return value.some(v => 
          typeof v === 'string' && v.toLowerCase().includes(lowercaseSearch)
        )
      }
      return false
    })
  )
}

// Generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Local storage utilities
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setToLocalStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove from localStorage:', error)
  }
}