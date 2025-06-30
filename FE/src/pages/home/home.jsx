
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import '../home/home.css'; 


export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;

  const [products, setProducts] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0)

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    
    api.get(`user/products/list?page=${page}&limit=20`)
      .then(res => {
        setProducts(res.data.products);
        setPageCount(res.data.pageCount);
        setTotalCount(res.data.totalCount)
        console.log(res.data.products)
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // or 'auto' for instant scroll
    });
  };

  return (
    <div className="products-page">
      <h2 className="products-title">Products</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card"
                onClick={() => navigate(`/product/${product._id}`)}
              >
               <div className='image-container'>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="product-image"
                />
               </div>
                
                <div className="product-info-container">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    ${product.price}
                  </div>
                  <div className="product-category">
                   {
                    product.category.map(c=>(
                        <div className="tag">{c}</div>
                    ))
                   }
                  </div>
                </div>
                
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className={`pagination-btn${page <= 1 ? ' disabled' : ''}`}
            >Prev</button>
            <span className="pagination-info">
              Page {page} of {pageCount}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pageCount}
              className={`pagination-btn${page >= pageCount ? ' disabled' : ''}`}
            >Next</button>
          </div>
        </>
      )}
    </div>
  );
}
