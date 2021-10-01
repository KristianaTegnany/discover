import React, { useEffect, useState } from "react";
export const AppContext = React.createContext({});

interface ICart {
  cart_items: [];
}

function AppContextProvider(props: any) {
  const [cart, setCart] = useState<ICart[]>();

  useEffect(() => { });

  async function addToCart(item: { id: any }, qty: any) {
    let found = "";
    if (found.length == 0) {
      setCart([]);
    } else {
      setCart([]);
    }
  }

  return (
    <AppContext.Provider
      value={{
        ...cart,
        addToCart,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export const withAppContextProvider = (ChildComponent: any) => (props: any) => (
  <AppContextProvider>
    <ChildComponent {...props} />
  </AppContextProvider>
);
