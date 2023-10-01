import { trpc } from '@/app/_trpc/client';
import { Box, Button, Select, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useParams } from 'next/navigation';
export function QueryForm() {
  const { orderid } = useParams();
  const form = useForm({
    initialValues: {
      query: '',
      phoneNumber: '',
      queryType: '', // Add queryType field
    },

    validate: {
      query: (value) => (value ? null : 'Query is required'),
      phoneNumber: (value) => {
        const phoneRegex = /^\+\d{1,4}\d{10}$/;
        return phoneRegex.test(value) ? null : 'Invalid phone number format';
      },
      queryType: (value) => (value ? null : 'Query type is required'), // Add validation for queryType
    },
  });

  const sendOrderQueryMutation = trpc.order.sendOrderQuery.useMutation();

  const sendOrderQueryHandler = (query: string, phoneNumber: string, queryType: string) => {
    const sendingOrderQueryNotificationId = notifications.show({
      loading: true,
      title: 'Sending Query',
      message: 'Sending the query...',
      color: 'yellow',
    });

    sendOrderQueryMutation.mutate(
      {
        query,
        phoneNumber,
        queryType,
        orderid: orderid as string,
      },
      {
        onSuccess: () => {
          notifications.update({
            id: sendingOrderQueryNotificationId,
            loading: false,
            title: 'Query Sent Successfully',
            message: 'The query has been sent successfully.',
            autoClose: 2000,
            color: 'green',
          });
        },
        onError: () => {
          notifications.update({
            id: sendingOrderQueryNotificationId,
            loading: false,
            title: 'Failed to Send Query',
            message: 'An error occurred while sending the query. Please try again later.',
            autoClose: 2000,
            color: 'red',
          });
        },
        onSettled: () => {
          modals.closeAll();
        },
      }
    );
  };

  // Define query type options
  const queryTypeOptions = [
    { value: 'General Inquiry', label: 'General Inquiry' },
    { value: 'Order Status', label: 'Order Status' },
    { value: 'Menu Inquiry', label: 'Menu Inquiry' },
    // Add more query types as needed
  ];

  return (
    <>
      <Stack>
        <Text c="dimmed">
          Please anticipate a callback within 5-10 minutes, depending on our current availability.
        </Text>
        <form
          onSubmit={form.onSubmit((values) => {
            sendOrderQueryHandler(values.query, values.phoneNumber, values.queryType);
          })}
        >
          <Stack gap="md" justify="between">
            <TextInput
              withAsterisk
              label="Phone Number"
              placeholder="e.g., +919876543210"
              {...form.getInputProps('phoneNumber')}
              autoComplete="tel"
            />
            <Select
              required
              label="Query Type"
              placeholder="Select a query type"
              data={['General Inquiry', 'Order Status', 'Menu Inquiry', 'Other Inquiry']}
              {...form.getInputProps('queryType')}
            />
            <Textarea required label="Query" placeholder="Query" {...form.getInputProps('query')} />
          </Stack>
          <Box mt="md">
            <Button type="submit" fullWidth>
              Submit
            </Button>
          </Box>
        </form>
      </Stack>
    </>
  );
}
