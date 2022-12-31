import { useEffect, useState } from 'react'

import { addDoc, collection } from 'firebase/firestore'
import {
    Box,
    Card,
    CardBody,
    FormControl,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    IconButton,
    useToast,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'

import { db } from '../../config/firebase'
import { NOTIFICATION_DURATION } from '../../config/constants'
import { useUser } from '../../Stores/UserStore'

export const IncomeForm = ({ income = {}, handleChange = () => {} }) => {
    const toast = useToast()

    const user = useUser()

    const editing = !!income?.incomeName
    const [date, setDate] = useState(editing ? income.date.toDate() : new Date())
    const [amount, setAmount] = useState(editing ? income.amount : '')
    const [incomeName, setIncomeName] = useState(editing ? income.incomeName : '')

    useEffect(() => {
        if (!editing) {
            return
        }

        handleChange({
            id: income.id,
            date,
            incomeName,
            amount,
        })
    }, [date, incomeName, amount, editing, handleChange, income.id])

    const clearFields = () => {
        setDate(new Date())
        setIncomeName('')
        setAmount('')
    }

    const validate = () => {
        return date && incomeName && amount
    }

    const handleSubmit = () => {
        if (!validate()) {
            toast({
                title: 'Error',
                description: 'One or more fields is missing',
                status: 'error',
                duration: NOTIFICATION_DURATION,
                isClosable: true,
            })
            return
        }

        try {
            addDoc(collection(db, `users/${user.uid}/incomes/`), {
                date,
                incomeName,
                amount,
            }).then(() => {
                toast({
                    title: 'Success',
                    description: 'Your income has been added',
                    status: 'success',
                    duration: NOTIFICATION_DURATION,
                    isClosable: true,
                })
                clearFields()
            })
        } catch (e) {
            toast({
                title: 'Error',
                description: 'There was an error adding your income, please try again later',
                status: 'error',
                duration: NOTIFICATION_DURATION,
                isClosable: true,
            })
            console.log('error', e)
        }
    }

    return (
        <>
            <Card>
                <CardBody>
                    <FormControl onSubmit={handleSubmit}>
                        <HStack gap={2}>
                            <Box minW={'125px'}>
                                <SingleDatepicker name="date" date={date} onDateChange={setDate} />
                            </Box>
                            <Input
                                type="text"
                                placeholder="Name"
                                value={incomeName}
                                onChange={e => setIncomeName(e.target.value)}
                            />
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" />
                                <Input
                                    placeholder="Amount"
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(parseFloat(e.target.value))}
                                />
                            </InputGroup>
                            {!editing && (
                                <IconButton
                                    type="submit"
                                    size={'md'}
                                    icon={<AddIcon />}
                                    aria-label={'Add Expense'}
                                    backgroundColor={'green.500'}
                                    _hover={{ backgroundColor: 'green.600' }}
                                    onClick={handleSubmit}
                                />
                            )}
                        </HStack>
                    </FormControl>
                </CardBody>
            </Card>
        </>
    )
}
