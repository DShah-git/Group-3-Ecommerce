import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import api from '../../../utils/api';
import './viewProduct.css'
import { adminGetToken } from '../../../utils/adminAuth';
import { Edit, Trash, PlusCircle, Eye} from 'lucide-react'


import { useNavigate } from 'react-router-dom';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(id)
    if (id) {
      api.get(`admin/product/${id}`,{headers:{"x-auth":adminGetToken()}})
        .then(res => {
          setProduct(res.data);
          
        })
        .catch(err => {
          console.error('Failed to fetch product:', err);
        });
    }
  }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
        
            let res = await api.post(`/admin/product/delete/${product._id}`, {},{headers: { "x-auth": adminGetToken() }});
            
            if(res.data.message){
                navigate("/admin/home")
            }   

            
        
        } catch (err) {
        console.log("Error deleting the product - ", err)
        }
    };

  if (!product) return (
    <div className="product-page">
      <div className="product-image-section">
        <div className="skeleton-image" />
      </div>
      <div className="product-details-section">
        <div className="skeleton-title skeleton-bar" />
        <div className="skeleton-category skeleton-bar" />
        <div className="skeleton-description skeleton-bar" />
        <div className="skeleton-description skeleton-bar short" />
        <div className="skeleton-price skeleton-bar" />
        <div className="skeleton-btn skeleton-bar" />
      </div>
    </div>
  );

  return (
    <div className="container">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        &#8592; Back
      </button>

      <div className="product-page">
        
        <div className="product-image-section">
          <img src={product.images?.[0]} alt={product.name} className="product-main-image" />
        </div>
        <div className="product-details-section">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-cat">Category: {product.category?.join(', ')}</div>

          <div className="product-description">{product.description}</div>
          <div className="product-price">${product.price}</div>
        
          <div className='product-stock'>
            Unit in stock :  
            <span > <b> {product.stock} </b> </span>
          </div>

            <div className="actions">
                <button className="edit-btn"
                    onClick={()=>{
                        navigate("/admin/edit-product/"+product._id)
                    }}
                >
                    <Edit size={"15px"}/>
                      Edit
                </button>
                <button className="delete-btn" onClick={()=>handleDelete()}>
                    <Trash size={"15px"}/>
                      Delete

                </button>
            </div>

          
        
        </div>
      </div>
    </div>
  )
}
