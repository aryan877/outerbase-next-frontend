'use client';
import { trpc } from '@/app/_trpc/client';
import { Address } from '@/types/types';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconMapPin, IconPhone, IconPlus } from '@tabler/icons-react';
import { AddAddressForm } from './components/AddAddressForm';

function Address() {
  const {
    data: { response: { items: addresses } = { items: [] } } = {},
    isLoading: isLoadingAddresses,
  } = trpc.address.getUserAddresses.useQuery(undefined, {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
  });

  const myAddresses: Address[] = addresses;

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
