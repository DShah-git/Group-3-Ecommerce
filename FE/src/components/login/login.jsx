import React, { useState } from 'react'
import '../login/login.css'
import api from '../../utils/api';
import {setToken} from '../../utils/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')  
  const [error, setError] = useState('')  

  async function handleLogin(e){
    e.preventDefault()
    setError('');
    try {
      const res = await api.post('/user/login', { email, password });
      if(res.data.token){
        setToken(res.data.token)
        window.location.reload()
      }
      console.log(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <form className='form-container'>
      <div className='title'>Login</div>
      
      <div className="input-container">
         <span>Email</span>
        <input
          type="text"
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
      
      <button 
        onClick={(e)=>{handleLogin(e)}}
      >
        Login
      </button>
    </form>
  )
}
