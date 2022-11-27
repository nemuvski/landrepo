import { regexpValidEmailAddressFormat } from '@itsumono/utils'
import { Button, Box, Stack, TextInput, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import { Form } from '~/components/Form'
import { useSignInHandler } from '~/modules/auth/routes/sign-in'
import type { RC } from '@itsumono/react'

type FormFieldValues = {
  email: string
  password: string
}

const SignInForm: RC.WithoutChildren = () => {
  const [signIn, { error, loading }] = useSignInHandler()

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
        signIn({ email: values.email, password: values.password })
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
          <Button type='submit' loading={loading}>
            ログイン
          </Button>
        </Box>
      </Stack>
    </Form>
  )
}

export default SignInForm
