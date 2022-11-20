import styled from '@emotion/styled'
import type { RC } from '@itsumono/react'

const Main = styled.main`
  max-width: 35rem;
  margin: 0 auto;
  padding: 7.5rem 0.75rem;
`

const ContentFirstLayout: RC.WithChildren = ({ children }) => {
  return <Main>{children}</Main>
}

export default ContentFirstLayout
