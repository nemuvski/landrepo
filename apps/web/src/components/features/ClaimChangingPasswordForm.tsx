import { Maybe } from '@itsumono/react'
import { regexpValidEmailAddressFormat } from '@itsumono/utils'
import { Box, Button, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { gql, useMutation } from 'urql'
import { Form } from '~/components/Form'
import type { RC } from '@itsumono/react'

type FormFieldValues = {
  email: string
}

const ClaimChangingPasswordForm: RC.WithoutChildren<{ currentEmail?: string }> = ({ currentEmail }) => {
  const [isSent, setIsSent] = useState(false)

  const [{ fetching }, claimChangingPassword] = useMutation<{ claimChangingPassword: true }, { email: string }>(gql`
    mutation ($email: String!) {
      claimChangingPassword(input: { email: $email })
    }
  `)

  const form = useForm<FormFieldValues>({
    initialValues: { email: currentEmail ?? '' },
    validate: {
      email: (value) => {
        if (currentEmail && currentEmail !== value) {
          return '現在のメールアドレスと異なります'
        }
        if (!regexpValidEmailAddressFormat().test(value)) {
          return 'メールアドレスの形式で入力してください'
        }
        return null
      },
    },
  })

  return (
    <Form
      onSubmit={form.onSubmit((values) => {
        claimChangingPassword({ email: values.email }).then((v) => {
          if (v.data && v.data.claimChangingPassword) {
            setIsSent(true)
          }
        })
      })}
    >
      <Stack spacing='lg'>
        <TextInput
          required
          readOnly={!!currentEmail}
          disabled={!!currentEmail}
          label='対象アカウントのメールアドレス'
          placeholder='your@email.com'
          inputMode='email'
          autoComplete='email'
          {...form.getInputProps('email')}
        />
      </Stack>

      <Maybe test={!isSent}>
        <Box sx={{ textAlign: 'center' }}>
          <Button type='submit' loading={fetching}>
            確認メール送信
          </Button>
        </Box>
      </Maybe>
    </Form>
  )
}

export default ClaimChangingPasswordForm
