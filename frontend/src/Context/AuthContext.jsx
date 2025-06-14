import React, {  createContext, useState } from 'react'
export const authDataContext=createContext();

export default function AuthContext({children}) {
let serverUrl="http://localhost:8000";

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
