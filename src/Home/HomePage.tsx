import React, { useEffect, useState } from "react";
import type { Basket, Order, OrderPayload, Product } from "./types/types";
import axios from "axios";

const HomePage: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState<Product[]>([]);
  const [basket, setBasket] = useState<Basket[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products`);
        const data = response.data.products;
        if (data) {
          setProducts(data);
        } else {
          window.alert("Unable to load products");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          window.alert("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiUrl}/orders`);
        const data = response.data;
        console.log(response);
        if (data) {
          setOrders(data);
        } else {
          window.alert("Unable to load Orders");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          window.alert("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchOrders();
  }, [apiUrl]);

  const renderProducts = () => {
    return products.map((p) => {
      const current = basket.find((b) => b.id == p.id);
      const basketExists = current && current.quantity >= 1;

      return (
        <div key={p.id} className="product">
          <div>
            <p>{p.name}</p>
            <p>{p.price}</p>
          </div>
          <div className="buttons-container">
            {basketExists && (
              <div
                className="add-product-button"
                onClick={() => handleRemoveFromBasket(p)}
              >
                -
              </div>
            )}
            <div
              className="add-product-button"
              onClick={() => handleAddToBasket(p)}
            >
              +
            </div>
          </div>
        </div>
      );
    });
  };

  const renderBasket = () => {
    if (basket.length > 0) {
      return basket.map((p) => {
        return (
          <div key={p.id} className="product">
            <p>{p.name}</p>
            <p>{p.quantity}</p>
          </div>
        );
      });
    }
  };

  const handleAddToBasket = (product: Product) => {
    setBasket((prevBasket) => {
      const existing = prevBasket.find((item) => item.id === product.id);

      if (existing) {
        return prevBasket.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });
      } else {
        return [
          ...prevBasket,
          {
            id: product.id,
            name: product.name,
            quantity: 1,
          },
        ];
      }
    });
  };

  const handleRemoveFromBasket = (product: Product) => {
    setBasket((prevBasket) => {
      // find the item
      const existingItem = prevBasket.find((item) => item.id === product.id);

      if (!existingItem) {
        return prevBasket;
      }

      if (existingItem.quantity > 1) {
        return prevBasket.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevBasket.filter((item) => item.id !== product.id);
      }
    });
  };

  const handleBuy = async () => {
    const payload: OrderPayload = {
      order: {
        customer_name: "Simon Jarret",
        order_items_attributes: basket.map((b) => {
          return { product_id: b.id, quantity: b.quantity };
        }),
      },
    };

    try {
      if (basket.length > 0) {
        const response = await axios.post(`${apiUrl}/orders`, payload);
        console.log("Order created:", response.data);
        window.alert("Order created!");
      } else {
        window.alert("Basket is empty!");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const renderOrders = () => {
    return orders.map((p) => {
      return (
        <div key={p.id} className="product">
          <p>{p.customer_name}</p>
          <p>{p.total_price}</p>
        </div>
      );
    });
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h1>Welcome to Buy One get One free! </h1>
      <div className="card">
        <p>Welcome to our store!</p>
        <p className="read-the-docs">Checkout our products!</p>
        <div className="product-container">{renderProducts()}</div>
        <div className="save-container">
          <div className="buy-button" onClick={() => handleBuy()}>
            Buy
          </div>
        </div>

        {basket.length > 0 && (
          <>
            <p>Your basket:</p>
            <div className="product-container">{renderBasket()}</div>
          </>
        )}

        {orders.length > 0 && (
          <>
            <p>Your orders:</p>
            <div className="product-container">{renderOrders()}</div>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
