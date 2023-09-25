'use client';
import { trpc } from '@/app/_trpc/client';
import { Address } from '@/types/types';
import { Button, Card, Checkbox, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconMapPin, IconPhone } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function AddressItem({
  address,
  onAddressChecked,
  isChecked,
}: {
  address: Address;
  onAddressChecked: (address: Address) => void;
  isChecked: boolean;
}) {
  return (
    <Card withBorder key={address.addressid} radius="md">
      <Group gap="md" p="md" align="start">
        <Checkbox checked={isChecked} onChange={() => onAddressChecked(address)} />
        <Stack gap="md">
          <Group align="start" gap="xs">
            <IconMapPin />
            <div>
              <Text size="lg" fw={700}>
                {address.street}
              </Text>
              <Text>
                {address.state}, {address.pincode}
              </Text>
            </div>
          </Group>
          <Group align="start" gap="xs">
            <IconPhone />
            <Text>{address.phone_number}</Text>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}

function Address() {
  const {
    data: { response: { items: addresses } = { items: [] } } = {},
    isLoading: isLoadingAddresses,
  } = trpc.address.getUserAddresses.useQuery(undefined, {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
  });
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const myAddresses: Address[] = addresses;

  const handleAddressChecked = (address: Address) => {
    setSelectedAddress(address);
  };

  const createOrderMutation = trpc.order.createOrder.useMutation();

  const handleCheckout = async () => {
    try {
      const orderCreationNotificationId = notifications.show({
        loading: true,
        title: 'Creating Order Record in Database',
        message: 'Your order is being processed. Please wait...',
        color: 'yellow',
      });

      createOrderMutation.mutate(
        {
          addressid: selectedAddress?.addressid as number,
        },
        {
          onSuccess: (data: any) => {
            notifications.update({
              id: orderCreationNotificationId,
              loading: false,
              title: 'Redirecting to Payments Page',
              message: 'Your order has been created and is now awaiting payment.',
              autoClose: 2000,
              color: 'yellow',
            });
            router.push(`/payment/${data.orderid}`);
            // const getCartItemsQueryKey = getQueryKey(trpc.cart.getCartItems, undefined, 'query');
            // const getCartItemsPopulatedQueryKey = getQueryKey(
            //   trpc.cart.getCartItemsPopulated,
            //   undefined,
            //   'query'
            // );
            // queryClient.refetchQueries(getCartItemsPopulatedQueryKey);
            // queryClient.refetchQueries(getCartItemsQueryKey);
          },
          onError: () => {
            notifications.update({
              id: orderCreationNotificationId,
              loading: false,
              title: 'Failed to Create Order',
              message: 'There was an error while creating your order. Please try again later.',
              autoClose: 2000,
              color: 'red',
            });
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <Title order={3} fw={700} mb="md">
          Select Delivery Address
        </Title>
        <Card withBorder p="lg" radius="md">
          <Stack gap="md">
            {/* Display user's addresses here */}
            {isLoadingAddresses ? (
              <div>Loading...</div>
            ) : (
              myAddresses.map((address) => (
                <AddressItem
                  key={address.addressid}
                  address={address}
                  isChecked={selectedAddress === address}
                  onAddressChecked={handleAddressChecked}
                />
              ))
            )}
          </Stack>
        </Card>
        <Flex mt="md" justify="flex-end">
          <Button onClick={handleCheckout} disabled={!selectedAddress}>
            Proceed to Payment
          </Button>
        </Flex>
      </div>
    </>
  );
}

export default Address;
