const { StripeCheckout } = require("react-native-stripe-checkout-webview");
import * as React from "react";
import { useEffect } from "react";
import { Route } from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";

interface NavigationParams {}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}

export const paymentStripeScreen = ({ route, navigation }: Props) => {
  useEffect(() => {}, []);

  return (
    <StripeCheckout
      stripePublicKey={route.params.STRIPE_PUBLIC_KEY}
      checkoutSessionInput={{
        sessionId: route.params.CHECKOUT_SESSION_ID,
      }}
      options={{
        htmlContentLoading:
          '<center><h1  style="margin-top:120px;">Chargement</h1></center>',
      }}
      onSuccess={() => {
        navigation.navigate("successScreen", {
          bookingType: route.params.bookingType,
          resaId: route.params.resaId,
          day: route.params.day,
          hour: route.params.hour,
          amount: route.params.amount,
        });
      }}
      onCancel={() => {
        navigation.navigate("custInfoScreen", {
          bookingType: route.params.bookingType,
          resaId: route.params.resaId,
          day: route.params.day,
          hour: route.params.hour,
          amount: route.params.amount,
        });
      }}
    />
  );
};
export default paymentStripeScreen;
