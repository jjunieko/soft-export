import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";
import { NumberFormatBase } from "react-number-format";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState(0);
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [products, setProducts] = useState([]);
  const [taxRate, setTaxRate] = useState(0);
  const [totalTaxes, setTotalTaxes] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(isLoggedIn);

    if (isLoggedIn) {
      fetchProducts();
    }
  }, []);

  const fetchProducts = () => {
    axios
      .get("/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const handleLogin = (username, password) => {
    if (username === "joao" && password === "mercado") {
      setLoggedIn(true);
      localStorage.setItem("loggedIn", "true");
    } else {
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      name: name,
      typeId: typeId,
      price: price,
      amount: amount,
      taxRate: taxRate,
    };
    const taxAmount = (price * amount * taxRate) / 100;

    setTotalTaxes(totalTaxes + taxAmount);

    axios
      .post("/product", newProduct)
      .then((response) => {
        setProducts([...products, response.data]);

        // Fetch the updated list of products
        fetchProducts();

        // Reset the form fields
        setName("");
        setTypeId(0);
        setPrice(0);
        setAmount(0);
        setTaxRate(0);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  if (!loggedIn) {
    return (
      <div className="container">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="mt-5">Product Registration</h1>
      <div className="card mt-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Type:
              </label>
              <select className="form-select" id="type" value={typeId} onChange={(e) => setTypeId(parseInt(e.target.value))}>
                <option value={0}>Select a type</option>
                <option value={1}>Type 1</option>
                <option value={2}>Type 2</option>
                <option value={3}>Type 3</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price:
              </label>
              <NumberFormatBase
                thousandSeparator={true}
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale={true}
                allowNegative={false}
                className="form-control"
                id="price"
                value={price}
                onValueChange={(values) => setPrice(values.floatValue)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                amount:
              </label>
              <NumberFormatBase
                thousandSeparator={true}
                allowNegative={false}
                className="form-control"
                id="amount"
                value={amount}
                onValueChange={(values) => setAmount(values.floatValue)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="taxRate" className="form-label">
                Tax Rate:
              </label>
              <input
                type="number"
                className="form-control"
                id="taxRate"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Add Product
            </button>
          </form>
        </div>
      </div>
      <h2 className="mt-4">Products:</h2>
      <ul className="list-group">
        {products.map((product) => {
          const totalPrice = parseFloat(product.price) || 0;
          const taxRate = parseFloat(product.taxRate) || 0;
          const taxAmount = (totalPrice * taxRate) / 100;

          return (
            <li key={product.id} className="list-group-item">
              {product.name} - {product.price ? `$${parseFloat(product.price).toFixed(2)}` : "N/A"} - {product.amount} units -
              Taxes: ${isNaN(taxAmount) ? "N/A" : taxAmount.toFixed(2)}
            </li>
          );
        })}
      </ul>
      <h3>Total Value: ${totalValue.toFixed(2)}</h3>
      <h3>Total Taxes: ${totalTaxes.toFixed(2)}</h3>
      <button className="btn btn-danger mt-4" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default App;
