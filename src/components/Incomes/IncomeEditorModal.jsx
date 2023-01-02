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
import { IncomeForm } from './IncomeForm'

export const IncomeEditorModal = ({ modalControls, income = {} }) => {
    const { isOpen, onClose } = modalControls
    const user = useUser()
    const toast = useToast()

    const [currentIncome, setCurrentIncome] = useState(income)

    const handleSubmit = () => {
        // Submit the edit to firebase
        const { date, incomeName, amount, id } = currentIncome
        try {
            setDoc(doc(db, `users/${user.uid}/incomes/${id}`), {
                date,
                incomeName,
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

    const handleChange = newIncome => {
        setCurrentIncome(newIncome)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
            <ModalOverlay />
            <ModalContent maxW={'90%'}>
                <ModalHeader>Edit Expense</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <IncomeForm income={income} handleChange={handleChange} />
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
