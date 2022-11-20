import { regexpValidEmailAddressFormat } from '@itsumono/utils'
import { Button, Box, Stack, TextInput, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMutation } from 'urql'
import { Form } from '~/components/Form'
import { signInMutation } from '~/infrastructure/sign-in.query'
import type { RC } from '@itsumono/react'
import type { SignInMutationInput, SignInMutationOutput } from '~/infrastructure/sign-in.query'

type FormFieldValues = {
  email: string
  password: string
}

const SignInForm: RC.WithoutChildren = () => {
  const form = useForm<FormFieldValues>({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) =>
        regexpValidEmailAddressFormat().test(value) ? null : 'メールアドレスの形式で入力してください。',
    },
  })

  const [{ fetching }, signIn] = useMutation<SignInMutationOutput, SignInMutationInput>(signInMutation)

  return (
    <Form
      onSubmit={form.onSubmit(async (values) => {
        const { error } = await signIn({ email: values.email, password: values.password })
        console.log(error)
        // TODO: エラーメッセージの改善
        // TODO: 認証情報を管理すること
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
            ログイン
          </Button>
        </Box>
      </Stack>
    </Form>
  )
}

export default SignInForm
