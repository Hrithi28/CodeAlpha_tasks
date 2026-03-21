const mongoose = require('mongoose');

async function runTests() {
    try {
        const baseUrl = 'http://localhost:5000/api';

        // Clear the DB to start fresh
        await mongoose.connect('mongodb://localhost:27017/restaurant_mgmt');
        await mongoose.connection.dropDatabase();

        console.log('--- 1. Seed Inventory ---');
        const tomatoRes = await fetch(`${baseUrl}/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Tomato', currentStock: 20, reorderLevel: 5, unit: 'kg' })
        });
        const tomato = await tomatoRes.json();
        console.log('Created Tomato:', tomato.name, '- Stock:', tomato.currentStock);

        const doughRes = await fetch(`${baseUrl}/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Pizza Dough', currentStock: 10, reorderLevel: 2, unit: 'pieces' })
        });
        const dough = await doughRes.json();
        console.log('Created Dough:', dough.name, '- Stock:', dough.currentStock);

        console.log('\n--- 2. Create Menu Item (Margherita Pizza) ---');
        const pizzaRes = await fetch(`${baseUrl}/menu`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Margherita Pizza',
                price: 15.00,
                category: 'Mains',
                ingredients: [
                    { inventoryItem: tomato._id, quantityRequired: 0.5 }, // 0.5 kg tomato per pizza
                    { inventoryItem: dough._id, quantityRequired: 1 }     // 1 piece dough per pizza
                ]
            })
        });
        const pizza = await pizzaRes.json();
        console.log('Created Menu Item:', pizza.name, '- Price: $', pizza.price);

        console.log('\n--- 3. Create a Table && Reservation ---');
        const tableRes = await fetch(`${baseUrl}/tables`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ number: 1, capacity: 4 })
        });
        const table = await tableRes.json();
        console.log('Created Table:', table.number, '- Status:', table.status);

        const reservationRes = await fetch(`${baseUrl}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: 'John Doe',
                customerPhone: '1234567890',
                tableId: table._id,
                reservationTime: new Date().toISOString(),
                partySize: 2
            })
        });
        const reservationData = await reservationRes.json();
        console.log('Created Reservation for:', reservationData.reservation.customerName);
        console.log('New Table Status:', reservationData.table.status);

        console.log('\n--- 4. Place an Order ---');
        console.log(`Ordering 3 ${pizza.name}...`);
        const orderRes = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tableId: table._id,
                items: [{ menuItemId: pizza._id, quantity: 3 }]
            })
        });
        const order = await orderRes.json();
        console.log('Order Placed! Total Amount: $', order.totalAmount);

        console.log('\n--- 5. Verify Inventory Deductions ---');
        const invRes = await fetch(`${baseUrl}/inventory`);
        const inventory = await invRes.json();
        inventory.forEach(item => {
            console.log(`${item.name} New Stock: ${item.currentStock} (Reorder Level: ${item.reorderLevel})`);
        });

        console.log('\n--- 6. Check Reports ---');
        const salesRes = await fetch(`${baseUrl}/reports/sales`);
        const sales = await salesRes.json();
        console.log('Sales Report:', sales);

        const alertsRes = await fetch(`${baseUrl}/reports/alerts`);
        const alerts = await alertsRes.json();
        console.log('Alerts Report (Low Stock Items):', alerts.map(a => a.name));

        console.log('\n--- 7. Display Final Database Items ---');
        
        // Fetch and display all menu items
        const finalMenuRes = await fetch(`${baseUrl}/menu`);
        const finalMenu = await finalMenuRes.json();
        console.log('Final Menu Items:', JSON.stringify(finalMenu, null, 2));
        
        // Fetch and display all inventory items
        const finalInvRes = await fetch(`${baseUrl}/inventory`);
        const finalInv = await finalInvRes.json();
        console.log('Final Inventory Items:', JSON.stringify(finalInv, null, 2));

        // Fetch and display all orders
        const finalOrdersRes = await fetch(`${baseUrl}/orders`);
        const finalOrders = await finalOrdersRes.json();
        console.log('Final Orders:', JSON.stringify(finalOrders, null, 2));

    } catch (err) {
        console.error('Test Failed:', err);
    } finally {
        process.exit(0);
    }
}

runTests();
