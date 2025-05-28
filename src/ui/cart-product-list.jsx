"use client";
import { useState, useEffect } from "react";

import ClearCartButton from "@/ui/clear-cart-button";
import CartProduct from "@/ui/cart-product";
import EmptyCart from "@/ui/empty-cart";
import OrderNowButton from "@/ui/order-now-button";

import processOrder from "@/actions/process-order";

export default function CartProductList({ cart, userPreferences }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (cart && cart.data && cart.data.products) {
      const errorFound = cart.data.products.some((cartProduct) => {
        const details = JSON.parse(cartProduct.details);
        return details.some((detail) => {
          const size = cartProduct.product.sizes.find(
            (s) => Number(s.id) === Number(detail.id)
          );
          return size && detail.quantity > size.stock;
        });
      });
      setHasError(errorFound);
    }
  }, [cart]);

  return (
    <div className="px-6 flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className={`flex-grow ${cart?.cartCount !== 0 ? "sm:w-3/4" : ""} `}>
        {cart && cart?.cartCount !== 0 ? (
          cart.data.products.map((product, i) => (
            <CartProduct
              key={i}
              cartProduct={product}
              preferences={userPreferences}
              hasError={hasError}
              setHasError={setHasError}
            />
          ))
        ) : (
          <EmptyCart />
        )}
      </div>

      {cart && cart?.cartCount !== 0 && (
        <div className="flex-grow sm:w-1/4">
          <div className="my-4 flex flex-col gap-2">
            <OrderNowButton hasError={hasError} processOrder={processOrder} />
            <ClearCartButton />
          </div>
        </div>
      )}
    </div>
  );
}
