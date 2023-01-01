import { useState } from 'react'

import { HStack, Box, VStack } from '@chakra-ui/react'

import { CATEGORIES } from '../config/constants'
import { useExpenses } from '../Stores/ExpensesStore'
import { useIncomes } from '../Stores/IncomesStore'
import { useWindowDimensions } from '../Stores/UtilsStore'
import { SummaryTable } from '../components/Summaries/SummaryTable'
import { SummaryChart } from '../components/Summaries/SummaryChart'

export const Summary = () => {
    const windowDimensions = useWindowDimensions()
    const expenses = useExpenses()
    const incomes = useIncomes()

    const [numberOfMonths, setNumberOfMonths] = useState(12)

    // Get the total expenses for the last 12 months by category
    let expensesTally = {}
    CATEGORIES.forEach(category => {
        expensesTally[category] = 0
    })

    expenses.forEach(expense => {
        expensesTally[expense.category] += expense.split ? expense.amount / 2 : expense.amount
    })

    const totalExpenses = Object.values(expensesTally).reduce((a, b) => a + b, 0)

    // Get the total income for the last 12 months
    let totalIncome = 0
    incomes.forEach(income => {
        totalIncome += income.amount
    })

    return (
        <main>
            {windowDimensions.width < 768 ? (
                <MobileLayout expensesTally={expensesTally} totalIncome={totalIncome} numberOfMonths={numberOfMonths} />
            ) : (
                <DesktopLayout
                    expensesTally={expensesTally}
                    totalIncome={totalIncome}
                    numberOfMonths={numberOfMonths}
                />
            )}
        </main>
    )
}

const DesktopLayout = ({ expensesTally, totalIncome, numberOfMonths }) => {
    return (
        <HStack mx={5}>
            <Box w="50%">
                <SummaryTable expensesTally={expensesTally} totalIncome={totalIncome} numberOfMonths={numberOfMonths} />
            </Box>
            <Box w="50%">
                <SummaryChart expensesTally={expensesTally} totalIncome={totalIncome} />
            </Box>
        </HStack>
    )
}

const MobileLayout = ({ expensesTally, totalIncome, numberOfMonths }) => {
    return (
        <VStack mx={3} mt={2}>
            <Box w="100%">
                <SummaryChart expensesTally={expensesTally} totalIncome={totalIncome} />
            </Box>
            <Box w="100%">
                <SummaryTable expensesTally={expensesTally} totalIncome={totalIncome} numberOfMonths={numberOfMonths} />
            </Box>
        </VStack>
    )
}
