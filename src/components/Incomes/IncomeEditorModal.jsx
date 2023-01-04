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
import { useIncomes } from '../../Stores/IncomesStore'
import { NOTIFICATION_DURATION } from '../../config/constants'
import { IncomeForm } from './IncomeForm'

export const IncomeEditorModal = ({ modalControls, income = {} }) => {
    const { isOpen, onClose } = modalControls
    const toast = useToast()
    const user = useUser()
    const incomes = useIncomes()

    const [newIncome, setNewIncome] = useState(income)

    const handleSubmit = () => {
        // remove the income from the incomes array
        const { id } = newIncome
        const index = incomes.findIndex(income => income.id === id)
        const newIncomes = [...incomes]
        if (index >= 0) {
            newIncomes.splice(index, 1)
        }
        newIncomes.push(newIncome)

        // add the new income to the incomes array
        try {
            const userRef = doc(db, `users/${user.uid}`)
            updateDoc(userRef, { incomes: newIncomes }).then(() => {
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

    const handleChange = useCallback(newIncome => {
        setNewIncome(newIncome)
    }, [])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
            <ModalOverlay />
            <ModalContent maxW={'90%'}>
                <ModalHeader>Edit Income</ModalHeader>
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
