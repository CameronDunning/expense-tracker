import { useState, useEffect } from 'react'

import {
    Select,
    HStack,
    Box,
    Heading,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    Container,
    VStack,
} from '@chakra-ui/react'

import { generateBlankExpensesTally } from '../utils/expenseDataFormatting'
import { currencyFormatter } from '../utils/numberFormatter'
import { useUser } from '../Stores/UserStore'
import { useExpenses, useExpensesBreakdown } from '../Stores/ExpensesStore'
import { useIncomeBreakdown, useIncomes } from '../Stores/IncomesStore'
import { useWindowDimensions } from '../Stores/UtilsStore'
import { MonthlySummaryTable } from '../components/Summaries/MonthlySummaryTable'
import { SummaryChart } from '../components/Summaries/SummaryChart'
import { DesktopTable as IncomeDesktopTable } from '../components/Incomes/DesktopTable'
import { DesktopTable as ExpenseDesktopTable } from '../components/Expenses/DesktopTable'
import { MobileTable as IncomeMobileTable } from '../components/Incomes/MobileTable'
import { MobileTable as ExpenseMobileTable } from '../components/Expenses/MobileTable'
import { MonthlyTimeSeriesExpenses } from '../components/Summaries/MonthlyTimeSeriesExpenses'
import { NotLoggedIn } from '../components/Layout/NotLoggedIn'

export const Monthly = () => {
    const isMobile = useWindowDimensions().width < 768

    const user = useUser()
    const expenses = useExpenses()
    const incomes = useIncomes()
    const allExpensesBreakdown = useExpensesBreakdown()
    const allIncomesBreakdown = useIncomeBreakdown()

    const [monthsOptions, setMonthsOptions] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(monthsOptions[0])
    const [daysInMonth, setDaysInMonth] = useState(0)
    const [selectedMonthExpenses, setSelectedMonthExpenses] = useState([])
    const [expensesTally, setExpensesTally] = useState(generateBlankExpensesTally())
    const [totalExpenses, setTotalExpenses] = useState(0)
    const [selectedMonthIncomes, setSelectedMonthIncomes] = useState([])
    const [totalIncome, setTotalIncome] = useState(0)

    useEffect(() => {
        if (!allExpensesBreakdown) return

        const months = []
        for (const dateKey in allExpensesBreakdown) {
            months.push(allExpensesBreakdown[dateKey].name.replace(' ', '-'))
        }
        setMonthsOptions(months.reverse())
        setSelectedMonth(months[0])
    }, [allExpensesBreakdown])

    useEffect(() => {
        if (!selectedMonth || !allExpensesBreakdown) return

        const matchedBreakdown = Object.values(allExpensesBreakdown).find(
            breakdown => breakdown.name === selectedMonth.replace('-', ' ')
        )
        if (!matchedBreakdown) return

        const startOfMonth = new Date(matchedBreakdown.date)
        const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0, 23, 59, 59)
        const newDaysInMonth = endOfMonth.getDate()

        const selectedMonthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date.toDate())
            return expenseDate >= startOfMonth && expenseDate <= endOfMonth
        })

        const expensesTally = generateBlankExpensesTally()

        for (const expense of selectedMonthExpenses) {
            expensesTally[expense.category] += expense.split ? expense.amount / 2 : expense.amount
        }

        const totalExpenses = Object.values(expensesTally).reduce((acc, expense) => acc + expense, 0)

        const selectedIncomes = incomes.filter(income => {
            const incomeDate = new Date(income.date.toDate())
            return incomeDate >= startOfMonth && incomeDate <= endOfMonth
        })

        const totalIncome = selectedIncomes.reduce((acc, income) => acc + income.amount, 0)

        setDaysInMonth(newDaysInMonth)
        setTotalExpenses(totalExpenses)
        setExpensesTally(expensesTally)
        setSelectedMonthExpenses(selectedMonthExpenses)
        setTotalIncome(totalIncome)
        setSelectedMonthIncomes(selectedIncomes)
    }, [selectedMonth, expenses, incomes, allExpensesBreakdown, allIncomesBreakdown])

    if (!user) return <NotLoggedIn />

    return (
        <main>
            <Container maxW="8xl">
                <Select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} w={220} ml={5} mb={5}>
                    {[...monthsOptions, 'Jan-2023', 'Dec-2022'].map((option, index) => (
                        <option key={index} value={option}>
                            {option.replace('-', ' ')}
                        </option>
                    ))}
                </Select>
                <Heading m={5}>{`Savings: ${currencyFormatter.format(totalIncome - totalExpenses)}`}</Heading>
                {isMobile ? (
                    <MobileLayout
                        expensesTally={expensesTally}
                        selectedMonthExpenses={selectedMonthExpenses}
                        totalIncome={totalIncome}
                        selectedMonthIncomes={selectedMonthIncomes}
                        daysInMonth={daysInMonth}
                    />
                ) : (
                    <DesktopLayout
                        expensesTally={expensesTally}
                        selectedMonthExpenses={selectedMonthExpenses}
                        totalIncome={totalIncome}
                        selectedMonthIncomes={selectedMonthIncomes}
                        daysInMonth={daysInMonth}
                    />
                )}
            </Container>
        </main>
    )
}

