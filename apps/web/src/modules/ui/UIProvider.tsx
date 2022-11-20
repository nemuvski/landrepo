import { MantineProvider } from '@mantine/core'
import { ModalsProvider as MantineModalsProvider } from '@mantine/modals'
import { NotificationsProvider as MantineNotificationsProvider } from '@mantine/notifications'
import type { RC } from '@itsumono/react'
import type { MantineThemeOverride } from '@mantine/core'

const theme: MantineThemeOverride = {
  colorScheme: 'light',
  globalStyles: (theme) => ({
    html: {
      fontSize: theme.fontSizes.md,
    },
    body: {
      backgroundColor: theme.colors.gray[0],
      fontSize: '1rem',
    },
  }),
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
