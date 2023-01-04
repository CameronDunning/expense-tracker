import { doc, getDoc } from 'firebase/firestore'
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
