import React, { useEffect } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { RouterProvider } from 'react-router-dom'
import { ChakraProvider, theme } from '@chakra-ui/react'

import { expensesSnapshotSubscriber, incomeSnapshotSubscriber } from './utils/firebaseSubscribers'
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
