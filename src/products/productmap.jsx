import { useEffect } from "react";

export default function OnClickCartAdds({
    setIsCartOpen,
    IsCartOpen,
    cart, // Receive cart state from parent
    setCart, // Receive setCart function from parent
    cartPage, // Receive cartPage prop from parent
}) {
    useEffect(() => {
        // Save cart to localStorage whenever it changes
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function CountControl(event, type) {
        const productId = parseInt(
            event.target.parentNode.getAttribute("data-id")
        );

        setCart((prevCart) => {
            const productInCart = prevCart.find(
                (item) => item.id === productId
            );

            if (productInCart) {
                const price = productInCart.price;
                if (type === "Subract_Count") {
                    if (productInCart.count > 1) {
                        const newCount = productInCart.count - 1;
                        return prevCart.map((item) =>
                            item.id === productId
                                ? {
                                      ...item,
                                      count: newCount,
                                      total_price: parseFloat(
                                          (newCount * price).toFixed(2)
                                      ),
                                  }
                                : item
                        );
                    } else {
                        // Remove from cart if count becomes 0
                        return prevCart.filter((item) => item.id !== productId);
                    }
                } else if (type === "Add_Count") {
                    const newCount = productInCart.count + 1;
                    return prevCart.map((item) =>
                        item.id === productId
                            ? {
                                  ...item,
                                  count: newCount,
                                  total_price: parseFloat(
                                      (newCount * price).toFixed(2)
                                  ),
                              }
                            : item
                    );
                }
            }
            return prevCart;
        });
    }

    function removeFromCart(productId) {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }

    return IsCartOpen || cartPage ? (
        cart.length > 0 ? (
            <div

                className="cart-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
            >
                {cart.map((product, index) => (
                    <div
                        key={index}
                        className="productCard justify-items-center justify-around flex flex-col"
                        style={{ height: "650px" }}
                    >
                        <img
                            src={product.image}
                            alt={product.title}
                            style={{ height: "40%" }}
                        />
                        <p
                            className={`font-medium text-xl product_title_${
                                index + 1
                            }`}
                        >
                            {product.title}
                        </p>

                        <p className="text-2xl font-bold">
                            ${product.price} <br /> Total: $
                            {typeof product.total_price === "number"
                                ? product.total_price.toFixed(2)
                                : product.price.toFixed(2)}
                        </p>

                        <div className="CountControl flex" data-id={product.id}>
                            <button
                                className="Subract_Count"
                                onClick={(event) =>
                                    CountControl(event, "Subract_Count")
                                }
                            >
                                -
                            </button>
                            <span className="text-2xl">{product.count}</span>
                            <button
                                className="Add_Count"
                                onClick={(event) =>
                                    CountControl(event, "Add_Count")
                                }
                            >
                                +
                            </button>
                        </div>
                        <div className="flex font-semibold text-xl">
                            <span
                                className="RemoveContorl"
                                onClick={() => removeFromCart(product.id)}
                            >
                                Remove All
                            </span>
                            <span
                                className="BuyNowContorl"
                                data-id={product.id}
                            >
                                Buy Now
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-2xl font-semibold justify-items-center">
                Cart is Empty
                <h2
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => (window.location.hash = "#products")}
                >
                    Go Back To Shopping
                </h2>
            </div>
        )
    ) : null;
}
