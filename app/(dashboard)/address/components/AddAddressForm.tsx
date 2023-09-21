import { Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import GoogleMapView from './GoogleMapView';

export function AddAddressForm() {
  const form = useForm({
    initialValues: {
      flatNumber: '',
      street: '',
      state: '',
      pincode: '',
      phoneNumber: '',
    },

    validate: {
      flatNumber: (value) => (value ? null : 'Flat Number is required'),
      street: (value) => (value ? null : 'Street is required'),
      state: (value) => (value ? null : 'State is required'),
      pincode: (value) => (value ? null : 'Pincode is required'),
      phoneNumber: (value) => {
        const phoneRegex = /^\+\d{1,4}\d{10}$/;
        return phoneRegex.test(value) ? null : 'Invalid phone number format';
      },
    },
  });

  // const modifyItemsInCartMutation = trpc.address..useMutation();
  // const createOrderMutation = trpc.order.createOrder.useMutation();

  // Function to handle adding or modifying items in the cart
  // const modifyCartItemsHandler = (id: number, quantity?: number) => {
  //   const modifyingCartNotificationId = notifications.show({
  //     loading: true,
  //     title: 'Modifying Item in Cart',
  //     message: 'The selected item is being modified in your cart.',
  //     color: 'yellow',
  //   });

  //   modifyItemsInCartMutation.mutate(
  //     { itemid: id, quantity: Number(quantity) },
  //     {
  //       onSuccess: () => {
  //         notifications.update({
  //           id: modifyingCartNotificationId,
  //           loading: false,
  //           title: 'Item Modified in Cart',
  //           message: 'The selected item has been modified in your cart.',
  //           autoClose: 2000,
  //           color: 'green',
  //         });
  //         const getCartItemsQueryKey = getQueryKey(trpc.cart.getCartItems, undefined, 'query');
  //         const getCartItemsPopulatedQueryKey = getQueryKey(
  //           trpc.cart.getCartItemsPopulated,
  //           undefined,
  //           'query'
  //         );
  //         queryClient.refetchQueries(getCartItemsPopulatedQueryKey);
  //         queryClient.refetchQueries(getCartItemsQueryKey);
  //       },
  //       onError: () => {
  //         notifications.update({
  //           id: modifyingCartNotificationId,
  //           loading: false,
  //           title: 'Failed to Modify Item in Cart',
  //           message:
  //             'An error occurred while modifying the item in your cart. Please try again later.',
  //           autoClose: 2000,
  //           color: 'red',
  //         });
  //       },
  //     }
  //   );
  // };

  return (
    <Box mx="auto">
      <div style={{ marginTop: '20px' }}>
        <GoogleMapView />
      </div>
      {/* <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack gap="md" justify="between">
          <TextInput
            withAsterisk
            label="Flat Number"
            placeholder="Enter flat number"
            {...form.getInputProps('flatNumber')}
          />

          <TextInput
            withAsterisk
            label="Street"
            placeholder="Enter street address"
            {...form.getInputProps('street')}
          />

          <TextInput
            withAsterisk
            label="State"
            placeholder="Enter state"
            {...form.getInputProps('state')}
          />

          <TextInput
            withAsterisk
            label="Pincode"
            placeholder="Enter pincode"
            {...form.getInputProps('pincode')}
          />

          <TextInput
            withAsterisk
            label="Phone Number"
            placeholder="e.g., +919876543210"
            {...form.getInputProps('phoneNumber')}
          />
        </Stack>
        <Box mt="md">
          <Button type="submit" fullWidth>
            Submit
          </Button>
        </Box>
      </form> */}
    </Box>
  );
}
