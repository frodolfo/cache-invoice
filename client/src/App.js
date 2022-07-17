import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { NavBar } from './components/shared/';
import { Invoices } from './components/pages';

import './App.scss';

export default function App() {
  return (
    <Router>
      <div className="w-screen">
        <NavBar />

        <Routes>
          <Route path="/" element={<Invoices />} />
          <Route path="/users" element={<Users />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
