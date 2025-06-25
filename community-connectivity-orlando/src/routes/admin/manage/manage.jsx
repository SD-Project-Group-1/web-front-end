import React, { useState } from 'react';
import './manage.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

function Manage() {
  const [devices] = useState([
    { serial: '92928383', type: 'Tablet', brand: 'Apple', model: 'iPad 3', location: '2323 Ale St', status: 'Available', condition: 'Good' },
    { serial: '85776125', type: 'Tablet', brand: 'Samsung', model: 'Tab S9', location: '110 Hero Rd', status: 'Checked out', condition: 'Dented back' },
    { serial: '12875167', type: 'Laptop', brand: 'Lenovo', model: 'y77', location: '20 Forsyth In', status: 'Scheduled', condition: 'Good' },
    { serial: '92928383', type: 'Tablet', brand: 'Apple', model: 'iPad 3', location: '2323 Ale St', status: 'Available', condition: 'Good' },
    { serial: '85776125', type: 'Tablet', brand: 'Samsung', model: 'Tab S9', location: '110 Hero Rd', status: 'Checked out', condition: 'Dented back' },
    { serial: '12875167', type: 'Laptop', brand: 'Lenovo', model: 'y77', location: '20 Forsyth In', status: 'Scheduled', condition: 'Good' },
    { serial: '92928383', type: 'Tablet', brand: 'Apple', model: 'iPad 3', location: '2323 Ale St', status: 'Available', condition: 'Good' },
    { serial: '85776125', type: 'Tablet', brand: 'Samsung', model: 'Tab S9', location: '110 Hero Rd', status: 'Checked out', condition: 'Dented back' },
    { serial: '12875167', type: 'Laptop', brand: 'Lenovo', model: 'y77', location: '20 Forsyth In', status: 'Scheduled', condition: 'Good' },
  ]);

  return (
    <div className="container-fluid p-4 text-white" style={{ backgroundColor: '#0d1b2a', minHeight: '100vh' }}>
      <nav className="nav mb-3">
  <a className="nav-link text-white" href="/">
    <i className="bi bi-house-fill me-2"></i>Home
  </a>
        <a className="nav-link text-white" href="/admin/requests">Requests</a>
        <a className="nav-link text-white" href="/admin/profiles">Profiles</a>
        <a className="nav-link text-info fw-bold" href="/admin/manage">Manage</a>
        <a className="nav-link text-white" href="/admin/data">Data</a>

  <div className="ms-auto">
    <i className="bi bi-person-circle fs-4 text-white"></i>
  </div>
</nav>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="manage-title">Device Management</h2>
        <button className="add-device-button">Add Device</button>
      </div>

      <div className="table-responsive">
      <table className="table-custom">
  <thead>
    <tr>
      <th>Serial #</th>
      <th>Type</th>
      <th>Brand</th>
      <th>Model</th>
      <th>Location</th>
      <th>Status</th>
      <th>Condition</th>
    </tr>
  </thead>
  <tbody>
    {devices.map((d, i) => (
      <tr key={i}>
        <td>{d.serial}</td>
        <td>{d.type}</td>
        <td>{d.brand}</td>
        <td>{d.model}</td>
        <td>{d.location}</td>
        <td>{d.status}</td>
        <td>{d.condition}</td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
    </div>
  );
}
export default Manage;
