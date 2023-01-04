import { useCallback, useState } from 'react'

import { doc, updateDoc } from 'firebase/firestore'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    useToast,
} from '@chakra-ui/react'

import { db } from '../../config/firebase'
import { useUser } from '../../Stores/UserStore'
import { useExpenses } from '../../Stores/ExpensesStore'
import { NOTIFICATION_DURATION } from '../../config/constants'
import { ExpenseForm } from './ExpenseForm'

export const ExpenseEditorModal = ({ modalControls, expense = {} }) => {
    const { isOpen, onClose } = modalControls
    const toast = useToast()
    const user = useUser()
    const expenses = useExpenses()

    const [newExpense, setNewExpense] = useState(expense)

    const handleSubmit = () => {
        // remove the expense from the expenses array
        const { id } = newExpense
        const newExpenses = [...expenses]
        const index = newExpenses.findIndex(expense => expense.id === id)
        if (index >= 0) {
            newExpenses.splice(index, 1)
        }
        newExpenses.push(newExpense)

        // add the new expense to the expenses array
        try {
            const userRef = doc(db, `users/${user.uid}`)
            updateDoc(userRef, { expenses: newExpenses }).then(() => {
                toast({
                    title: 'Success',
                    description: 'Your expense has been added',
                    status: 'success',
                    duration: NOTIFICATION_DURATION,
                    isClosable: true,
                })
            })
        } catch (e) {
            toast({
                title: 'Error',
                description: 'There was an error adding your expense, please try again later',
                status: 'error',
                duration: NOTIFICATION_DURATION,
                isClosable: true,
            })
            console.log('error', e)
        }

        // close the modal
        onClose()
    }

    const handleChange = useCallback(newExpense => {
        setNewExpense(newExpense)
    }, [])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
            <ModalOverlay />
            <ModalContent maxW={'90%'}>
                <ModalHeader>Edit Expense</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <ExpenseForm expense={expense} handleChange={handleChange} editing={true} />
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
