import { useRef } from 'react'

import { doc, updateDoc } from 'firebase/firestore'
import {
    Container,
    VStack,
    StackDivider,
    Box,
    Heading,
    Text,
    Input,
    IconButton,
    Icon,
    useToast,
    Button,
    useDisclosure,
} from '@chakra-ui/react'
import { FaFileUpload } from 'react-icons/fa'

import { parseFileExpenses, parseFileIncome } from '../utils/fileParsing'
import { db } from '../config/firebase'
import { NOTIFICATION_DURATION } from '../config/constants'
import { useUser } from '../Stores/UserStore'
import { useExpenses } from '../Stores/ExpensesStore'
import { useIncomes } from '../Stores/IncomesStore'
import { ExpenseForm } from '../components/Expenses/ExpenseForm'
import { NotLoggedIn } from '../components/Layout/NotLoggedIn'
import { IncomeForm } from '../components/Incomes/IncomeForm'
import { DuplicateRecurringExpenseModal } from '../components/Expenses/DuplicateRecurringExpenseModal'

export const DataEntry = () => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const hiddenFileInputIncome = useRef(null)
    const hiddenFileInputExpense = useRef(null)

    const user = useUser()
    const expenses = useExpenses()
    const incomes = useIncomes()

    const handleFile = (file, type) => {
        if (type === 'expenses') {
            readFileExpenses(file)
        } else if (type === 'incomes') {
            readFileIncomes(file)
        }
    }

    const handleClickExpense = () => {
        hiddenFileInputExpense.current.click()
    }

    const handleClickIncome = () => {
        hiddenFileInputIncome.current.click()
    }

    const handleChangeExpense = event => {
        const fileUploaded = event.target.files[0]
        handleFile(fileUploaded, 'expenses')
    }

    const handleChangeIncome = event => {
        const fileUploaded = event.target.files[0]
        handleFile(fileUploaded, 'incomes')
    }

    const readFileExpenses = file => {
        const reader = new FileReader()
        reader.onload = () => {
            const expensesArray = parseFileExpenses(reader)
            try {
                const userRef = doc(db, `users/${user.uid}`)

                updateDoc(userRef, { expenses: [...expenses, ...expensesArray] }).then(() => {
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
        }

        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(file)
    }

    const readFileIncomes = file => {
        const reader = new FileReader()
        reader.onload = () => {
            const incomesArray = parseFileIncome(reader)
            try {
                const userRef = doc(db, `users/${user.uid}`)

                updateDoc(userRef, { incomes: [...incomes, ...incomesArray] }).then(() => {
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
        }

        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(file)
    }

    const duplicateRecurringExpenses = expensesFromForm => {
        if (expensesFromForm.length === 0) {
            toast({
                title: 'Error',
                description: 'You have no recurring expenses for that month, please select a different month.',
                status: 'error',
                duration: NOTIFICATION_DURATION,
                isClosable: true,
            })

            return
        }

        try {
            const newExpenses = expensesFromForm.map(expense => {
                const today = new Date()
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
                const dayNumber =
                    expense.date.toDate().getDate() > endOfMonth.getDate()
                        ? endOfMonth.getDate()
                        : expense.date.toDate().getDate()
                const dateButThisMonth = new Date(today.getFullYear(), today.getMonth(), dayNumber)

                return { ...expense, date: dateButThisMonth }
            })

            const userRef = doc(db, `users/${user.uid}`)
            updateDoc(userRef, { expenses: [...expenses, ...newExpenses] }).then(() => {
                toast({
                    title: 'Success',
                    description: 'Your expense has been added',
                    status: 'success',
                    duration: NOTIFICATION_DURATION,
                    isClosable: true,
                })
            })
        } catch (error) {
            console.log('error', error)
        }

        onClose()
    }

    if (!user) return <NotLoggedIn />

    return (
        <main>
            <Container maxW="8xl">
                <VStack divider={<StackDivider borderColor="gray.400" />} spacing={4} alignItems={'flex-start'}>
                    <Box>
                        <Heading mb={2}>Expenses Form</Heading>
                        <ExpenseForm />
                    </Box>
                    <Box>
                        <Heading mb={2}>Expenses Bulk Upload</Heading>
                        <Text color={'gray.500'}>
                            Upload a CSV file with the following columns in this order: date, name, category (see
                            categories above), split (1 or 0), recurring (1 or 0), amount. Max 500 rows
                        </Text>
                        <IconButton
                            aria-label="Download CSV Template"
                            rounded={'full'}
                            bg={'green'}
                            w={100}
                            h={100}
                            m={3}
                            icon={<Icon as={FaFileUpload} w={12} h={12} />}
                            onClick={e => handleClickExpense(e)}
                        />
                        <Input
                            type="file"
                            ref={hiddenFileInputExpense}
                            onChange={handleChangeExpense}
                            style={{ display: 'none' }}
                            accept={'.csv'}
                        />
                    </Box>
                    <Box>
                        <Heading mb={2}>Duplicate Recurring Expenses</Heading>
                        <Text color={'gray.500'}>
                            Duplicate all recurring expenses for this month. This will create a new expense for each
                            recurring expense with the date set to the same date in this month.
                        </Text>
                        <Button mt={2} bg={'green'} onClick={onOpen}>
                            Duplicate
                        </Button>
                    </Box>
                    <Box>
                        <Heading mb={2}>Incomes Form</Heading>
                        <IncomeForm />
                    </Box>
                    <Box>
                        <Heading mb={2}>Incomes Bulk Upload</Heading>
                        <Text color={'gray.500'}>
                            Upload a CSV file with the following columns in this order: date, name, amount. Max 500 rows
                        </Text>
                        <IconButton
                            aria-label="Download CSV Template"
                            rounded={'full'}
                            bg={'green'}
                            w={100}
                            h={100}
                            m={3}
                            icon={<Icon as={FaFileUpload} w={12} h={12} />}
                            onClick={e => handleClickIncome(e)}
                        />
                        <Input
                            type="file"
                            ref={hiddenFileInputIncome}
                            onChange={handleChangeIncome}
                            style={{ display: 'none' }}
                            accept={'.csv'}
                        />
                    </Box>
                </VStack>
            </Container>
            <DuplicateRecurringExpenseModal
                isOpen={isOpen}
                onClose={onClose}
                duplicateRecurringExpenses={duplicateRecurringExpenses}
                expenses={expenses}
            />
        </main>
    )
}
