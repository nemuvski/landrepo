import { regexpValidEmailAddressFormat } from '@itsumono/utils'
import { Button, Box, Stack, TextInput, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { MAX_LENGTH_PASSWORD } from '@project/auth'
import { gql, useMutation } from 'urql'
import { Form } from '~/components/Form'
import type { RC } from '@itsumono/react'

type FormFieldValues = {
  email: string
  password: string
}

const SignUpForm: RC.WithoutChildren = () => {
  const [{ fetching }, signUp] = useMutation<{ signUp: boolean }, { email: string; password: string }>(gql`
    mutation ($email: String!, $password: String!) {
      signUp(input: { email: $email, password: $password })
    }
  `)

  const form = useForm<FormFieldValues>({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) =>
        regexpValidEmailAddressFormat().test(value) ? null : 'メールアドレスの形式で入力してください。',
      password: (value) => (value.length <= MAX_LENGTH_PASSWORD ? null : 'パスワードの最大文字数を超えています'),
    },
  })

  return (
    <Form
      onSubmit={form.onSubmit((values) => {
        signUp({ email: values.email, password: values.password }).then((v) => {
          if (v.error) {
            console.error(v.error)
          }
        })
      })}
    >
      <Stack spacing='lg'>
        <TextInput
          required
          label='メールアドレス'
          placeholder='your@email.com'
          inputMode='email'
          autoComplete='email'
          {...form.getInputProps('email')}
        />
        <PasswordInput required label='パスワード' autoComplete='new-password' {...form.getInputProps('password')} />

        <Box sx={{ textAlign: 'center' }}>
          <Button type='submit' loading={fetching}>
            新規登録
          </Button>
        </Box>
      </Stack>
    </Form>
  )
}

export default SignUpForm
