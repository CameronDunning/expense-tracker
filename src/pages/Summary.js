import { useCallback, useEffect, useState, useMemo } from 'react'

import { HStack, Box, VStack, Select, Heading, Container } from '@chakra-ui/react'

import { CATEGORIES, DATE_FORMATTING_MONTH_YEAR } from '../config/constants'
import { useExpenses } from '../Stores/ExpensesStore'
import { useIncomes } from '../Stores/IncomesStore'
import { useUser } from '../Stores/UserStore'
import { useWindowDimensions } from '../Stores/UtilsStore'
import { SummaryTable } from '../components/Summaries/SummaryTable'
import { SummaryChart } from '../components/Summaries/SummaryChart'
import { MonthlyTable } from '../components/Summaries/MonthlyTable'
import { MonthlyExpensesChart } from '../components/Summaries/MonthlyExpensesChart'
import { MonthlyTotalsChart } from '../components/Summaries/MonthlyTotalsChart'
import { NotLoggedIn } from '../components/Layout/NotLoggedIn'

const MONTHS_HISTORY_OPTIONS = [3, 6, 12, 24]
const DEFAULT_MONTHS_HISTORY = MONTHS_HISTORY_OPTIONS[2]

export const Summary = () => {
    const windowDimensions = useWindowDimensions()
    const user = useUser()
    const expenses = useExpenses()
    const incomes = useIncomes()

    const today = useMemo(() => new Date(), [])
    const firstOfMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today])

    const generateExpensesTally = useCallback(() => {
        let expensesTally = {}
        CATEGORIES.forEach(category => {
            expensesTally[category] = 0
        })
        return expensesTally
    }, [])

    const [numberOfMonths, setNumberOfMonths] = useState(DEFAULT_MONTHS_HISTORY)
    const [minDate, setMinDate] = useState(
        new Date(new Date(firstOfMonth).setMonth(firstOfMonth.getMonth() - DEFAULT_MONTHS_HISTORY))
    )
    const [expensesTally, setExpensesTally] = useState(generateExpensesTally())
    const [expensesBreakdown, setExpensesBreakdown] = useState({})
    const [incomeTally, setIncomeTally] = useState(0)
    const [incomeBreakdown, setIncomeBreakdown] = useState({})

    useEffect(() => {
        setMinDate(new Date(new Date(firstOfMonth).setMonth(firstOfMonth.getMonth() - numberOfMonths)))
    }, [numberOfMonths, firstOfMonth])

    useEffect(() => {
        if (!expenses) return

        // ExpensesTally: { category: totalAmount }
        // ExpensesBreakdown: { dateKey: { data: { category: totalAmount }, date: Date, name: string } }
        let newExpensesTally = generateExpensesTally()
        let newExpensesBreakdown = {}

        expenses.forEach(expense => {
            if (expense.date.toDate() < minDate) return

            newExpensesTally[expense.category] += expense.split ? expense.amount / 2 : expense.amount

            const dateName = expense.date.toDate().toLocaleDateString(undefined, DATE_FORMATTING_MONTH_YEAR)
            const monthString = String(expense.date.toDate().getMonth() + 1).padStart(2, 0)
            const dateKey = `${expense.date.toDate().getFullYear()}${monthString}`
            if (!newExpensesBreakdown[dateKey]) {
                newExpensesBreakdown[dateKey] = {
                    data: {},
                    date: new Date(expense.date.toDate().getFullYear(), expense.date.toDate().getMonth(), 1),
                    name: dateName,
                }
                CATEGORIES.forEach(category => {
                    newExpensesBreakdown[dateKey].data[category] = 0
                })
            }

            newExpensesBreakdown[dateKey].data[expense.category] += expense.split ? expense.amount / 2 : expense.amount
        })

        setExpensesTally(newExpensesTally)
        setExpensesBreakdown(newExpensesBreakdown)
    }, [expenses, minDate, generateExpensesTally])

    useEffect(() => {
        if (!incomes) return

        // IcomeTally: totalAmount
        // IncomeBreakdown: { dateKey: { data: totalAmount, date: Date, name: string } }
        let newIncomeTally = 0
        let newIncomeBreakdown = {}

        incomes.forEach(income => {
            if (income.date.toDate() < minDate) return

            newIncomeTally += income.amount

            const dateName = income.date.toDate().toLocaleDateString(undefined, DATE_FORMATTING_MONTH_YEAR)
            const monthString = String(income.date.toDate().getMonth() + 1).padStart(2, 0)
            const dateKey = `${income.date.toDate().getFullYear()}${monthString}`
            if (!newIncomeBreakdown[dateKey]) {
                newIncomeBreakdown[dateKey] = {
                    total: 0,
                    date: new Date(income.date.toDate().getFullYear(), income.date.toDate().getMonth(), 1),
                    name: dateName,
                }
            }

            newIncomeBreakdown[dateKey].total += income.amount
        })

        setIncomeTally(newIncomeTally)
        setIncomeBreakdown(newIncomeBreakdown)
    }, [incomes, minDate])

    if (!user) return <NotLoggedIn />

    return (
        <main>
            <Container maxW={'8xl'}>
                <Select value={numberOfMonths} onChange={e => setNumberOfMonths(e.target.value)} w={220} ml={5} mb={5}>
                    {MONTHS_HISTORY_OPTIONS.map((option, index) => (
                        <option key={index} value={option}>
                            {`${option} months of history`}
                        </option>
                    ))}
                </Select>
                {windowDimensions.width < 768 ? (
                    <MobileLayout
                        expensesTally={expensesTally}
                        totalIncome={incomeTally}
                        numberOfMonths={Object.keys(expensesBreakdown).length}
                    />
                ) : (
                    <DesktopLayout
                        expensesTally={expensesTally}
                        totalIncome={incomeTally}
                        expensesBreakdown={expensesBreakdown}
                        incomeBreakdown={incomeBreakdown}
                    />
                )}
            </Container>
        </main>
    )
}

