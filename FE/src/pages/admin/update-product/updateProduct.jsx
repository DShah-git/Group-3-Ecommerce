import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { adminGetToken } from '../../../utils/adminAuth';
import './updateproduct.css'
import { CircleCheck, CircleX, Save } from 'lucide-react';

export default function EditProduct() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [category, setCategory] = useState('')

  useEffect(() => {
    if (id) {
      api.get(`admin/product/${id}`, { headers: { "x-auth": adminGetToken() } })
        .then(res => {
    
          setProduct(res.data);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          alert('Failed to fetch product');
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value
    }));
  };

   function addCategory(){
    if(category=='') return;

    let productToSave = {...product}
    productToSave.category.push(category)
    setCategory('')
    setProduct(productToSave)

  }

  function removeCategory(c){
    let productToSave = {...product}
    productToSave.category.splice(productToSave.category.indexOf(c),1)
    setProduct(productToSave)
  }

  const handleSave = async () => {
    try {
      await api.post(`/admin/product/update/${id}`, product, {
        headers: { "x-auth": adminGetToken() }
      });
      
      navigate("/admin/view-product/"+id);
    } catch (err) {
      alert("Failed to update product");
    }
  };

  const handleDiscard = () => {
    navigate('/admin/view-product/'+id)
  };

  if (loading || !product) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>Edit Product</h2>
      <div className="edit-product-form">
        <label>
          Name:
          <input name="name" value={product.name} onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={product.description} onChange={handleChange} />
        </label>
        <label>
          Price:
          <input className='half' name="price" type="number" value={product.price} onChange={handleChange} />
        </label>
        <label>
          Stock:
          <input className='half' name="stock" type="number" value={product.stock} onChange={handleChange} />
        </label>
        <label>
          Add Category: (Enter the category below and press enter to add the category.)
          <input name="category" 
          value ={ category}
          onChange={e => setCategory(e.target.value)} 
          onKeyDown={e => {
                if (e.key === 'Enter') {
                  addCategory();
                }
            }}
          />
        </label>
        <div className='categories'> 
            {
                product.category.map((c) => (
                    <div className='tag cat-tag'>
                       <p>{c}</p> 
                        <CircleX size={'20px'} className='butn-del'
                            onClick={()=>removeCategory(c)}
                        />

                    </div>
                ))
            }
        </div>
        
        <div className='actions' style={{ marginTop: 16 }}>
            <button className="admin-btn edit-btn" onClick={handleDiscard} style={{ marginLeft: 8 }}>
                <CircleX/>
                Discard Changes</button>
           <button className="admin-btn " onClick={handleSave}>
                <Save/>
            Save Changes</button>
        </div>
      </div>
    </div>
  );
}