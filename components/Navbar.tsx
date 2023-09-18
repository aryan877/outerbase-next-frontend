import { Box, NavLink } from '@mantine/core';
import { IconHistory, IconLocation, IconMenuOrder, IconMessage } from '@tabler/icons-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React from 'react';

type ItemType = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size: string; stroke: number }>;
};

type NavLinkComponentProps = {
  item: ItemType;
  pathName: string;
};

const NavLinkComponent: React.FC<NavLinkComponentProps> = ({ item, pathName }) => {
  return (
    <NavLink
      style={{
        borderRadius: '4px',
      }}
      my="sm"
      component={Link}
      href={item.href}
      key={item.label}
      active={pathName === item.href}
      label={item.label}
      leftSection={<item.icon size="1rem" stroke={1.5} />}
      color="primary"
      variant="filled"
    />
  );
};

const dashboard = [
  {
    icon: IconMenuOrder,
    label: 'Menu',
    href: '/',
  },
];

const main_dashboard_links = [
  {
    icon: IconHistory, // Use the appropriate icon for "My Orders"
    label: 'My Orders',
    href: '/orders',
  },
  {
    icon: IconLocation, // Use an appropriate icon for "Address"
    label: 'Address',
    href: '/address',
  },
  {
    icon: IconMessage, // Use the "Message" icon for "Customer Care"
    label: 'Customer Care',
    href: '/customer_care',
  },
];

export default function Navbar() {
  // Get the current pathname of the page using the usePathname hook
  const pathName = usePathname();
  const { id } = useParams();

  // Generate individual dashboard link (representing /dashboard route)
  const dashboardLinkComponent = dashboard.map((item) => (
    <NavLinkComponent item={item} pathName={pathName} key={item.label} />
  ));

  // Generate main page links (e.g., subscriptions, connecting YT) that are not related to projects
  const mainPageLinkComponents = main_dashboard_links.map((item) => (
    <NavLinkComponent item={item} pathName={pathName} key={item.label} />
  ));

  // const { data: { data: project } = {}, isLoading } = trpc.projects.listProject.useQuery(
  //   {
  //     projectId: id,
  //   },
  //   {
  //     enabled: !!id,
  //     onSuccess: ({ data }: { data: Project }) => {
  //       useProjectStore.getState().setProject(data as Project);
  //     },
  //   }
  // );

  return (
    <Box w="100%">
      <NavLink label="Dashboard" disabled></NavLink>
      {dashboardLinkComponent}
      <NavLink label="Account" disabled></NavLink>
      {mainPageLinkComponents}
    </Box>
  );
}
