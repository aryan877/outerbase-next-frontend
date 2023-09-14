'use client';
import { Button, Container, Grid, Paper, Text } from '@mantine/core';
import { useState } from 'react';
// import { Header } from '../components/Header/Header';

// Define a type for your item objects
type FoodItem = {
  name: string;
  quantity: number;
};

export default function FoodDeliveryPage() {
  // State to manage the cart items and quantities
  const [cart, setCart] = useState<FoodItem[]>([]);

  // Function to add an item to the cart
  const addToCart = (itemName: string) => {
    const updatedCart = [...cart];
    const foundIndex = updatedCart.findIndex((item) => item.name === itemName);

    if (foundIndex !== -1) {
      updatedCart[foundIndex].quantity += 1;
    } else {
      updatedCart.push({ name: itemName, quantity: 1 });
    }

    setCart(updatedCart);
  };

  // Function to remove an item from the cart
  const removeFromCart = (itemName: string) => {
    const updatedCart = cart.filter((item) => item.name !== itemName);
    setCart(updatedCart);
  };

  // Dummy food items
  const menuItems: string[] = ['Burger', 'Pizza', 'Pasta', 'Salad', 'Sushi'];

  // Render the page
  return (
    <>
      {/* <Header /> */}

      <Container size="sm" style={{ marginTop: '2rem' }}>
        <Paper p="xl" shadow="xs" style={{ textAlign: 'center' }}>
          <Text size="xl" fw={700} style={{ marginBottom: '1rem' }}>
            Welcome to Food Delivery
          </Text>
          <Text size="md" style={{ marginBottom: '2rem' }}>
            Explore our delicious menu and place your order.
          </Text>
        </Paper>
      </Container>

      <Container size="lg" style={{ marginTop: '2rem' }}>
        <Text size="xl" fw={700} style={{ marginBottom: '1rem' }}>
          Our Menu
        </Text>

        <Grid gutter="lg">
          {/* Display menu items */}
          {menuItems.map((itemName) => (
            <Grid.Col span={6} key={itemName}>
              <Paper p="lg" withBorder>
                <Text size="lg" fw={700} style={{ marginBottom: '1rem' }}>
                  {itemName}
                </Text>
                <Button
                  variant="outline"
                  size="lg"
                  style={{ marginRight: '1rem' }}
                  onClick={() => addToCart(itemName)}
                >
                  Add to Cart
                </Button>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Container>

      <Container size="lg" style={{ marginTop: '2rem' }}>
        <Text size="xl" fw={700} style={{ marginBottom: '1rem' }}>
          Your Cart
        </Text>

        {/* Display the items in the cart */}
        {cart.map((item) => (
          <Paper key={item.name} p="lg" withBorder style={{ marginBottom: '1rem' }}>
            <Text size="lg" fw={700}>
              {item.name}
            </Text>
            <div>
              <Button
                variant="outline"
                size="sm"
                style={{ marginRight: '0.5rem' }}
                onClick={() => removeFromCart(item.name)}
              >
                -
              </Button>
              {item.quantity}
              <Button
                variant="outline"
                size="sm"
                style={{ marginLeft: '0.5rem' }}
                onClick={() => addToCart(item.name)}
              >
                +
              </Button>
            </div>
          </Paper>
        ))}
      </Container>
    </>
  );
}
