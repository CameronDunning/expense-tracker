import React, { useEffect } from 'react'

import { RouterProvider } from 'react-router-dom'
import { ChakraProvider, theme } from '@chakra-ui/react'

import { userSnapshotSubscriber } from './utils/firebaseSubscribers'
import { getWindowDimensions } from './utils/windowDimensions'
import { ROUTER } from './config/routing'
import { auth, db } from './config/firebase'
import { useUser, useSetUser } from './Stores/UserStore'
import { useSetExpenses } from './Stores/ExpensesStore'
import { useSetIncomes } from './Stores/IncomesStore'
import { useSetWindowDimensions } from './Stores/UtilsStore'
import { onSnapshot, doc } from 'firebase/firestore'

function App() {
    const user = useUser()
    const setUser = useSetUser()
    const setWindowDimensions = useSetWindowDimensions()
    const setExpenses = useSetExpenses()
    const setIncomes = useSetIncomes()

    const router = ROUTER

    useEffect(() => {
        const unsubscribe = userSnapshotSubscriber(auth, db, setUser, setExpenses, setIncomes)

        return () => {
            unsubscribe()
        }
    }, [setUser, setExpenses, setIncomes])

    // Get expenses and incomes
    useEffect(() => {
        if (!user) {
            setExpenses([])
            setIncomes([])
            return () => {}
        }

        const userRef = doc(db, 'users', user.uid)
        const unsubscribe = onSnapshot(userRef, doc => {
            const newExpenses = doc.data().expenses.sort((a, b) => {
                return new Date(b.date.toDate()) - new Date(a.date.toDate())
            })
            const newIncomes = doc.data().incomes.sort((a, b) => {
                return new Date(b.date.toDate()) - new Date(a.date.toDate())
            })

            setExpenses(newExpenses)
            setIncomes(newIncomes)
        })

        return () => {
            unsubscribe()
        }
    }, [user, setExpenses])

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
