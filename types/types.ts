export type Category = {
  image: string;
  name: string;
  categoryid: string;
  slug: string;
  description: string;
};

export type FoodItem = {
  itemid: string;
  name: string;
  image: string;
  price: number;
  categoryid: string;
  description: string;
  slug: string;
};

export type CartItem = {
  cartitemid: string;
  itemid: string;
  userid: string;
  quantity: number;
};

export type Order = {
  orderid?: number;
  userid: string;
  first_name: string;
  ordered_at?: string;
  delivered_at?: string | null;
  delivery_address: string;
  payment_status?: boolean;
  delivery_status?: 'Order Received' | 'Preparation Started' | 'On The Way' | 'Delivered';
  total_price: number;
  coupon_code?: string | null;
  order_items: any[];
  email: any;
  phone_number: string;
  intentid?: string;
};
