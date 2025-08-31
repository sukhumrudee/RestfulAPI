import { useEffect, useState } from 'react';

type Menu = {
  id: number;
  name: string;
  price: number;
  orders: object;
};

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [notes, setNotes] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch('http://localhost:3000/api/menu');
      const data: Menu[] = await res.json();
      setMenuItems(data);

      // quantity เริ่มต้น = 0
      const initialQuantities: { [key: number]: number } = {};
      const initialNotes: { [key: number]: string } = {};
      data.forEach(item => {
        initialQuantities[item.id] = 0;
        initialNotes[item.id] = ''; // note เริ่มต้นว่าง
      });
      setQuantities(initialQuantities);
      setNotes(initialNotes);
    };
    fetchMenu();
  }, []);

  const increaseQuantity = (id: number) => {
    setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decreaseQuantity = (id: number) => {
    setQuantities(prev => ({ ...prev, [id]: prev[id] > 0 ? prev[id] - 1 : 0 }));
  };

  const handleNoteChange = (id: number, value: string) => {
    setNotes(prev => ({ ...prev, [id]: value }));
  };

  const handleOrder = async (item: Menu) => {
    const quantity = quantities[item.id] || 1;
    const note = notes[item.id] || 'ไม่มี';

    if (quantity === 0) {
      alert("กรุณาเลือกจำนวนก่อนสั่งซื้อ");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drinkId: item.id,
          quantity: quantity,
          note: note
        })
      });

      const data = await res.json();
      console.log('สั่งซื้อสำเร็จ:', data);

      // รีเซ็ต quantity และ note
      setQuantities(prev => ({ ...prev, [item.id]: 0 }));
      setNotes(prev => ({ ...prev, [item.id]: '' }));
      alert("สั่งซื้อสำเร็จ");
      return;
    } catch (err) {
      console.error('เกิดข้อผิดพลาด:', err);
    }
  };

  return (
    <div className="drink-menu-section">
      <h2>Drinks</h2>
      <div className="drink-menu-items">
        {menuItems.map(item => (
          <div className="drink-menu-item" key={item.id}>
            <img
              src="https://aromathailand.com/wp-content/uploads/2024/02/aaa.jpg"
              alt={item.name}
            />
            <div className="drink-menu-info">
              <h3>{item.name}</h3>
              <p className="drink-price">ราคา: {item.price} บาท</p>
              <p>จำนวนออเดอร์: {quantities[item.id]}</p>

              {/* ปุ่ม + / - */}
              <div className="quantity-container">
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <span>{quantities[item.id]}</span>
                <button onClick={() => increaseQuantity(item.id)}>+</button>
              </div>

              {/* ช่องหมายเหตุ */}
              <input
                type="text"
                placeholder="หมายเหตุ"
                value={notes[item.id]}
                onChange={(e) => handleNoteChange(item.id, e.target.value)}
                className="note"
              />

              <button onClick={() => handleOrder(item)}>สั่งซื้อ</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
