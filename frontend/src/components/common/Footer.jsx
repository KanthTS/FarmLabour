import React from 'react'
import { FaInstagramSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

function Footer() {
  return (
    <div className="card bg-secondary">
      
      <div className="text-center text-warning  card-body">Email:tsiddalakshmikanth@gmail.com</div>
      
      <div className="text-center text-warning card-body">Phone-No:1800-18-3244</div>
      <div className="text-center text-warning card-body">Address:Plot:No:1/143,Bachupally,Hyderabad,500008</div>
      <div className="card-footer bg-white p-0 text-center display-5 text-secondary">
         <div >
         <FaInstagramSquare />
        <FaTwitter/>
        <FaWhatsapp/>
         </div>
      </div>
      
    </div>
  )
}

export default Footer