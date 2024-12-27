import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'

const AdminLayout = () => {
  return (
    <div>
        <AdminNavbar/>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default AdminLayout