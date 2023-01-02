import React, { useEffect } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChakraProvider, theme } from '@chakra-ui/react'

import { getWindowDimensions } from './utils/windowDimensions'
import { auth, db } from './config/firebase'
import { useUser, useSetUser } from './Stores/UserStore'
import { useSetExpenses } from './Stores/ExpensesStore'
import { useSetIncomes } from './Stores/IncomesStore'
import { useSetWindowDimensions } from './Stores/UtilsStore'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Profile } from './pages/Profile'
import { Expenses } from './pages/Expenses'
import { Incomes } from './pages/Incomes'
import { Summary } from './pages/Summary'
import { Monthly } from './pages/Monthly'
import { DataEntry } from './pages/DataEntry'
import { NotFound } from './pages/404'

function App() {
    const user = useUser()
    const setUser = useSetUser()
    const setWindowDimensions = useSetWindowDimensions()
    const setExpenses = useSetExpenses()
    const setIncomes = useSetIncomes()

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
                { path: 'incomes', element: <Incomes /> },
                { path: 'summary', element: <Summary /> },
                { path: 'monthly', element: <Monthly /> },
                { path: 'data-entry', element: <DataEntry /> },
            ],
            errorElement: <NotFound />,
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
        if (!user) {
            setExpenses([])
            return
        }

        const q = query(collection(db, `/users/${user.uid}/expenses`), orderBy('date', 'desc'))
        const unsubscribe = onSnapshot(q, querySnapshot => {
            if (querySnapshot.size === 0) return setExpenses([])

            let expensesArray = []
            querySnapshot.forEach(expense => {
                expensesArray.push({ ...expense.data(), id: expense.id })
            })
            setExpenses(expensesArray)
        })

        return () => {
            unsubscribe()
        }
    }, [user, setExpenses])

    // Get incomes
    useEffect(() => {
        if (!user) {
            setIncomes([])
            return
        }

        const q = query(collection(db, `/users/${user.uid}/incomes`), orderBy('date', 'desc'))
        const unsubscribe = onSnapshot(q, querySnapshot => {
            if (querySnapshot.size === 0) return setIncomes([])

            let incomesArray = []
            querySnapshot.forEach(income => {
                incomesArray.push({ ...income.data(), id: income.id })
            })

            setIncomes(incomesArray)
        })

        return () => {
            unsubscribe()
        }
    }, [user, setIncomes])

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions())
        }
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    })

    return (
        <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
        </ChakraProvider>
    )
}

export default App
