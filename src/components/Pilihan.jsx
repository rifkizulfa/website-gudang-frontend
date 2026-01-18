import React from "react";
import '../styles/sap-style.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

export default function Pilihan() {
    return (
        <>
        <div className="sales-form-wrapper">
        <div className="sales-form-card">
            <div className="b-pilihan">
            <Link to="/zmme0011" className="menu-item">
            <div className="">
                <span className="">ZMME0011</span>              
            </div>
            <div> 
                <span className="item">Barang titipan</span>
            </div>
            </Link>
        </div>
        <div className="b-pilihan">
            <Link to="/zsdi002" className="menu-item">
            <div className="">
                <span className="">ZSDI002</span>              
            </div>
            <div> 
                <span className="item">Barang retur</span>
            </div>
            </Link>


        </div>
            <Link to="/MenuPRD2" className="kembali">
                Kembali
            </Link>
        </div>   
        </div>
        
        </>
    )
}
