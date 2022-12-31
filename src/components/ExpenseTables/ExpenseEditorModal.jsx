import { useState } from 'react'

import { doc, setDoc } from 'firebase/firestore'
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
import { NOTIFICATION_DURATION } from '../../config/constants'
import { ExpenseForm } from '../ExpenseForm/ExpenseForm'

export const ExpenseEditorModal = ({ modalControls, expense = {} }) => {
    const { isOpen, onClose } = modalControls
    const user = useUser()
    const toast = useToast()

    const [currentExpense, setCurrentExpense] = useState(expense)

    const handleSubmit = () => {
        // Submit the edit to firebase
        const { date, expenseName, category, split, recurring, amount, id } = currentExpense
        try {
            setDoc(doc(db, `users/${user.uid}/expenses/${id}`), {
                date,
                expenseName,
                category,
                split,
                recurring,
                amount,
            }).then(() => {
                toast({
                    title: 'Success',
                    description: 'Your transaction has been saved',
                    status: 'success',
                    duration: NOTIFICATION_DURATION,
                    isClosable: true,
                })
            })
        } catch (e) {
            toast({
                title: 'Error',
                description: 'There was an error editing your transaction, please try again later',
                status: 'error',
                duration: NOTIFICATION_DURATION,
                isClosable: true,
            })
            console.log('error', e)
        }

        // close the modal
        onClose()
    }

    const handleChange = newExpense => {
        setCurrentExpense(newExpense)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
            <ModalOverlay />
            <ModalContent maxW={'90%'}>
                <ModalHeader>Edit Expense</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <ExpenseForm expense={expense} handleChange={handleChange} />
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
