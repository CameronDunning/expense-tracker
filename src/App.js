import React from 'react'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChakraProvider, Stack, theme } from '@chakra-ui/react'

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
            <Stack minH={'100vh'}>
                <NavBar />
                {showAlert && <UIAlert severity="warning" text="This is a warning" />}
                <RouterProvider router={router} />
            </Stack>
        </ChakraProvider>
    )
}

export default App
