// "use client";

import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
// import { AuthProvider } from '@/hooks/useAuth';

const Layout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    )
}

export default Layout;