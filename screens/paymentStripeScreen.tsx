//const { StripeCheckout } = require("react-native-stripe-checkout-webview");
import * as React from "react";
import { useEffect } from "react";
import { Route } from "react-native";
import { View } from "react-native-animatable";
import { NavigationScreenProp, NavigationState } from "react-navigation";

interface NavigationParams {}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}

export const paymentStripeScreen = ({ route, navigation }: Props) => {
  useEffect(() => {
console.log(route.params)

  }, []);

  return (
    <View></View>
    // <StripeCheckout
    //   stripePublicKey={route.params.STRIPE_PUBLIC_KEY}
    //   checkoutSessionInput={{
    //     sessionId: route.params.CHECKOUT_SESSION_ID,
    //   }}
    //   options={{
    //     htmlContentLoading: '<center><h1  style="margin-top:120px;">Chargement</h1></center>',
    //   }}
      
    //   onSuccess={() => {
    //     console.log(`Stripe checkout session succeeded. session id: .`);
    //     navigation.navigate("successScreen", {
    //       bookingType: route.params.bookingType,
    //       resaId: route.params.resaId,
    //       day: route.params.day,
    //       hour: route.params.hour,
    //       amount: route.params.amount,
    //     });
    //   }}
    //   onCancel={() => {
    //     console.log(`Stripe checkout session cancelled.`);
    //     navigation.navigate("custInfoScreen", {
    //       bookingType: route.params.bookingType,
    //       resaId: route.params.resaId,
    //       day: route.params.day,
    //       hour: route.params.hour,
    //       amount: route.params.amount,
    //     });
    //   }}
    // />
  );
};
export default paymentStripeScreen;
