import { regexpValidEmailAddressFormat } from '@itsumono/utils'
import { Button, Box, Stack, TextInput, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import Router from 'next/router'
import { Form } from '~/components/Form'
import { useSignInHandler } from '~/modules/auth/routes/sign-in'
import MessageBar, { useMessageBar } from '~/modules/ui/MessageBar'
import type { RC } from '@itsumono/react'

type FormFieldValues = {
  email: string
  password: string
}

const SignInForm: RC.WithoutChildren = () => {
  const [signIn, { loading }] = useSignInHandler()

  const [message, setMessage] = useMessageBar()

  const form = useForm<FormFieldValues>({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) =>
        regexpValidEmailAddressFormat().test(value) ? null : 'メールアドレスの形式で入力してください。',
    },
  })

  return (
    <Stack spacing='lg'>
      <MessageBar content={message} />

      <Form
        onSubmit={form.onSubmit((values) => {
          signIn({ email: values.email, password: values.password })
            .then(() => {
              Router.replace('/')
            })
            .catch((error) => {
              setMessage({ level: 'error', description: error.message })
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
    </Stack>
  )
}

export default SignInForm
