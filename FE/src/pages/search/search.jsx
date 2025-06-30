import {useState, useEffect} from 'react'
import './search.css'
import { useSearchParams,useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { CircleX } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query');
  const page = parseInt(searchParams.get('page')) || 1;
  const categoriesParam = searchParams.get('categories');
  const categories = categoriesParam ? categoriesParam.split(',') : [];
  const [products, setProducts] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const [inputCategory, setInputCategory] = useState('')


  const navigate = useNavigate();


  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        console.log(query, categories)
        const res = await api.get('user/products/filter', {
          params: {
            page: page,
            limit: 20,
            category: categories.join(','),
            searchTerm: query
          }
        });
        setProducts(res.data.products || []);
        console.log(res.data)
        setPageCount(res.data.pageCount)
      } catch (err) {
        setError('Failed to fetch products');
      }
      setLoading(false);
    }


    if(!query) { location.href = "/"}
    else fetchProducts();
  }, [query, categoriesParam,page]);
  
  
  const handlePageChange = (newPage) => {
    setSearchParams({  query:query, categories : categories.join(","),page: newPage });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // or 'auto' for instant scroll
    });
  };


  const removeCategory = (cat) => {
    categories.splice(categories.indexOf(cat),1)
    handlePageChange(page)
  }

  const addCategory = (cat) => {
    categories.push(cat)
    handlePageChange(page)
  }

  return (
     <div className="products-page">

      
      <div className="category-handler">

        <div>
          <h2 className="products-title">Showing Products for - <span style={{ color: "darkgreen" }}>{query}</span></h2>
          <h3>
            Filter Categories -
            {categories.length == 0 && <> No Categories applied</>}
            <div className="tags">
              {
                categories.map(cat => (
                  <div className="tag">
                    {cat}

                    <CircleX size={'14px'} onClick={() => {
                      removeCategory(cat)
                    }} />
                  </div>
                ))
              }
            </div>
          </h3>
        </div>
        

        <div className="cat-input">
          <label>Add Categories for search </label>
          
          <input type="text" 
          placeholder="Add category"
          className="add-input "
          onChange={(e)=>{(setInputCategory(e.target.value))}}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              addCategory(e.target.value.trim());
            }
          }}
          />
          <button onClick={()=>{addCategory(inputCategory)}}> Add </button>
        </div>
      </div>
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
  )
}
