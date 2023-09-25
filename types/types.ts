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
  ordered_at?: string;
  delivered_at?: string | null;
  payment_status?: boolean;
  delivery_status?: 'Order Received' | 'Preparation Started' | 'On The Way' | 'Delivered';
  total_price: number;
  coupon_code?: string | null;
  order_items: any[];
  email: string;
  phone_number: string;
  intentid?: string | null;
  google_formatted_address: string;
  flat_number: string;
  street: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  landmark: string;
  first_name: string;
};

export type Address = {
  addressid: number;
  userid: number;
  street: string;
  google_formatted_address: string | null;
  flat_number: string;
  landmark?: string | null;
  state: string;
  pincode: string;
  phone_number: string;
  longitude: number;
  latitude: number;
  created_at: Date;
  updated_at: Date;
};
