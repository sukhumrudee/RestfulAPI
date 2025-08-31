import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BooksPage from './page/BookPage'; 
import HomePage from './page/HomePage';

import MenuPage from './page/MenuPage'; 
import OrdersPage from './page/OrderPage';  
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <a href="/">หน้าแรก</a> |
          <a href="/books">รายการหนังสือ</a> |
          <a href="/menu">เมนูเครื่องดื่ม</a> |
          <a href="/orders">รายการคำสั่งซื้อ</a>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/books" element={<BooksPage />} /> 
          <Route path="/menu" element={<MenuPage />} /> 
          <Route path="/orders" element={<OrdersPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
