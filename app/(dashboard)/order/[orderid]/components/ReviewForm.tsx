import { trpc } from '@/app/_trpc/client';
import { Box, Button, Rating, Stack, Text, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export function ReviewForm() {
  const { orderid } = useParams();
  const form = useForm({
    initialValues: {
      review: '',
    },
    validate: {
      review: (value) => (value ? null : 'Review is required'),
    },
  });

  const sendReviewMutation = trpc.order.sendOrderReview.useMutation();

  const [rating, setRating] = useState(0);

  const sendReviewHandler = (review: string) => {
    const sendingReviewNotificationId = notifications.show({
      loading: true,
      title: 'Sending Review',
      message: 'Sending the review...',
      color: 'yellow',
    });

    sendReviewMutation.mutate(
      {
        review,
        rating,
        orderid: orderid as string,
      },
      {
        onSuccess: () => {
          notifications.update({
            id: sendingReviewNotificationId,
            loading: false,
            title: 'Review Sent Successfully',
            message: 'The review has been sent successfully.',
            autoClose: 2000,
            color: 'green',
          });
        },
        onError: () => {
          notifications.update({
            id: sendingReviewNotificationId,
            loading: false,
            title: 'Failed to Send Review',
            message: 'An error occurred while sending the review. Please try again later.',
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

  return (
    <>
      <Stack>
        <Text c="dimmed">Please share your review for the restaurant below</Text>
        <form
          onSubmit={form.onSubmit((values) => {
            sendReviewHandler(values.review);
          })}
        >
          <Stack gap="md" justify="between">
            <Rating value={rating} onChange={setRating} />
            <Textarea
              required
              label="Review"
              placeholder="Your review here..."
              {...form.getInputProps('review')}
            />
          </Stack>
          <Box mt="md">
            <Button type="submit" fullWidth>
              Submit Review
            </Button>
          </Box>
        </form>
      </Stack>
    </>
  );
}
