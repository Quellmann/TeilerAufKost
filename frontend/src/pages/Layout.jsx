import { useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/footer'
import { Outlet } from 'react-router-dom'
import { Toaster } from "react-hot-toast"

const Layout = () => {
    const refresh = useRef(null)
    return (
        <div className='h-screen flex flex-col'>
            <Header refresh={refresh}></Header>
            <Outlet context={refresh}></Outlet>
            <Toaster position="top-center"></Toaster>
            <Footer refresh={refresh}></Footer>
        </div>
    )
}

export default Layout