import { Box, Button, PasswordInput, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { MAX_LENGTH_PASSWORD } from '@project/auth'
import { gql, useMutation } from 'urql'
import { Form } from '~/components/Form'
import { getGraphqlClientFetchOptions } from '~/modules/graphql'
import MessageBar, { useMessageBar } from '~/modules/ui/MessageBar'
import type { RC } from '@itsumono/react'

type FormFieldValues = {
  newPassword: string
}

const ChangePasswordForm: RC.WithoutChildren<{ oneTimeToken: string }> = ({ oneTimeToken }) => {
  const [{ fetching }, changePassword] = useMutation<{}, { newPassword: string }>(gql`
    mutation ($newPassword: String!) {
      changePassword(input: { newPassword: $newPassword })
    }
  `)

  const [message, setMessage] = useMessageBar()

  const form = useForm<FormFieldValues>({
    initialValues: { newPassword: '' },
    validate: {
      newPassword: (value) => (value.length <= MAX_LENGTH_PASSWORD ? null : 'パスワードの最大文字数を超えています'),
    },
  })

  return (
    <Stack spacing='lg'>
      <MessageBar content={message} />

      <Form
        onSubmit={form.onSubmit((values) => {
          changePassword(
            { newPassword: values.newPassword },
            { fetchOptions: () => getGraphqlClientFetchOptions(oneTimeToken) }
          ).then((v) => {
            if (v.error) {
              setMessage({ level: 'error', description: v.error.message })
            }
          })
        })}
      >
        <Stack spacing='lg'>
          <PasswordInput
            required
            label='新しいパスワード'
            autoComplete='new-password'
            {...form.getInputProps('newPassword')}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Button type='submit' loading={fetching}>
              パスワード設定
            </Button>
          </Box>
        </Stack>
      </Form>
    </Stack>
  )
}

export default ChangePasswordForm
