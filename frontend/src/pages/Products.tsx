import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Product.css";
import cityBg from '../images/products/totachi2.jpg';

interface ProductItem {
  _id?: string;
  title: string;
  description: string;
  imgURL: string;
  category: string;
}

const categories = [
  "All Products",
  "Engine Oil and Oil Filters",
  "Air Filters",
  "Brake Parts",
  "Engine Flushing",
  "Coolants",
];

const BASE_IMAGE_URL = 'https://projectspeedautoworkscorporation-backend.onrender.com';
const API = import.meta.env.VITE_API_URL;

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = searchTerm.trim()
    ? products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedCategory === "All Products"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="about-page">
      <section
      className="product-section"
      style={{ backgroundImage: `url(${cityBg})` }}
      >
      <div className="overlay">
        <h1 className="product-heading">OUR PRODUCTS</h1>
        <p className="product-subheading">Sourced from reputable manufacturers and tested to meet or exceed OEM standards.</p>
      </div>
      </section>

      <div className="content-wrapper">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button
            onClick={() => setSearchTerm("")}
            className="search-clear-btn"
          >
            Clear
          </button>
        </div>

        <div className="product-nav">
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading products...</div>
        ) : (
          <div className="container">
            {filteredProducts.map((product, index) => (
              <div className="card" key={product._id || index}>
                <img 
                          src={`${BASE_IMAGE_URL}/${product.imgURL || ''}`} 
                          alt={product.title} 
                          className="product-thumb"
                          onError={(e) => {
                            e.currentTarget.src = '/vite.svg'; // fallback
                            e.currentTarget.alt = 'Image not available';
                          }}
                        />
                <h2>{product.title}</h2>
                <p>{product.description}</p>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", width: "535%"}}>
                No products found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

