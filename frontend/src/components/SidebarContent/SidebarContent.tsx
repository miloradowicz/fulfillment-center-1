import { NavLink } from 'react-router-dom'
import {
  ArchiveRestore,
  BookUser,
  ClipboardList,
  FileText,
  ListTodo,
  Package,
  Truck,
  Users,
  Warehouse,
  Settings,
} from 'lucide-react'
import React from 'react'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'

interface Props {
  onLinkClick: () => void
}

const SidebarContent: React.FC<Props> = ({ onLinkClick }) => {
  return (
    <nav className="flex flex-col gap-1 mt-4 px-2">
      <ProtectedElement allowedRoles={['super-admin', 'admin']}>
        <NavLink
          to="/admin"
          onClick={onLinkClick}
          className={({ isActive }) =>
            `w-full flex items-center gap-2 p-2 rounded-md transition-colors
            ${ isActive ? 'bg-ring/50 text-primary' : 'text-primary hover:bg-primary hover:text-card' }`
          }
        >
          <Settings size={25} />
          <span>Админ-панель</span>
        </NavLink>
      </ProtectedElement>

      <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
        <NavLink
          to="/clients"
          onClick={onLinkClick}
          className={({ isActive }) =>
            `w-full flex items-center gap-2 p-2 rounded-md transition-colors
            ${ isActive ? 'bg-ring/50 text-primary' : 'text-primary hover:bg-primary hover:text-card' }`
          }
        >
          <Users size={25} />
          <span>Клиенты</span>
        </NavLink>
      </ProtectedElement>

      <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
        <NavLink
          to="/products"
          onClick={onLinkClick}
          className={({ isActive }) =>
            `w-full flex items-center gap-2 p-2 rounded-md transition-colors
            ${ isActive ? 'bg-ring/50 text-primary' : 'text-primary hover:bg-primary hover:text-card' }`
          }
        >
          <Package size={25} />
          <span>Товары</span>
        </NavLink>
      </ProtectedElement>

      <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager', 'stock-worker']}>
        <NavLink
          to="/arrivals"
          onClick={onLinkClick}
          className={({ isActive }) =>
            `w-full flex items-center gap-2 p-2 rounded-md transition-colors
            ${ isActive ? 'bg-ring/50 text-primary' : 'text-primary hover:bg-primary hover:text-card' }`
          }
        >
          <Truck size={25} />
          <span>Поставки</span>
        </NavLink>
      </ProtectedElement>

      <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager', 'stock-worker']}>
        <NavLink
          to="/orders"
          onClick={onLinkClick}
          className={({ isActive }) =>
            `w-full flex items-center gap-2 p-2 rounded-md transition-colors
            ${ isActive ? 'bg-ring/50 text-primary' : 'text-primary hover:bg-primary hover:text-card' }`
          }
        >
          <ClipboardList size={25} />
          <span>Заказы</span>
        </NavLink>
      </ProtectedElement>

      <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager', 'stock-worker']}>
        <NavLink
          to="/tasks"
          onClick={onLinkClick}
          className={({ isActive }) =>
            `w-full flex items-center gap-2 p-2 rounded-md transition-colors
            ${ isActive ? 'bg-ring/50 text-primary' : 'text-primary hover:bg-primary hover:text-card' }`
          }
        >
          <ListTodo size={25} />
          <span>Задачи</span>
        </NavLink>
      </ProtectedElement>

      <ProtectedElement allowedRoles={['super-admin', 'admin']}>
        <NavLink
          to="/reports"
          onClick={onLinkClick}
          className={({ isActive }) =>
            `w-full flex items-center gap-2 p-2 rounded-md transition-colors
            ${ isActive ? 'bg-ring/50 text-primary' : 'text-primary hover:bg-primary hover:text-card' }`
          }
        >
          <FileText size={25} />
          <span>Отчеты</span>
        </NavLink>
      </ProtectedElement>

      <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
        <NavLink
          to="/stocks"
          onClick={onLinkClick}
          className={({ isActive }) =>
            `w-full flex items-center gap-2 p-2 rounded-md transition-colors
            ${ isActive ? 'bg-ring/50 text-primary' : 'text-primary hover:bg-primary hover:text-card' }`
          }
        >
          <Warehouse size={25} />
          <span>Склады</span>
        </NavLink>
      </ProtectedElement>

      <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
        <NavLink
          to="/counterparties"
          onClick={onLinkClick}
          className={({ isActive }) =>
            `w-full flex items-center gap-2 p-2 rounded-md transition-colors
            ${ isActive ? 'bg-ring/50 text-primary' : 'text-primary hover:bg-primary hover:text-card' }`
          }
        >
          <BookUser size={25} />
          <span>Контрагенты</span>
        </NavLink>
      </ProtectedElement>

      <ProtectedElement allowedRoles={['super-admin', 'admin']}>
        <NavLink
          to="/archives"
          onClick={onLinkClick}
          className={({ isActive }) =>
            `w-full flex items-center gap-2 p-2 rounded-md transition-colors
            ${ isActive ? 'bg-ring/50 text-primary' : 'text-primary hover:bg-primary hover:text-card' }`
          }
        >
          <ArchiveRestore size={25} />
          <span>Архив</span>
        </NavLink>
      </ProtectedElement>
    </nav>
  )
}

export default SidebarContent
