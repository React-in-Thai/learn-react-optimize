import { useState, useMemo, useDeferredValue, memo } from "react";
import "./App.css";
import { generateOrders, type Order } from "./generateOrderData";

interface OrderTableProps {
  orders: Order[];
}

const OrderTable = memo(function OrderTable({ orders }: OrderTableProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toFixed(2)}`;
  };
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Items</th>
            <th>Payment</th>
            <th>Address</th>
            <th>City</th>
            <th>Country</th>
            <th>Tracking</th>
            <th>Est. Delivery</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr key={order.id}>
              <td>{order.orderNumber}</td>
              <td>{order.customerName}</td>
              <td>{order.customerEmail}</td>
              <td>{formatDate(order.orderDate)}</td>
              <td className={`status status-${order.status}`}>
                {order.status}
              </td>
              <td>{formatCurrency(order.totalAmount, order.currency)}</td>
              <td>{order.itemsCount}</td>
              <td>{order.paymentMethod.replace("_", " ")}</td>
              <td>{order.shippingAddress}</td>
              <td>{order.shippingCity}</td>
              <td>{order.shippingCountry}</td>
              <td>{order.trackingNumber}</td>
              <td>{formatDate(order.estimatedDelivery)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [activeStatuses, setActiveStatuses] = useState<Set<Order["status"]>>(
    new Set(["pending", "processing", "shipped", "delivered", "cancelled"])
  );

  // orders could come from a server, in this example it does not matter.
  const orders = useMemo(() => generateOrders(5000), []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        deferredSearchTerm === "" ||
        order.orderNumber
          .toLowerCase()
          .includes(deferredSearchTerm.toLowerCase()) ||
        order.customerName
          .toLowerCase()
          .includes(deferredSearchTerm.toLowerCase()) ||
        order.customerEmail
          .toLowerCase()
          .includes(deferredSearchTerm.toLowerCase()) ||
        order.trackingNumber
          .toLowerCase()
          .includes(deferredSearchTerm.toLowerCase());

      const matchesStatus = activeStatuses.has(order.status);

      return matchesSearch && matchesStatus;
    });
  }, [orders, deferredSearchTerm, activeStatuses]);

  const toggleStatus = (status: Order["status"]) => {
    setActiveStatuses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
      }
      return newSet;
    });
  };

  const statuses: Order["status"][] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="app">
      <h1>React Massive Rows Demo</h1>
      <div className="controls">
        <div className="search-container">
          <input
            autoComplete="off"
            type="text"
            placeholder="Search by order #, customer name, email, or tracking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="status-filters">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`status-toggle ${
                activeStatuses.has(status) ? `active status-${status}` : ""
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <p className="results-count">
          Showing {filteredOrders.length.toLocaleString()} of{" "}
          {orders.length.toLocaleString()} orders
        </p>
      </div>

      <OrderTable orders={filteredOrders} />
    </div>
  );
}

export default App;
