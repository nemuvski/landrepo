import { Alert } from '@mantine/core'
import { useMemo, useState } from 'react'
import type { RC } from '@itsumono/react'

export type MessageBarContent = {
  level: 'info' | 'success' | 'warning' | 'error'
  title?: string
  description: JSX.Element | string
}

export function useMessageBar(initial?: MessageBarContent | null) {
  return useState<MessageBarContent | null | undefined>(initial)
}

const MessageBar: RC.WithoutChildren<{ content?: MessageBarContent | null }> = ({ content }) => {
  const color = useMemo(() => {
    if (!content) return undefined
    if (content.level === 'error') return 'red'
    if (content.level === 'warning') return 'yellow'
    if (content.level === 'success') return 'green'
    if (content.level === 'info') return 'cyan'
  }, [content])
  if (!content) {
    return null
  }
  return (
    <Alert title={content.title} color={color}>
      {content.description}
    </Alert>
  )
}

export default MessageBar
