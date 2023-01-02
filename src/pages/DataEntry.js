import { useRef } from 'react'

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
} from '@chakra-ui/react'
import { FaFileUpload } from 'react-icons/fa'

import { useUser } from '../Stores/UserStore'
import { ExpenseForm } from '../components/Expenses/ExpenseForm'
import { NotLoggedIn } from '../components/Layout/NotLoggedIn'
import { IncomeForm } from '../components/Incomes/IncomeForm'
import { writeBatch, collection, doc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { NOTIFICATION_DURATION } from '../config/constants'

const expenseTemplate = ['date', 'expenseName', 'category', 'split', 'recurring', 'amount']
const incomeTemplate = ['date', 'incomeName', 'amount']

export const DataEntry = () => {
    const toast = useToast()

    const user = useUser()
    const hiddenFileInputExpense = useRef(null)
    const hiddenFileInputIncome = useRef(null)

    if (!user) {
        return <NotLoggedIn />
    }

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

            const batch = writeBatch(db)

            try {
                expensesArray.forEach(expense => {
                    const { date, expenseName, category, split, recurring, amount } = expense
                    const docRef = doc(collection(db, `users/${user.uid}/expenses/`))
                    batch.set(docRef, {
                        date,
                        expenseName,
                        category,
                        split,
                        recurring,
                        amount,
                    })
                })

                batch.commit().then(() => {
                    toast({
                        title: 'Success',
                        description: 'Your transactions have been added',
                        status: 'success',
                        duration: NOTIFICATION_DURATION,
                        isClosable: true,
                    })
                })
            } catch (error) {
                console.log('error', error)
            }
        }

        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(file)
    }

    const readFileIncomes = file => {
        const reader = new FileReader()
        reader.onload = () => {
            const incomesArray = parseFileIncome(reader)

            const batch = writeBatch(db)

            try {
                incomesArray.forEach(income => {
                    const { date, incomeName, amount } = income
                    const docRef = doc(collection(db, `users/${user.uid}/incomes/`))
                    batch.set(docRef, {
                        date,
                        incomeName,
                        amount,
                    })
                })

                batch.commit().then(() => {
                    toast({
                        title: 'Success',
                        description: 'Your transactions have been added',
                        status: 'success',
                        duration: NOTIFICATION_DURATION,
                        isClosable: true,
                    })
                })
            } catch (error) {
                console.log('error', error)
            }
        }

        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(file)
    }

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
                    <Box alignItems={'left'}>
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
        </main>
    )
}

// utils
const parseFileExpenses = reader => {
    const rows = reader.result.split('\r\n')

    let expensesArray = []
    rows.forEach(row => {
        const array = row.split(',')

        let expenseObject = {}
        expenseTemplate.forEach((key, index) => {
            if (key === 'split' || key === 'recurring') {
                expenseObject[key] = array[index] === '1' ? true : false
            } else if (key === 'amount') {
                expenseObject[key] = parseFloat(array[index])
            } else if (key === 'date') {
                expenseObject[key] = new Date(array[index])
            } else {
                expenseObject[key] = array[index]
            }
        })

        expensesArray.push(expenseObject)
    })

    return expensesArray
}

const parseFileIncome = reader => {
    const rows = reader.result.split('\r\n')

    let incomesArray = []
    rows.forEach(row => {
        const array = row.split(',')

        let incomeObject = {}
        incomeTemplate.forEach((key, index) => {
            if (key === 'amount') {
                incomeObject[key] = parseFloat(array[index])
            } else if (key === 'date') {
                incomeObject[key] = new Date(array[index])
            } else {
                incomeObject[key] = array[index]
            }
        })

        incomesArray.push(incomeObject)
    })

    return incomesArray
}
