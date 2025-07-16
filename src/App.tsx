import { useState, useMemo } from "react";
import "./App.css";
import { generateOrders, type Order } from "./generateOrderData";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatuses, setActiveStatuses] = useState<Set<Order["status"]>>(
    new Set(["pending", "processing", "shipped", "delivered", "cancelled"])
  );

  const orders = useMemo(() => generateOrders(5000), []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm === "" ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = activeStatuses.has(order.status);

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, activeStatuses]);

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
            {filteredOrders.map((order: Order) => (
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
    </div>
  );
}

export default App;
