import { collection, doc, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore'

export const userSnapshotSubscriber = (db, currentUser, setUser) => {
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
}

export const expensesSnapshotSubscriber = (db, user, setExpenses) => {
    if (!user) {
        setExpenses([])
        return () => {}
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

    return unsubscribe
}

export const incomeSnapshotSubscriber = (db, user, setIncomes) => {
    if (!user) {
        setIncomes([])
        return () => {}
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

    return unsubscribe
}
