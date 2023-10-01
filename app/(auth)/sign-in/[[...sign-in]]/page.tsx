'use client';
import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Stack, Text, useMantineColorScheme } from '@mantine/core';

export default function Page() {
  const { colorScheme } = useMantineColorScheme();
  const appearance = {
    ...(colorScheme === 'dark' ? { baseTheme: dark } : {}),
  };

  return (
    <Stack>
      <Text size="xl" variant="gradient" gradient={{ from: 'primary.6', to: 'primary.3', deg: 45 }}>
        Sign in to {process.env.NEXT_PUBLIC_RESTAURANT_NAME}
      </Text>
      <SignIn appearance={appearance} />
    </Stack>
  );
}
