'use client';
import { Button, Card, Group, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

function Address() {
  return (
    <div>
      <Card padding="md" withBorder>
        <Group justify="space-between">
          <Text size="lg">Your Address</Text>
          <Button
            size="sm"
            variant="outline"
            leftSection={<IconPlus />}
            onClick={() => {
              // Add new address logic here
              console.log('Add new address clicked');
            }}
          >
            Add New
          </Button>
        </Group>
        {/* Display user's address here */}
        <div>
          <Text>123 Main Street</Text>
          <Text>New York, NY 10001</Text>
        </div>
      </Card>
    </div>
  );
}

export default Address;
