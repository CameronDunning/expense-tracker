import { collection, doc, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

export const userSnapshotSubscriber = (auth, db, setUser, setExpenses, setIncomes) => {
    return onAuthStateChanged(auth, currentUser => {
        if (!currentUser) {
            setUser(null)
            setExpenses([])
            setIncomes([])
            return () => {}
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
}

export const expensesSnapshotSubscriber = (db, user, setExpenses) => {
    if (!user) {
        setExpenses([])
        return () => {}
    }

    const q = query(collection(db, `/users/${user.uid}/expenses`), orderBy('date', 'desc'))
    return onSnapshot(q, querySnapshot => {
        if (querySnapshot.size === 0) return setExpenses([])

        let expensesArray = []
        querySnapshot.forEach(expense => {
            expensesArray.push({ ...expense.data(), id: expense.id })
        })

        setExpenses(expensesArray)
    })
}

export const incomeSnapshotSubscriber = (db, user, setIncomes) => {
    if (!user) {
        setIncomes([])
        return () => {}
    }

    const q = query(collection(db, `/users/${user.uid}/incomes`), orderBy('date', 'desc'))
    return onSnapshot(q, querySnapshot => {
        if (querySnapshot.size === 0) return setIncomes([])

        let incomesArray = []
        querySnapshot.forEach(income => {
            incomesArray.push({ ...income.data(), id: income.id })
        })

        setIncomes(incomesArray)
    })
}
