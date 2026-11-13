import { useState, useEffect } from "react";
import products from "./data.json";
import "./App.css";

function App() {

  const [showModal, setShowModal] = useState(false);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    const existing = cart.find(item => item.name === product.name);

    if (existing) {
      setCart(cart.map(item =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function increase(name) {
    setCart(cart.map(item =>
      item.name === name
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  }

  function decrease(name) {
    setCart(cart.map(item =>
      item.name === name && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  }

  function removeItem(name) {
    setCart(cart.filter(item => item.name !== name))
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  return (
    <div className="container">

      <h1>Desserts</h1>

      <div className="layout">

        <div className="products">

          {products.map((product, index) => (

            <div className="product" key={index}>

              <img
                src={`/assets/images/${product.image.desktop.split("/").pop()}`}
                alt={product.name}
              />

              <p>{product.category}</p>

              <h3>{product.name}</h3>

              <h4>${product.price.toFixed(2)}</h4>

              <button onClick={() => addToCart(product)}>
                Add to Cart
              </button>

            </div>

          ))}

        </div>

        <div className="cart">

          <h2>Your Cart ({cart.length})</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (

            cart.map(item => (

              <div className="cart-item" key={item.name}>

                <h4>{item.name}</h4>

                <p>
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>

                <button onClick={() => decrease(item.name)}>
                  -
                </button>

                <span>{item.quantity}</span>

                <button onClick={() => increase(item.name)}>
                  +
                </button>

                <button onClick={() => removeItem(item.name)}>
                  Remove
                </button>

              </div>

            ))

          )}

          <h3>Total: ${total.toFixed(2)}</h3>

          {cart.length > 0 && (
            <button onClick={() => setShowModal(true)}>
              Confirm Order
            </button>  
          )}

          <button onClick={() => setCart([])}>
            Clear Cart
          </button>

        </div>

      </div>

      {showModal && (
  <div className="modal-overlay">

    <div className="modal">

      <h2>Order Confirmed!</h2>

      <p>Thank you for your order.</p>

      {cart.map(item => (
        <p key={item.name}>
          {item.name} × {item.quantity}
        </p>
      ))}

      <h3>Total: ${total.toFixed(2)}</h3>

      <button onClick={() => {
        setCart([]);
        setShowModal(false);
      }}>
        Start New Order
      </button>

    </div>

  </div>
)}

    </div>
  );
}

export default App;