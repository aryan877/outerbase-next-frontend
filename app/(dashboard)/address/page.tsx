'use client';
import { trpc } from '@/app/_trpc/client';
import { Address } from '@/types/types';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconMapPin, IconPhone, IconPlus, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { AddAddressForm } from './components/AddAddressForm';

function Address() {
  const {
    data: { response: { items: addresses } = { items: [] } } = {},
    isLoading: isLoadingAddresses,
  } = trpc.address.getUserAddresses.useQuery(undefined, {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
  });

  const queryClient = useQueryClient();

  const myAddresses: Address[] = addresses;

  const deleteAddressMutation = trpc.address.deleteUserAddress.useMutation();

  const openDeleteAddressModal = (id: number) =>
    modals.openConfirmModal({
      title: 'Please Confirm Deletion',
      children: (
        <Text size="sm">
          This action will permanently delete the selected address. Are you sure you want to
          proceed?
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        const deletingAddressNotificationId = notifications.show({
          loading: true,
          title: 'Deleting Address',
          message: 'Deleting the address...',
          color: 'yellow',
        });

        deleteAddressMutation.mutate(
          { addressId: Number(id) },
          {
            onSuccess: () => {
              notifications.update({
                id: deletingAddressNotificationId,
                loading: false,
                title: 'Address Deleted Successfully',
                message: 'The address has been deleted successfully.',
                autoClose: 2000,
                color: 'green',
              });

              const listUserAddressesQueryKey = getQueryKey(
                trpc.address.getUserAddresses,
                undefined,
                'query'
              );
              queryClient.refetchQueries(listUserAddressesQueryKey);
            },
            onError: () => {
              notifications.update({
                id: deletingAddressNotificationId,
                loading: false,
                title: 'Failed to Delete Address',
                message: 'An error occurred while deleting the address. Please try again later.',
                autoClose: 2000,
                color: 'red',
              });
            },
            onSettled: () => {
              modals.closeAll();
            },
          }
        );
      },
    });

  return (
    <>
      <div>
        <Title order={3} fw={700} mb="md">
          Your Addresses {myAddresses.length > 0 ? `(${myAddresses.length})` : ''}
        </Title>
        <Card withBorder p="lg" radius="md">
          <Stack gap="md" mb="md">
            <Button
              w="fit-content"
              size="sm"
              leftSection={<IconPlus />}
              onClick={() => {
                modals.open({
                  title: 'Add Address',
                  children: <AddAddressForm />,
                });
              }}
            >
              Add New
            </Button>
          </Stack>
          <Stack gap="md">
            {/* Display user's addresses here */}
            {isLoadingAddresses ? (
              <div>Loading...</div>
            ) : (
              myAddresses.map((address) => (
                <Card withBorder key={address.addressid} radius="md">
                  <Stack gap="md" p="md">
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
                    <Group align="center" gap="xs">
                      <IconPhone />
                      <Text>{address.phone_number}</Text>
                    </Group>
                    <Button
                      mt="md"
                      onClick={() => {
                        openDeleteAddressModal(address.addressid);
                      }}
                      w={200}
                    >
                      <Group>
                        <IconTrash size={18} />
                        <Text>Delete</Text>
                      </Group>
                    </Button>
                  </Stack>
                </Card>
              ))
            )}
          </Stack>
        </Card>
      </div>
    </>
  );
}

export default Address;
