import React, { useEffect } from 'react'

import { RouterProvider } from 'react-router-dom'
import { ChakraProvider, theme } from '@chakra-ui/react'

import {
    expensesSnapshotSubscriber,
    incomeSnapshotSubscriber,
    userSnapshotSubscriber,
} from './utils/firebaseSubscribers'
import { getWindowDimensions } from './utils/windowDimensions'
import { ROUTER } from './config/routing'
import { auth, db } from './config/firebase'
import { useUser, useSetUser } from './Stores/UserStore'
import { useSetExpenses } from './Stores/ExpensesStore'
import { useSetIncomes } from './Stores/IncomesStore'
import { useSetWindowDimensions } from './Stores/UtilsStore'

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

    // Get expenses
    useEffect(() => {
        const unsubscribe = expensesSnapshotSubscriber(db, user, setExpenses)

        return () => {
            unsubscribe()
        }
    }, [user, setExpenses])

    // Get incomes
    useEffect(() => {
        const unsubscribe = incomeSnapshotSubscriber(db, user, setIncomes)

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
