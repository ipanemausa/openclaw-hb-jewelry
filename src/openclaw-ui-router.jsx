// OPENCLAW UI — ROUTER ÚNICO HB JEWELRY
// Guillermo — 2026

import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Outlet, useNavigate } from 'react-router-dom';

// ====== LAYOUT GENERAL ======
function Layout() {
  return (
    <div className="app-container flex">
      <Sidebar />
      <main className="main-content flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}

// ====== SIDEBAR COMPLETO ======
function Sidebar() {
  return (
    <aside className="sidebar w-64 bg-black text-gray-200 p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-yellow-400">HB Jewelry</h2>
        <p className="text-xs text-green-400">Sistema operativo</p>
      </div>

      <div className="mb-4 text-xs text-gray-400">PRINCIPAL</div>
      <nav className="flex flex-col gap-1 mb-4">
        <NavItem to="/dashboard" label="Dashboard" />
        <NavItem to="/chat-agentes" label="Chat Agentes" />
        <NavItem to="/workspace" label="Workspace" />
        <NavItem to="/monitor" label="Monitor" />
      </nav>

      <div className="mb-4 text-xs text-gray-400">OPERACIONES</div>
      <nav className="flex flex-col gap-1 mb-4">
        <NavItem to="/ventas" label="Ventas" />
        <NavItem to="/productos" label="Productos" />
        <NavItem to="/inventario" label="Inventario" />
        <NavItem to="/clientes" label="Clientes" />
        <NavItem to="/ordenes" label="Órdenes" />
      </nav>

      <div className="mb-4 text-xs text-gray-400">MARKETING & ANALYTICS</div>
      <nav className="flex flex-col gap-1 mb-4">
        <NavItem to="/marketing" label="Marketing" />
        <NavItem to="/analytics" label="Analytics" />
        <NavItem to="/reportes" label="Reportes" />
      </nav>

      <div className="mb-4 text-xs text-gray-400">SISTEMA</div>
      <nav className="flex flex-col gap-1">
        <NavItem to="/pipeline" label="Pipeline" />
        <NavItem to="/historial" label="Historial" />
        <NavItem to="/chat-historial" label="Chat Historial" />
        <NavItem to="/auditoria" label="Auditoría" />
      </nav>
    </aside>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded text-sm ${
          isActive ? 'bg-yellow-500 text-black' : 'hover:bg-gray-800'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

// ====== DASHBOARD (LAMAUTONOMIA) ======
function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-yellow-400">LAMAUTONOMIA — HB Jewelry</h1>

      {/* Contenedores */}
      <section className="bg-gray-900 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Contenedores</h2>
        <p className="text-sm text-gray-400">Integración con OpenClaw Gateway</p>
      </section>

      {/* Gateway */}
      <section className="bg-gray-900 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">HB Jewelry — Gateway</h2>
        <p className="text-sm text-green-400">Estado: activo</p>
      </section>

      {/* DAG Tareas */}
      <section className="bg-gray-900 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">DAG — Tareas</h2>
        <p className="text-sm text-green-400">Todas las tareas completadas</p>
      </section>

      {/* Actividad reciente */}
      <section className="bg-gray-900 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Actividad reciente</h2>
        <p className="text-sm text-gray-400">No hay actividad reciente.</p>
      </section>

      {/* Acciones rápidas */}
      <section className="bg-gray-900 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Acciones rápidas</h2>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-yellow-500 text-black rounded text-sm"
            onClick={() => navigate('/productos')}
          >
            Agregar producto
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-black rounded text-sm"
            onClick={() => navigate('/ordenes')}
          >
            Ver pedidos
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-black rounded text-sm"
            onClick={() => navigate('/reportes')}
          >
            Reportes
          </button>
        </div>
      </section>
    </div>
  );
}

// ====== PÁGINAS BÁSICAS ======
const SimplePage = ({ title, description }) => (
  <div className="space-y-2">
    <h1 className="text-2xl font-bold text-yellow-400">{title}</h1>
    <p className="text-sm text-gray-300">{description}</p>
  </div>
);

const ChatAgentes = () => (
  <SimplePage title="Chat Agentes" description="Interfaz de agentes multimodel." />
);
const Workspace = () => (
  <SimplePage title="Workspace" description="Espacio de trabajo." />
);
const Monitor = () => (
  <SimplePage title="Monitor" description="Monitoreo del sistema." />
);
const Ventas = () => (
  <SimplePage title="Ventas" description="Panel de ventas." />
);
const Productos = () => (
  <SimplePage title="Productos" description="Gestión de productos." />
);
const Inventario = () => (
  <SimplePage title="Inventario" description="Control de inventario." />
);
const Clientes = () => (
  <SimplePage title="Clientes" description="Gestión de clientes." />
);
const Ordenes = () => (
  <SimplePage title="Órdenes" description="Listado de órdenes." />
);
const Marketing = () => (
  <SimplePage title="Marketing" description="Herramientas de marketing." />
);
const Analytics = () => (
  <SimplePage title="Analytics" description="Analíticas de ventas." />
);
const Reportes = () => (
  <SimplePage title="Reportes" description="Reportes ejecutivos." />
);
const Pipeline = () => (
  <SimplePage title="Pipeline CI/CD" description="Estado del pipeline." />
);
const Historial = () => (
  <SimplePage title="Historial" description="Historial del sistema." />
);
const ChatHistorial = () => (
  <SimplePage title="Chat Historial" description="Historial de chats." />
);
const Auditoria = () => (
  <SimplePage title="Auditoría" description="Registro de auditoría." />
);

// ====== APP CON ROUTER ======
export default function OpenclawUIRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat-agentes" element={<ChatAgentes />} />
          <Route path="workspace" element={<Workspace />} />
          <Route path="monitor" element={<Monitor />} />

          <Route path="ventas" element={<Ventas />} />
          <Route path="productos" element={<Productos />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="ordenes" element={<Ordenes />} />

          <Route path="marketing" element={<Marketing />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reportes" element={<Reportes />} />

          <Route path="pipeline" element={<Pipeline />} />
          <Route path="historial" element={<Historial />} />
          <Route path="chat-historial" element={<ChatHistorial />} />
          <Route path="auditoria" element={<Auditoria />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
