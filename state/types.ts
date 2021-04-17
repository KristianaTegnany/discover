

export type Product = {
  id: string
  title: string
  price: number
  added?: boolean
}

export type basketState = Product[];

export type AddProductAction = {
  type: string;
  productData: Product;
}

export type RemoveProductAction = {
  type: string;
  index: number;
}

export type basketAction = AddProductAction | RemoveProductAction;

export type AppState = {
  basket: basketState,
  // add future state slices here
}