export interface ProductItem {
    id: string
    name: string
    description: string
    price: number
    amount: number
    currency:string
    formulaChoiced:[] 
    persoData : [],
    imageUrl: string,
    quantity: number,
    added?: boolean,
    resto:string
  }


 
  declare module 'react-native-stripe-checkout-webview'