import { useEffect, useState } from 'react'

import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import {
    Box,
    Card,
    CardBody,
    FormControl,
    HStack,
    Input,
    Select,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    IconButton,
    SimpleGrid,
    useToast,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { FaRedoAlt } from 'react-icons/fa'
import { TbArrowsSplit } from 'react-icons/tb'

import { db } from '../../config/firebase'
import { useUser } from '../../Stores/UserStore'

import { NOTIFICATION_DURATION, CATEGORIES } from '../../config/constants'

export const NewExpense = () => {
    const toast = useToast()

    const user = useUser()

    const [date, setDate] = useState(new Date())
    const [expenseName, setExpenseName] = useState('')
    const [category, setCategory] = useState('')
    const [split, setSplit] = useState(false)
    const [recurring, setRecurring] = useState(false)
    const [amount, setAmount] = useState(0)
    const [halvedAmount, setHalvedAmount] = useState('($0.00)')

    useEffect(() => {
        if (!amount) {
            setHalvedAmount('($0.00)')
            return
        }

        if (split) {
            setHalvedAmount(`($${(amount / 2).toFixed(2)})`)
        } else {
            setHalvedAmount(`($${amount.toFixed(2)})`)
        }
    }, [split, amount])

    const handleSplit = () => {
        setSplit(!split)
    }

    const handleRecurring = () => {
        setRecurring(!recurring)
    }

    const clearFields = () => {
        setDate(new Date())
        setExpenseName('')
        setCategory('')
        setSplit(false)
        setRecurring(false)
        setAmount(0)
    }

    const validate = () => {
        return date && expenseName && category && amount
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
            addDoc(collection(db, `users/${user.uid}/expenses/`), {
                date,
                expenseName,
                category,
                split,
                recurring,
                amount,
            }).then(() => {
                toast({
                    title: 'Success',
                    description: 'Your transaction has been added',
                    status: 'success',
                    duration: NOTIFICATION_DURATION,
                    isClosable: true,
                })
                clearFields()
            })
        } catch (e) {
            toast({
                title: 'Error',
                description: 'There was an error adding your transaction, please try again later',
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
                        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
                            <HStack gap={2}>
                                <Box minW={'125px'}>
                                    <SingleDatepicker name="date" date={date} onDateChange={setDate} />
                                </Box>
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    value={expenseName}
                                    onChange={e => setExpenseName(e.target.value)}
                                />
                                <Select
                                    placeholder="Category"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}>
                                    {CATEGORIES.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Select>
                            </HStack>
                            <HStack gap={2}>
                                <IconButton
                                    size={'md'}
                                    icon={<TbArrowsSplit />}
                                    aria-label={'Split Expense'}
                                    onClick={handleSplit}
                                    backgroundColor={split ? 'green.500' : 'gray.400'}
                                    _hover={{ backgroundColor: split ? 'green.600' : 'gray.300' }}
                                />
                                <IconButton
                                    size={'md'}
                                    icon={<FaRedoAlt />}
                                    aria-label={'Split Expense'}
                                    onClick={handleRecurring}
                                    backgroundColor={recurring ? 'green.500' : 'gray.400'}
                                    _hover={{ backgroundColor: recurring ? 'green.600' : 'gray.300' }}
                                />
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        color="gray.300"
                                        fontSize="1.2em"
                                        children="$"
                                    />
                                    <Input
                                        placeholder="Amount"
                                        type="number"
                                        value={amount}
                                        onChange={e => setAmount(parseInt(e.target.value))}
                                    />
                                    <InputRightElement children={halvedAmount} pr={12} />
                                </InputGroup>
                                <IconButton
                                    type="submit"
                                    size={'md'}
                                    icon={<AddIcon />}
                                    aria-label={'Add Expense'}
                                    backgroundColor={'green.500'}
                                    _hover={{ backgroundColor: 'green.600' }}
                                    onClick={handleSubmit}
                                />
                            </HStack>
                        </SimpleGrid>
                    </FormControl>
                </CardBody>
            </Card>
        </>
    )
}

const styles = {
    datePicker: {
        maxWidth: '500px',
    },
}
