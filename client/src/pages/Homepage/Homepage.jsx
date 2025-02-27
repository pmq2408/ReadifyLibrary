import React from 'react'
import { Sidebars } from '../../components/Sidebars/Sidebars'
import { Header } from '../../components/Header/Header'
import { Link, Outlet } from 'react-router-dom'

export const Homepage = () => {
    return (
        <div>
            <Header />
            <div className='flex'>
                <div><Sidebars />
                </div>
                <div><Outlet /> </div>
            </div>
        </div>

    )
}
