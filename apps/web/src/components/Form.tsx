import styled from '@emotion/styled'

export const Form = styled.form`
  width: 100%;
`
Form.defaultProps = {
  role: 'form',
  onSubmit: (event) => event.preventDefault(),
}
