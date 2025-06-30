import React, { useEffect, useState } from 'react'
import './adminproducts.css'
import { adminGetToken } from '../../../utils/adminAuth'
import api from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import { Edit, Trash, PlusCircle, Eye} from 'lucide-react'

export default function AdminHome() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(1);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await api.get(`admin/product/all?page=${page}`, {
        headers: { 'x-auth': adminGetToken() }
      });
      setProducts(res.data.products || []);
      setPageCount(res.data.pageCount || 1);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      setProducts([]);
    }
    setLoading(false);
  }

  useEffect(() => {

    fetchProducts();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // Delete product handler
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      
      let res = await api.post(`/admin/product/delete/${productId}`, {},{headers: { "x-auth": adminGetToken() }
      });
      
      console.log(res)

      setProducts((prev) => prev.filter((p) => p._id !== productId));
      
      fetchProducts();
    } catch (err) {
      console.log("Error deleting the product - ", err)
    }
  };

  return (
    <div className="products-container">
      <div className="page-header">
        <h2>Products - (Page {page})</h2>
        <button className="create-button"
         onClick={()=>{ window.location.pathname = "/admin/create-product" }}
        > <PlusCircle/> New product </button>
      </div>
     
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="admin-products-table">
            <thead>
              <tr style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                <th style={{padding:"0.5rem 0rem 0.5rem 1rem"}}>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Categories</th>
                <th>Stock/units</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod, idx) => (
                <tr key={prod._id}>
                  <td style={{padding:"0.5rem 0rem 0.5rem 1rem", fontSize:"0.8rem"}}>{idx+1}</td>
                  <td style={{ fontWeight: 600 }}>{prod.name}</td>
                  <td>${prod.price}</td>
                  <td>{Array.isArray(prod.category) ? prod.category.join(', ') : prod.category}</td>
                  <td>{prod.stock}</td>
                  <td className='actions-row'>
                    <button className="admin-btn view-btn"
                      onClick={()=>{ window.location.pathname = "/admin/view-product/" + prod._id }}
                    >
                      <Eye size={"15px"}/>
                      View
                    </button>
                    <button className="admin-btn edit-btn"
                      onClick={()=>{ window.location.pathname = "/admin/edit-product/" + prod._id }}
                    >
                      <Edit size={"15px"}/>
                      Edit
                    </button>
                    <button className="admin-btn delete-btn"
                      onClick={()=>handleDelete(prod._id)}
                    >
                      <Trash size={"15px"}/>
                      Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-controls" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >Prev</button>
            <span style={{ alignSelf: 'center' }}>Page {page} of {pageCount}</span>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pageCount}
            >Next</button>
          </div>
        </>
      )}
    </div>
  )
}
