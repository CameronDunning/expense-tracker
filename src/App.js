import React, { useEffect } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { getDocs, query, where, collection } from 'firebase/firestore'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChakraProvider, theme } from '@chakra-ui/react'

import { auth, db } from './config/firebase'
import { useSetUser } from './Stores/UserStore'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

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
            const usersRef = collection(db, 'users')
            const q = query(usersRef, where('uid', '==', currentUser.uid))
            getDocs(q)
                .then(docs => {
                    docs.forEach(doc => {
                        const userWithMetaData = {
                            ...currentUser,
                            firstName: doc.data().firstName,
                            lastName: doc.data().lastName,
                        }
                        setUser(userWithMetaData)
                    })
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
