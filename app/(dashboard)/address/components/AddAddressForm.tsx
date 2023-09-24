'use client';
import { trpc } from '@/app/_trpc/client';
import useLocationStore from '@/store/LocationStore';
import { Box, Button, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { useEffect, useState } from 'react';
import GoogleMapView from './GoogleMapView';

export function AddAddressForm() {
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  const { setAddress, getLocation, address, latitude, longitude } = useLocationStore();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      flatNumber: '',
      street: '',
      state: '',
      pincode: '',
      phoneNumber: '',
      landmark: '',
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

  const addUserAddressMutation = trpc.address.addUserAddress.useMutation();

  const addUserAddressHandler = (
    flatNumber: string,
    landmark: string,
    phoneNumber: string,
    pincode: string,
    state: string,
    street: string,
    latitude: number,
    longitude: number,
    googleAddress: string
  ) => {
    const addingUserAddressNotificationId = notifications.show({
      loading: true,
      title: 'Adding New Address',
      message: 'Adding a new address for the user.',
      color: 'yellow',
    });

    addUserAddressMutation.mutate(
      {
        flatNumber,
        landmark,
        phoneNumber,
        pincode,
        state,
        street,
        latitude,
        longitude,
        googleAddress,
      },
      {
        onSuccess: () => {
          notifications.update({
            id: addingUserAddressNotificationId,
            loading: false,
            title: 'Address Added Successfully',
            message: 'A new address has been added for the user.',
            autoClose: 2000,
            color: 'green',
          });
          const getUserAddressesQueryKey = getQueryKey(
            trpc.address.getUserAddresses,
            undefined,
            'query'
          );
          queryClient.refetchQueries(getUserAddressesQueryKey);
        },
        onError: () => {
          notifications.update({
            id: addingUserAddressNotificationId,
            loading: false,
            title: 'Failed to Add Address',
            message:
              'An error occurred while adding a new address for the user. Please try again later.',
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

  useEffect(() => {
    getLocation();
    return () => {
      setAddress(null);
    };
  }, []);

  return (
    <>
      {active === 0 && <GoogleMapView nextStep={nextStep} />}
      {active === 1 && (
        <Stack>
          <Text>{address}</Text>
          <Button w="fit-content" onClick={prevStep}>
            {' '}
            <IconArrowLeft size={24} />
          </Button>
          <form
            onSubmit={form.onSubmit((values) =>
              addUserAddressHandler(
                values.flatNumber,
                values.landmark,
                values.phoneNumber,
                values.pincode,
                values.state,
                values.street,
                latitude as number,
                longitude as number,
                address as string
              )
            )}
          >
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
              <TextInput
                label="Landmark"
                placeholder="Landmark"
                {...form.getInputProps('landmark')}
              />
            </Stack>
            <Box mt="md">
              <Button type="submit" fullWidth>
                Submit
              </Button>
            </Box>
          </form>
        </Stack>
      )}
    </>
  );
}
