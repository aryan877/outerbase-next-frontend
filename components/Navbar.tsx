import { Box, NavLink } from '@mantine/core';
import { IconEdit, IconHistory, IconLocation, IconMenuOrder } from '@tabler/icons-react';
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
];

const admin_link_components = [
  {
    icon: IconEdit,
    label: 'Edit Menu',
    href: '/admin/edit_menu',
  },
];

export default function Navbar() {
  const pathName = usePathname();
  const { id } = useParams();

  const dashboardLinkComponent = dashboard.map((item) => (
    <NavLinkComponent item={item} pathName={pathName} key={item.label} />
  ));

  const mainPageLinkComponents = main_dashboard_links.map((item) => (
    <NavLinkComponent item={item} pathName={pathName} key={item.label} />
  ));

  const adminLinkComponents = admin_link_components.map((item) => (
    <NavLinkComponent item={item} pathName={pathName} key={item.label} />
  ));

  return (
    <Box w="100%">
      <NavLink label="Dashboard" disabled></NavLink>
      {dashboardLinkComponent}
      <NavLink label="Account" disabled></NavLink>
      {mainPageLinkComponents}
      <NavLink label="Admin" disabled></NavLink>
      {adminLinkComponents}
    </Box>
  );
}
