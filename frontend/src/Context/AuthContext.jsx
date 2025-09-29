import React, {  createContext, useState } from 'react'
export const authDataContext=createContext();

export default function AuthContext({children}) {
let serverUrl="https://rentez-backend.onrender.com";

let[loading,setLoading]=useState(false);

 let value={
    serverUrl,
    loading,setLoading
  }
  return (
    <div>
       <authDataContext.Provider value={value}>
        {children}
       </authDataContext.Provider>
    </div>
  )
}
