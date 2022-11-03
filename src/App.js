import React from 'react'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChakraProvider, Box, Text, Link, VStack, Code, Grid, theme } from '@chakra-ui/react'

import { ColorModeSwitcher } from './components/ColourModeSwitcher/ColourModeSwitcher'
import { Logo } from './Logo'
import { NavBar } from './components/NavBar/NavBar'
import { UIAlert } from './components/UIAlert/UIAlert'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

function App() {
    // const [showAlert, setShowAlert] = useState(false)
    const showAlert = false

    const router = createBrowserRouter([
        { path: '/', element: <Home /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> }, // TODO: Create register page
    ])

    return (
        <ChakraProvider theme={theme}>
            <NavBar />
            {showAlert && <UIAlert severity="warning" text="This is a warning" />}
            <RouterProvider router={router} />
        </ChakraProvider>
    )
}

export default App
