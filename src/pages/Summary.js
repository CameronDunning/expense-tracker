import { useEffect, useState, useMemo } from 'react'

import { HStack, Box, VStack, Select, Heading, Container, Switch, FormLabel, Spacer } from '@chakra-ui/react'

import { generateBlankExpensesTally } from '../utils/expenseDataFormatting'
import { useExpensesBreakdown } from '../Stores/ExpensesStore'
import { useIncomeBreakdown } from '../Stores/IncomesStore'
import { useUser } from '../Stores/UserStore'
import { useWindowDimensions } from '../Stores/UtilsStore'
import { SummaryTable } from '../components/Summaries/SummaryTable'
import { SummaryChart } from '../components/Summaries/SummaryChart'
import { MonthlyTable } from '../components/Summaries/MonthlyTable'
import { MonthlyExpensesChart } from '../components/Summaries/MonthlyExpensesChart'
import { MonthlyTotalsChart } from '../components/Summaries/MonthlyTotalsChart'
import { NotLoggedIn } from '../components/Layout/NotLoggedIn'
import { NetWorthChart } from '../components/Summaries/NetWorthChart'

const MONTHS_HISTORY_OPTIONS = [3, 6, 12, 24, 36, 48]
const DEFAULT_MONTHS_HISTORY = MONTHS_HISTORY_OPTIONS[1]

export const Summary = () => {
    const windowDimensions = useWindowDimensions()
    const user = useUser()
    const allExpensesBreakdown = useExpensesBreakdown()
    const allIncomesBreakdown = useIncomeBreakdown()

    // Dates
    const today = useMemo(() => new Date(), [])
    const firstOfMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today])
    const [numberOfMonths, setNumberOfMonths] = useState(DEFAULT_MONTHS_HISTORY)
    const [minDate, setMinDate] = useState(
        new Date(new Date(firstOfMonth).setMonth(firstOfMonth.getMonth() - DEFAULT_MONTHS_HISTORY))
    )

    // Data Breakdowns
    const [includeCurrentMonth, setIncludeCurrentMonth] = useState(false)
    const [expensesTally, setExpensesTally] = useState(generateBlankExpensesTally())
    const [expensesBreakdown, setExpensesBreakdown] = useState({})
    const [incomeTally, setIncomeTally] = useState(0)
    const [incomeBreakdown, setIncomeBreakdown] = useState({})
    const [netWorthTally, setNetWorthTally] = useState(0)

    useEffect(() => {
        setMinDate(new Date(new Date(firstOfMonth).setMonth(firstOfMonth.getMonth() - numberOfMonths)))
    }, [numberOfMonths, firstOfMonth])

    useEffect(() => {
        if (Object.keys(allExpensesBreakdown).length === 0) return

        const newExpensesTally = generateBlankExpensesTally()
        const newExpensesBreakdown = { ...allExpensesBreakdown }
        let newNetWorthTally = {}
        let index = 0
        let previousDateKey = null

        for (const dateKey in newExpensesBreakdown) {
            const incomeDateKey = allIncomesBreakdown[dateKey] ? allIncomesBreakdown[dateKey].total : 0

            newNetWorthTally[dateKey] =
                (index === 0 ? user.startingNetWorth : newNetWorthTally[previousDateKey]) +
                incomeDateKey -
                Object.values(allExpensesBreakdown[dateKey].data).reduce((a, b) => a + b, 0)

            previousDateKey = dateKey
            index++

            if (newExpensesBreakdown[dateKey].date < minDate) {
                delete newExpensesBreakdown[dateKey]
                continue
            }

            if (newExpensesBreakdown[dateKey].date >= firstOfMonth && !includeCurrentMonth) {
                delete newExpensesBreakdown[dateKey]
                continue
            }

            for (const category in newExpensesBreakdown[dateKey].data) {
                newExpensesTally[category] += newExpensesBreakdown[dateKey].data[category]
            }
        }

        for (const dateKey in newNetWorthTally) {
            if (!newExpensesBreakdown[dateKey]) {
                delete newNetWorthTally[dateKey]
            }
        }

        setNetWorthTally(newNetWorthTally)
        setExpensesTally(newExpensesTally)
        setExpensesBreakdown(newExpensesBreakdown)
    }, [allExpensesBreakdown, minDate, includeCurrentMonth, today, user, allIncomesBreakdown, firstOfMonth])

    useEffect(() => {
        if (Object.keys(allIncomesBreakdown).length === 0) return

        let newIncomeTally = 0
        const newIncomeBreakdown = { ...allIncomesBreakdown }

        for (const dateKey in newIncomeBreakdown) {
            if (newIncomeBreakdown[dateKey].date < minDate) {
                delete newIncomeBreakdown[dateKey]
                continue
            }

            if (newIncomeBreakdown[dateKey].date >= firstOfMonth && !includeCurrentMonth) {
                delete newIncomeBreakdown[dateKey]
                continue
            }

            newIncomeTally += newIncomeBreakdown[dateKey].total
        }

        setIncomeTally(newIncomeTally)
        setIncomeBreakdown(newIncomeBreakdown)
    }, [allIncomesBreakdown, minDate, includeCurrentMonth, today, firstOfMonth])

    if (!user) return <NotLoggedIn />

    return (
        <main>
            <Container maxW={'8xl'}>
                <HStack>
                    <Select
                        value={numberOfMonths}
                        onChange={e => setNumberOfMonths(e.target.value)}
                        w={220}
                        ml={4}
                        mb={5}>
                        {MONTHS_HISTORY_OPTIONS.map((option, index) => (
                            <option key={index} value={option}>
                                {`${option} months of history`}
                            </option>
                        ))}
                    </Select>
                    <Spacer />
                    <HStack>
                        <FormLabel mb={5}>Add current month:</FormLabel>
                        <Box>
                            <Switch
                                mb={5}
                                mr={4}
                                colorScheme="green"
                                value={includeCurrentMonth}
                                onChange={e => setIncludeCurrentMonth(e.target.checked)}
                            />
                        </Box>
                    </HStack>
                </HStack>
                {windowDimensions.width < 768 ? (
                    <MobileLayout
                        expensesTally={expensesTally}
                        totalIncome={incomeTally}
                        numberOfMonths={Object.keys(expensesBreakdown).length}
                        expensesBreakdown={expensesBreakdown}
                        incomeBreakdown={incomeBreakdown}
                        netWorthTally={netWorthTally}
                    />
                ) : (
                    <DesktopLayout
                        expensesTally={expensesTally}
                        totalIncome={incomeTally}
                        expensesBreakdown={expensesBreakdown}
                        incomeBreakdown={incomeBreakdown}
                        netWorthTally={netWorthTally}
                    />
                )}
            </Container>
        </main>
    )
}

