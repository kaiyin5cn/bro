import { useEffect, useRef } from 'react'

interface SSEData {
  type: string
  data: any
}

export const useSSE = (url: string, onMessage: (data: SSEData) => void, enabled: boolean = true) => {
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onMessageRef = useRef(onMessage)
  
  // Update ref when callback changes
  onMessageRef.current = onMessage

  useEffect(() => {
    if (!enabled) return

    const token = localStorage.getItem('token')
    if (!token) return

    const connect = () => {
      const eventSource = new EventSource(`${url}?token=${token}`)
      eventSourceRef.current = eventSource

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onMessageRef.current(data)
        } catch (error) {
          console.error('Failed to parse SSE data:', error)
        }
      }

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error)
        eventSource.close()
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, 5000)
      }
    }

    connect()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [url, enabled])

  return {
    close: () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }
}