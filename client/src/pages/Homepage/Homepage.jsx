import React from 'react'
import { Sidebars } from '../../components/Sidebars/Sidebars'
import { Header } from '../../components/Header/Header'
import { Link, Outlet } from 'react-router-dom'

export const Homepage = () => {
    return (
        <div>
            <Header />
            <div className='flex justify-center'>
                <Link to="../"><button className='bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Home</button></Link>
                <Link to="/booksearch"><button className='bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Danh sách sách</button></Link>
                <Link to="/borrowBook"><button className='bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Danh sách sách đã mượn</button></Link>
                <Link to="/fineBooks"><button className='ml-2 bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Tiền phạt</button></Link>
                

            </div>
            <div className='flex'>
                <div><Sidebars />
                </div>
                <div><Outlet /> </div>
            </div>
        </div>

    )
}
