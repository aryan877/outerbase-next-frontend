'use client';
import { UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import {
  Burger,
  Flex,
  MantineColorScheme,
  Select,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

function Header({ toggle, opened }: { toggle: () => void; opened: boolean }) {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const queryClient = useQueryClient();
  const [value, setValue] = useState('auto');
  const appearance = {
    ...(computedColorScheme === 'dark' ? { baseTheme: dark } : {}),
  };

  return (
    <Flex justify="space-between" h="100%" align="center" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Flex justify="space-between" gap="md" align="center">
        <Text
          variant="gradient"
          gradient={{ from: 'primary.6', to: 'primary.3', deg: 45 }}
          ta="center"
          fz="xl"
          fw={700}
        >
          Bloomfoods
        </Text>
      </Flex>
      <Flex
        gap="md"
        align="center"
        style={{
          position: 'relative',
        }}
      >
        <Select
          data={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto' },
          ]}
          value={value}
          onChange={(value) => {
            setValue(value || 'auto');
            setColorScheme((value as MantineColorScheme) || 'auto');
          }}
          defaultValue="auto"
          placeholder="Select Mode"
          style={{ minWidth: 150 }}
        />
        <UserButton afterSignOutUrl="/sign-in" appearance={appearance} />
      </Flex>
    </Flex>
  );
}

export default Header;
