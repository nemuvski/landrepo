import { Box, Button, PasswordInput, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import Router from 'next/router'
import { Form } from '~/components/Form'
import { useCancelServiceHandler } from '~/modules/auth/routes/cancel-service'
import MessageBar, { useMessageBar } from '~/modules/ui/MessageBar'
import type { RC } from '@itsumono/react'

type FormFieldValues = {
  password: string
}

const CancelServiceForm: RC.WithoutChildren = () => {
  const [cancelService, { loading }] = useCancelServiceHandler()

  const [message, setMessage] = useMessageBar()

  const form = useForm<FormFieldValues>({
    initialValues: { password: '' },
  })

  return (
    <Stack spacing='lg'>
      <MessageBar content={message} />

      <Form
        onSubmit={form.onSubmit((values) => {
          cancelService({ password: values.password })
            .then(() => {
              Router.replace('/')
            })
            .catch((error) => {
              setMessage({ level: 'error', description: error.message })
            })
        })}
      >
        <PasswordInput
          required
          label='パスワード'
          autoComplete='current-password'
          {...form.getInputProps('password')}
        />

        <Box sx={{ textAlign: 'center' }}>
          <Button type='submit' loading={loading}>
            退会
          </Button>
        </Box>
      </Form>
    </Stack>
  )
}

export default CancelServiceForm
