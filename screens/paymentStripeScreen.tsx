
const {StripeCheckout} = require('react-native-stripe-checkout-webview');
import * as React from 'react';
import { useEffect } from 'react';
import { Route } from 'react-native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

interface NavigationParams {

}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}

export const paymentStripeScreen = ({ route, navigation}: Props) => {


  useEffect(() => {
      }, []);

    
  return (
  <StripeCheckout
    stripePublicKey={route.params.STRIPE_PUBLIC_KEY}
    checkoutSessionInput={{
      sessionId: route.params.CHECKOUT_SESSION_ID,
    }}
    onSuccess={() => {
      console.log(`Stripe checkout session succeeded. session id: .`);
    }}
    onCancel={() => {
      console.log(`Stripe checkout session cancelled.`);
    }}
  />
);
  }
export default paymentStripeScreen;