const DesktopLayout = ({ expensesTally, totalIncome, expensesBreakdown, incomeBreakdown, netWorthTally }) => {
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
            <Box mx={3} mb={5} p={2} border={'1px'} borderRadius={10}>
                <Heading m={2}>Net Worth</Heading>
                <Box m={4}>
                    <NetWorthChart expensesBreakdown={expensesBreakdown} netWorthTally={netWorthTally} />
                </Box>
            </Box>
        </>
    )
}

const MobileLayout = ({
    expensesTally,
    totalIncome,
    numberOfMonths,
    expensesBreakdown,
    incomeBreakdown,
    netWorthTally,
}) => {
    return (
        <VStack mt={2}>
            <Box w="100%">
                <SummaryChart expensesTally={expensesTally} totalIncome={totalIncome} />
            </Box>
            <Box w="100%">
                <SummaryTable expensesTally={expensesTally} totalIncome={totalIncome} numberOfMonths={numberOfMonths} />
            </Box>
            <Box w="100%">
                <Heading m={2}>Expenses</Heading>
                <Box>
                    <MonthlyExpensesChart expensesBreakdown={expensesBreakdown} />
                </Box>
            </Box>
            <Box w="100%" pb={10}>
                <Heading m={2}>Totals</Heading>
                <Box>
                    <MonthlyTotalsChart expensesBreakdown={expensesBreakdown} incomeBreakdown={incomeBreakdown} />
                </Box>
            </Box>
            <Box w="100%" pb={10}>
                <Heading m={2}>Net Worth</Heading>
                <Box>
                    <NetWorthChart expensesBreakdown={expensesBreakdown} netWorthTally={netWorthTally} />
                </Box>
            </Box>
        </VStack>
    )
}
