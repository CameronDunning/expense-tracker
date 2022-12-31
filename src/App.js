import React, { useEffect } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChakraProvider, theme } from '@chakra-ui/react'

import { auth, db } from './config/firebase'
import { useUser, useSetUser } from './Stores/UserStore'
import { useSetExpenses } from './Stores/ExpensesStore'

import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Profile } from './pages/Profile'
import { Expenses } from './pages/Expenses'

function App() {
    const user = useUser()
    const setUser = useSetUser()
    const setExpenses = useSetExpenses()

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                { path: '/', element: <Home /> },
                { path: 'login', element: <Login /> },
                { path: 'register', element: <Register /> },
                { path: 'profile', element: <Profile /> },
                { path: 'expenses', element: <Expenses /> },
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

    // Get expenses
    useEffect(() => {
        if (!user) return

        const unsubscribe = onSnapshot(collection(db, `/users/${user.uid}/expenses`), querySnapshot => {
            if (querySnapshot.size === 0) return setExpenses([])

            let expensesArray = []
            querySnapshot.forEach(expense => {
                expensesArray.push({ ...expense.data(), id: expense.id })
            })
            expensesArray.sort((a, b) => b.date - a.date)
            setExpenses(expensesArray)
        })

        return () => {
            unsubscribe()
        }
    }, [user, setExpenses])

    // TODO: Get incomes

    return (
        <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
        </ChakraProvider>
    )
}

export default App
