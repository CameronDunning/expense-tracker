import React, { useEffect } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChakraProvider, theme } from '@chakra-ui/react'

import { auth, db } from './config/firebase'
import { useSetUser } from './Stores/UserStore'

import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Profile } from './pages/Profile'

function App() {
    const setUser = useSetUser()

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                { path: '/', element: <Home /> },
                { path: 'login', element: <Login /> },
                { path: 'register', element: <Register /> },
                { path: 'profile', element: <Profile /> },
            ],
        },
    ])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            if (!currentUser) {
                setUser(null)
                return
            }

            // Get metadata and set user in store
            const userRef = doc(db, 'users', currentUser.uid)
            getDoc(userRef)
                .then(document => {
                    if (document.exists()) {
                        // Set user in store
                        setUser({
                            ...currentUser,
                            firstName: document.data().firstName,
                            lastName: document.data().lastName,
                        })
                    } else {
                        console.log('No such document!')
                    }
                })
                .catch(error => {
                    console.log('Error getting document:', error)
                })
        })

        return () => {
            unsubscribe()
        }
    }, [setUser])

    return (
        <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
        </ChakraProvider>
    )
}

export default App
