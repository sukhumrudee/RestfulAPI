import { useEffect, useState } from 'react';

type Orders = {
    id: number
    drinkId: number
    quantity: number
    note: string
    status: string
    drink: {
        name: string
    }
}

const OrdersPage = () => {
    const [orders, setOrders] = useState<Orders[]>([]);

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await fetch('http://localhost:3000/api/orders');
            const data: Orders[] = await res.json()
            setOrders(data)
        }
        fetchOrder();
    }, [])

    const [confirmedIds, setConfirmedIds] = useState<number[]>([]);

    const handleConfirm = (id: number) => {
        if (confirmedIds.includes(id)) return;

        fetch(`http://localhost:3000/api/orders/${id}/confirm`, { method: 'PATCH' })
            .then(res => res.json())
            .then(updated => {
                setOrders(orders.map(o => o.id === id ? updated : o));
                setConfirmedIds(prev => [...prev, id]);
            });
    };


    const handleDelete = (id: number) => {
        fetch(`http://localhost:3000/api/orders/${id}`, { method: 'DELETE' })
            .then(() => setOrders(orders.filter(o => o.id !== id)));
    };


    return (
        <div className="menu-section">
            <h2>รายการที่สั่ง</h2>
            <div className="menu-items">
                {orders.map(order => (
                    <div className="menu-item" key={order.id}>
                        <img
                            src="https://aromathailand.com/wp-content/uploads/2024/02/aaa.jpg"
                            alt={order.drink?.name ?? 'เครื่องดื่ม'}
                            className="menu-item-img"
                        />
                        <div className="menu-item-info">
                            <h3>{order.drink?.name ?? 'ไม่ทราบชื่อ'}</h3>
                            <p>จำนวน: {order.quantity}</p>
                            <p>หมายเหตุ: {order.note}</p>
                            <p>สถานะ: {order.status}</p>
                            <div className="menu-actions">
                                <button onClick={() => handleConfirm(order.id)} disabled={confirmedIds.includes(order.id)}>ยืนยัน</button>

                                <button onClick={() => handleDelete(order.id)}>ลบ</button>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>

    );
};

export default OrdersPage;
