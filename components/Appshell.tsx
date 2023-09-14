'use client';
import { AppShell, Button, Container, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Navbar from './Navbar';

export default function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();
  return (
    <>
      {' '}
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header>
          <Header opened={opened} toggle={toggle} />
        </AppShell.Header>
        <AppShell.Navbar py="md" px="sm">
          <Navbar />
        </AppShell.Navbar>
        <AppShell.Main>
          {' '}
          <Container mx="xl" my="xl" size={1400} p={0}>
            <Tooltip label="Go Back">
              <Button
                variant="filled"
                mb="xl"
                onClick={() => {
                  router.back();
                }}
              >
                <IconArrowLeft size={24} />
              </Button>
            </Tooltip>
            {children}
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
