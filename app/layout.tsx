import NavigationProvider from '@/components/NavigationProgressProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
// import { NavigationProgress } from '@mantine/nprogress';
import '@mantine/nprogress/styles.css';
import React from 'react';
import TRPCProvider from './_trpc/provider';
import './styles/globals.css';
export const metadata = {
  title: 'Ethereal Sync',
  description: 'Collboration Made easy for youtube creators',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="shortcut icon" href="/favicon.svg" />
        </head>
        <body>
          <TRPCProvider>
            <MantineProvider
              theme={{
                primaryShade: { light: 5, dark: 7 },
                primaryColor: 'primary',
                colors: {
                  primary: [
                    '#FF6B6B',
                    '#FF4F4F',
                    '#FF3434',
                    '#FF1B1B',
                    '#FF7171',
                    '#FFA07A',
                    '#FF6347',
                    '#FF4500',
                    '#FF8C00',
                    '#FFD700',
                  ],
                  secondary: [
                    '#f5f4f5',
                    '#e6e6e6',
                    '#cccccc',
                    '#afafaf',
                    '#979798',
                    '#88878a',
                    '#827f84',
                    '#6f6d71',
                    '#636066',
                    '#57525b',
                  ],
                  Accent: [
                    '#f6f6ea',
                    '#e8e8e1',
                    '#cdd0c9',
                    '#b3b5ad',
                    '#9c9f95',
                    '#8d9186',
                    '#868a7d',
                    '#72776a',
                    '#656b5c',
                    '#565c4b',
                  ],
                  neural: [
                    '#f8f3f8',
                    '#e7e6e8',
                    '#cccbcd',
                    '#b1afb2',
                    '#99979b',
                    '#8a878d',
                    '#838086',
                    '#706d74',
                    '#656069',
                    '#59525d',
                  ],
                },
                shadows: {
                  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                  // 2xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                  // inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
                  // none: '0 0 rgb(0, 0 / 0, 0)',
                },
              }}
            >
              {/* <NavigationProgress /> */}
              <ModalsProvider>
                <Notifications />
                <NavigationProvider>{children}</NavigationProvider>
              </ModalsProvider>
            </MantineProvider>
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
