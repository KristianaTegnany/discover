export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  amount: number;
  currency: string;
  formulaChoiced: [];
  persoData: [];
  imageUrl: string;
  quantity: number;
  added?: boolean;
  restoId: string;
}

export interface selectedIntcustStripeAccountId {
  id: string;
}

declare module "react-native-stripe-checkout-webview";
