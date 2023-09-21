'use client';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconMapPin, IconPhone, IconPlus } from '@tabler/icons-react';
import { AddAddressForm } from './components/AddAddressForm';

const dummyAddresses = [
  {
    id: 1,
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phoneNumber: '123-456-7890',
  },
  {
    id: 2,
    address: '456 Elm Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    phoneNumber: '987-654-3210',
  },
  // Add more dummy addresses here
];

function Address() {
  return (
    <>
      <div>
        <Title order={3} fw={700} mb="md">
          Your Addresses
        </Title>
        <Card p="md" shadow="xs"                 radius="lg">
          <Stack gap="md" mb="md">
            <Button
              size="sm"
              leftSection={<IconPlus />}
              onClick={() => {
                modals.open({
                  title: 'Add Address',
                  children: (
                    <>
                      <AddAddressForm />
                    </>
                  ),
                });
              }}
            >
              Add New
            </Button>
          </Stack>
          <Stack gap="md">
            {/* Display user's addresses here */}
            {dummyAddresses.map((address) => (
              <Card withBorder key={address.id} shadow="xs" radius="md">
                <Stack gap="md" p="md">
                  <Group align="start" gap="xs">
                    <IconMapPin />
                    <div>
                      <Text size="lg" fw={700}>
                        {address.address}
                      </Text>
                      <Text>
                        {address.city}, {address.state} {address.zipCode}
                      </Text>
                    </div>
                  </Group>
                  <Group align="center" gap="xs">
                    <IconPhone />
                    <Text>{address.phoneNumber}</Text>
                  </Group>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Card>
      </div>
    </>
  );
}

export default Address;
