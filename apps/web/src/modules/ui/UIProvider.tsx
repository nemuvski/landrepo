import { MantineProvider } from '@mantine/core'
import type { RC } from '@itsumono/react'

const UIProvider: RC.WithChildren = ({ children }) => {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles withCSSVariables theme={{ colorScheme: 'light' }}>
      {children}
    </MantineProvider>
  )
}

export default UIProvider
