export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  currency: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
  itemsCount: number;
  trackingNumber: string;
  estimatedDelivery: Date;
}

const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Olivia', 'James', 'Sophia'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentMethods: Order['paymentMethod'][] = ['credit_card', 'debit_card', 'paypal', 'bank_transfer'];
const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Spain', 'Italy', 'Australia', 'Japan', 'Brazil'];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
const streets = ['Main St', 'Oak Ave', 'Elm St', 'Market St', 'Park Ave', 'First St', 'Second St', 'Third St', 'Broadway', 'Washington St'];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateOrders(count: number): Order[] {
  const orders: Order[] = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date();

  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const orderDate = generateRandomDate(startDate, endDate);
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 14) + 3);

    const order: Order = {
      id: `order-${i + 1}`,
      orderNumber: `ORD-${String(i + 1).padStart(8, '0')}`,
      customerName: `${firstName} ${lastName}`,
      customerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      orderDate,
      status: randomElement(statuses),
      totalAmount: Math.round((Math.random() * 1000 + 10) * 100) / 100,
      currency: 'USD',
      shippingAddress: `${Math.floor(Math.random() * 9999) + 1} ${randomElement(streets)}`,
      shippingCity: randomElement(cities),
      shippingCountry: randomElement(countries),
      paymentMethod: randomElement(paymentMethods),
      itemsCount: Math.floor(Math.random() * 10) + 1,
      trackingNumber: `TRK${String(Math.floor(Math.random() * 1000000000)).padStart(10, '0')}`,
      estimatedDelivery,
    };

    orders.push(order);
  }

  return orders;
}