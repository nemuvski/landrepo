import { regexpValidEmailAddressFormat } from '@itsumono/utils'
import { Button, Box, Stack, TextInput, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import { gql, useMutation } from 'urql'
import { Form } from '~/components/Form'
import type { RC } from '@itsumono/react'

type FormFieldValues = {
  email: string
  password: string
}

const SignUpForm: RC.WithoutChildren = () => {
  const [{ error, fetching }, signUp] = useMutation<boolean, { email: string; password: string }>(gql`
    mutation ($email: String!, $password: String!) {
      signUp(input: { email: $email, password: $password })
    }
  `)

  const form = useForm<FormFieldValues>({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) =>
        regexpValidEmailAddressFormat().test(value) ? null : 'メールアドレスの形式で入力してください。',
    },
  })

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return (
    <Form
      onSubmit={form.onSubmit((values) => {
        signUp({ email: values.email, password: values.password })
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
        <PasswordInput
          required
          label='パスワード'
          autoComplete='current-password'
          {...form.getInputProps('password')}
        />

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