
import React, { useState } from 'react'
import api from '../../utils/api';
import {setToken} from '../../utils/auth'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
     const [error, setError] = useState('') 
     const [message, setMessage] = useState('') 
  
    async function handleRegister(e){
      e.preventDefault();
      setError('');
      setMessage('')
      try {
        const res = await api.post('/user/register', { name,email, password });
        console.log(res.data);
        if(res.data.message = "User registered successfully")
        {
          setMessage(res.data.message + ", Please login to use your account.")
        }

      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      }
    }


    return (
      <form className='form-container'>
        <div className='title'>Create a New Account</div>


        <div className="input-container">
           <span>Name</span>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="input-container">
           <span>Email</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
       
        <div className="input-container">
          <span>Password</span>
          <input
  
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: '#ff4d4f', margin: '0.5rem 0' }}>{error}</div>}
        {message && <div style={{ color: 'green', margin: '0.5rem 0' }}>{message}</div>}
        <button
          onClick={(e)=>handleRegister(e)}
        >
          Register
        </button>
      </form>
    )
}
