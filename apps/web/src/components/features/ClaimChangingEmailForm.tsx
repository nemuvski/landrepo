import { Maybe } from '@itsumono/react'
import { regexpValidEmailAddressFormat } from '@itsumono/utils'
import { Box, Button, Stack, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { gql, useMutation } from 'urql'
import { Form } from '~/components/Form'
import MessageBar, { useMessageBar } from '~/modules/ui/MessageBar'
import type { RC } from '@itsumono/react'

type FormFieldValues = {
  newEmail: string
}

const ClaimChangingEmailForm: RC.WithoutChildren<{ currentEmail: string }> = ({ currentEmail }) => {
  const [isSent, setIsSent] = useState(false)

  const [message, setMessage] = useMessageBar()

  const [{ fetching }, claimChangingOwnEmail] = useMutation<{ claimChangingOwnEmail: true }, { newEmail: string }>(gql`
    mutation ($newEmail: String!) {
      claimChangingOwnEmail(input: { newEmail: $newEmail })
    }
  `)

  const form = useForm<FormFieldValues>({
    initialValues: { newEmail: '' },
    validate: {
      newEmail: (value) => {
        if (value === currentEmail) {
          return '現在のパスワードと同じです'
        }
        if (!regexpValidEmailAddressFormat().test(value)) {
          return 'メールアドレスの形式で入力してください'
        }
        return null
      },
    },
  })

  return (
    <Stack spacing='lg'>
      <MessageBar content={message} />

      <Form
        onSubmit={form.onSubmit((values) => {
          claimChangingOwnEmail({ newEmail: values.newEmail }).then((v) => {
            if (v.error) {
              setMessage({ level: 'error', description: v.error.message })
            } else if (v.data && v.data.claimChangingOwnEmail) {
              setIsSent(true)
            }
          })
        })}
      >
        <Stack spacing='lg'>
          <TextInput
            required
            label='新しいメールアドレス'
            placeholder='new-your@email.com'
            inputMode='email'
            autoComplete='email'
            {...form.getInputProps('newEmail')}
          />
        </Stack>

        <Maybe test={!isSent}>
          <Box sx={{ textAlign: 'center' }}>
            <Text>新しいメールアドレス宛に確認メールが送信されます。</Text>
            <Button type='submit' loading={fetching}>
              確認メール送信
            </Button>
          </Box>
        </Maybe>
      </Form>
    </Stack>
  )
}

export default ClaimChangingEmailForm