const DesktopLayout = ({ expensesTally, totalIncome, expensesBreakdown, incomeBreakdown }) => {
    const numberOfMonths = Object.keys(expensesBreakdown).length

    return (
        <>
            <HStack mx={3} mb={5} p={2} border={'1px'} borderRadius={10}>
                <Box w="50%">
                    <SummaryTable
                        expensesTally={expensesTally}
                        totalIncome={totalIncome}
                        numberOfMonths={numberOfMonths}
                    />
                </Box>
                <Box w="50%">
                    <SummaryChart expensesTally={expensesTally} totalIncome={totalIncome} />
                </Box>
            </HStack>
            <MonthlyTable expensesBreakdown={expensesBreakdown} incomeBreakdown={incomeBreakdown} />
            <Box mx={3} mb={5} p={2} border={'1px'} borderRadius={10}>
                <Heading m={2}>Expenses</Heading>
                <Box m={4}>
                    <MonthlyExpensesChart expensesBreakdown={expensesBreakdown} />
                </Box>
            </Box>
            <Box mx={3} mb={5} p={2} border={'1px'} borderRadius={10}>
                <Heading m={2}>Totals</Heading>
                <Box m={4}>
                    <MonthlyTotalsChart expensesBreakdown={expensesBreakdown} incomeBreakdown={incomeBreakdown} />
                </Box>
            </Box>
        </>
    )
}

const MobileLayout = ({ expensesTally, totalIncome, numberOfMonths }) => {
    return (
        <VStack mt={2}>
            <Box w="100%">
                <SummaryChart expensesTally={expensesTally} totalIncome={totalIncome} />
            </Box>
            <Box w="100%">
                <SummaryTable expensesTally={expensesTally} totalIncome={totalIncome} numberOfMonths={numberOfMonths} />
            </Box>
        </VStack>
    )
}
