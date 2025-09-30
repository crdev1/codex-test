import { reactive, readonly } from 'vue'

const alerts = reactive([])
let idCounter = 0
const DEFAULT_DURATION = 4000
const TYPES = new Set(['info', 'success', 'warning', 'error'])

function removeAlert(id) {
  const index = alerts.findIndex((alert) => alert.id === id)
  if (index !== -1) {
    const [alert] = alerts.splice(index, 1)
    if (alert?.timerId) {
      clearTimeout(alert.timerId)
    }
  }
}

export function showAlert(message, type = 'info', options = {}) {
  if (!message) {
    return null
  }

  const normalizedType = TYPES.has(type) ? type : 'info'
  const duration = typeof options.duration === 'number' ? options.duration : DEFAULT_DURATION
  const id = ++idCounter

  const alert = {
    id,
    message,
    type: normalizedType,
  }

  if (duration > 0) {
    alert.timerId = setTimeout(() => {
      removeAlert(id)
    }, duration)
  }

  alerts.push(alert)
  return id
}

export function dismissAlert(id) {
  removeAlert(id)
}

export function useAlerts() {
  return {
    alerts: readonly(alerts),
    dismiss: removeAlert,
  }
}

if (typeof window !== 'undefined') {
  window.showAlert = showAlert
}