const DesktopLayout = ({ expensesTally, selectedMonthExpenses, totalIncome, selectedMonthIncomes, daysInMonth }) => {
    return (
        <>
            <HStack mx={3} mb={5} p={2} border={'1px'} borderRadius={10}>
                <Box w="50%">
                    <MonthlySummaryTable expensesTally={expensesTally} totalIncome={totalIncome} />
                </Box>
                <Box w="50%">
                    <SummaryChart expensesTally={expensesTally} totalIncome={totalIncome} />
                </Box>
            </HStack>
            <Box mx={3} mb={5} p={2} border={'1px'} borderRadius={10}>
                <Heading m={2}>Expenses To Date</Heading>
                <Box>
                    <MonthlyTimeSeriesExpenses daysInMonth={daysInMonth} expenses={selectedMonthExpenses} />
                </Box>
            </Box>
            <Accordion allowToggle>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                                Incomes
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel>
                        <Box mx={3} mb={5} p={2} border={'1px'} borderRadius={10}>
                            <IncomeDesktopTable incomes={selectedMonthIncomes} />
                        </Box>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
            <Accordion allowToggle mb={5}>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                                Expenses
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel>
                        <Box mx={3} mb={5} p={2} border={'1px'} borderRadius={10}>
                            <ExpenseDesktopTable expenses={selectedMonthExpenses} />
                        </Box>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </>
    )
}

const MobileLayout = ({ expensesTally, selectedMonthExpenses, totalIncome, selectedMonthIncomes, daysInMonth }) => {
    return (
        <>
            <VStack mt={2}>
                <Box w="100%">
                    <SummaryChart expensesTally={expensesTally} totalIncome={totalIncome} />
                </Box>
                <Box w="100%">
                    <MonthlySummaryTable expensesTally={expensesTally} totalIncome={totalIncome} />
                </Box>
            </VStack>
            <Box w="100%" mt={5}>
                <Heading m={2}>Expenses To Date</Heading>
                <Box>
                    <MonthlyTimeSeriesExpenses daysInMonth={daysInMonth} expenses={selectedMonthExpenses} />
                </Box>
            </Box>
            <Accordion allowToggle>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                                Incomes
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel>
                        {/* <Heading m={2}>Income</Heading> */}
                        <IncomeMobileTable incomes={selectedMonthIncomes} />
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
            <Accordion allowToggle mb={5}>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                                Expenses
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel>
                        {/* <Heading m={2}>Expenses</Heading> */}
                        <ExpenseMobileTable expenses={selectedMonthExpenses} />
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </>
    )
}
