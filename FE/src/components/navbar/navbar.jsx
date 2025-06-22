import React from 'react'
import './navbar.css'
import { LogOut, ShoppingBag, Package, LogIn, User, Search, X} from 'lucide-react'
import {isAuthenticated, getUserNameFromToken, logout} from '../../utils/auth'
import { useState } from 'react'
import Login from '../login/login'
import Register from '../register/register'

export default function Navbar() {
  
    const isLoggedIn = isAuthenticated();
    const userName = getUserNameFromToken();
  

    const [loginModal, setLoginOpen] = useState(false);
    const [registerModal, setRegisterModal] = useState(false);


    return (
    <nav>
        <div className="nav-container">
            <div className="logo">  
                E Shop
            </div>
             <div className="nav-search">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="search-input"
                />
                <button className='search-btn'>
                    <Search size={'18px'}/>
                </button>
            </div>
            <div className="nav-actions">
                
                {isLoggedIn ? (
                    <>
                        <button className="nav-btn">
                            <Package
                            />
                            Orders
                        </button>
                        <button className="nav-btn">
                            <ShoppingBag
                            />
                            Cart
                        </button>
                        <button className="nav-btn"
                          onClick={()=>{logout()}}
                        >
                             
                            <LogOut/>
                            {userName}
                        </button>
                    </>
                ) : (
                        <>
                        <button className="nav-btn"
                            onClick={() => setRegisterModal(true)}
                        >
                            
                            Register
                            <User/>
                        </button>
                        <button className="nav-btn"
                            onClick={() => setLoginOpen(true)}
                        >
                           Login
                            <LogIn/>
                        </button>
                    </>
                         
                )}
                

                
                
            </div>
        </div>  
       
        {loginModal && (
          <div className="modal-backdrop" onClick={() => setLoginOpen(false)}>
            
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className='modal-header'>
                
                <div className="modal-close" onClick={() => setLoginOpen(false) }>
                    <X size={'20px'} strokeWidth={'3px'}/>
                </div>
                
              </div>
              <div className="modal-body">
                <Login />
              </div>
              
            </div>
          </div>
        )}

        {registerModal && (
          <div className="modal-backdrop" onClick={() => setRegisterModal(false)}>
            
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className='modal-header'>
                
                <div className="modal-close" onClick={() => setRegisterModal(false) }>
                    <X size={'20px'} strokeWidth={'3px'}/>
                </div>
                
              </div>
              <div className="modal-body">
                <Register />
              </div>
              
            </div>
          </div>
        )}

    </nav>
  )
}
