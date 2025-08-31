import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BooksPage from './page/BookPage';
import HomePage from './page/HomePage';
import MenuPage from './page/MenuPage';
import OrdersPage from './page/OrderPage';
import './App.css';

// เพิ่ม type definition สำหรับ import.meta.env เพื่อแก้ไข error
interface ImportMetaEnv {
  VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// อ่าน base URL จาก ENV (ถ้าไม่มีให้ fallback เป็นโปรดักชันโดเมน)
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://restful-api-backend-psi.vercel.app';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">หน้าแรก</Link> |{' '}
          <Link to="/books">รายการหนังสือ</Link> |{' '}
          <Link to="/menu">เมนูเครื่องดื่ม</Link> |{' '}
          <Link to="/orders">รายการคำสั่งซื้อ</Link>
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
