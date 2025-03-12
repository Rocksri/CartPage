import { useEffect, useState } from "react";

export default function OnClickCartAdds({
    products,
    setIsCartOpen,
    IsCartOpen,
}) {
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage on first render
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        // Save cart to localStorage whenever it changes
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function handleClick(event) {
        const target = event.target;
        if (target.id && target.id.startsWith("product_title_cart")) {
            // const productId = parseInt(target.id.split("_").pop()); // Extract product ID
            const productId = parseInt(target.getAttribute("data-id")); // Get the real product ID

            const productToAdd = products.find(
                (product) => product.id === productId
            );

            if (productToAdd) {
                setCart((prevCart) => {
                    const existingProduct = prevCart.find(
                        (item) => item.id === productId
                    );

                    if (existingProduct) {
                        // If product exists, increase the count
                        return prevCart.map((item) =>
                            item.id === productId
                                ? { ...item, count: item.count + 1 }
                                : item
                        );
                    } else {
                        // Otherwise, add new product with count = 1
                        return [...prevCart, { ...productToAdd, count: 1 }];
                    }
                });
            }

            document
                .getElementById("product_add")
                .classList.add("product_added");
        }
    }

    function OnClickCartOpen(event) {
        const target = event.target;

        if (target.closest(".MainCart")) {
            if (cart.length === 0) {
                alert("Please Add Products To Cart");
            } else {
                console.log("Opening cart...");
                setIsCartOpen((prev) => !prev);
            }
        }
    }

    function CountControl(event, type) {
        const productId = parseInt(
            event.target.parentNode.getAttribute("data-id")
        );

        setCart((prevCart) => {
            const productInCart = prevCart.find(
                (item) => item.id === productId
            );

            if (productInCart) {
                if (type === "Subract_Count") {
                    if (productInCart.count > 1) {
                        return prevCart.map((item) =>
                            item.id === productId
                                ? { ...item, count: item.count - 1 }
                                : item
                        );
                    } else {
                        // Remove from cart if count becomes 0
                        return prevCart.filter((item) => item.id !== productId);
                    }
                } else if (type === "Add_Count") {
                    return prevCart.map((item) =>
                        item.id === productId
                            ? { ...item, count: item.count + 1 }
                            : item
                    );
                }
            } else {
                // Product not in cart, add it with count 1
                return [...prevCart, { id: productId, count: 1 }];
            }
            return prevCart; // Return previous cart if no changes
        });
    }

    function removeFromCart(productId) {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [products]);

    useEffect(() => {
        document.addEventListener("click", OnClickCartOpen);

        return () => {
            document.removeEventListener("click", OnClickCartOpen);
            const productCount = document.querySelector(".product_added");
            // const productId = document.querySelector("data-id");
            console.log(pro)
            if (productCount) {
                productCount.innerHTML = cart.length;
            }
        };
    }, [cart]);

    console.log(cart)
    return (
        IsCartOpen && ( // Only render when cart is not empty
            <div className="cart-container gap-y-[1%] gap-x-[5%]">
                {cart.map((product, index) => (
                    <div
                        key={index}
                        className="productCard justify-items-center justify-around flex flex-col"
                        style={{
                            height: "650px",
                        }}
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
                            ${product.price} <br /> Total $
                            {product.price * product.count}
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
                        <div className="flex font-semibold text-xl ">
                            <span
                                className="RemoveContorl"
                                onClick={() =>
                                    removeFromCart(product.id)
                                }
                            >
                                Remove All
                            </span>
                            <span className="BuyNowContorl">Buy Now</span>
                        </div>
                    </div>
                ))}
            </div>
        )
    );
}
