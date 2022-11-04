import { MantineProvider, MantineThemeOverride } from '@mantine/core'
import { ModalsProvider as MantineModalsProvider } from '@mantine/modals'
import { NotificationsProvider as MantineNotificationsProvider } from '@mantine/notifications'
import type { RC } from '@itsumono/react'

const theme: MantineThemeOverride = {
  colorScheme: 'light',
}

const UIProvider: RC.WithChildren = ({ children }) => {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles withCSSVariables theme={theme}>
      <MantineNotificationsProvider>
        <MantineModalsProvider>{children}</MantineModalsProvider>
      </MantineNotificationsProvider>
    </MantineProvider>
  )
}

export default UIProvider
