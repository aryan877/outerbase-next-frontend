export type Category = {
  image: string;
  name: string;
  categoryid: string;
  slug: string;
};

export type FoodItem = {
  itemid: string;
  name: string;
  image: string;
  price: number;
  categoryid: string;
  slug: string;
};
