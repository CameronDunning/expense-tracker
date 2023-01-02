import { useState, useMemo, useEffect } from 'react'

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
} from '@chakra-ui/react'

import { useUser } from '../Stores/UserStore'
import { useExpenses, useExpensesBreakdown } from '../Stores/ExpensesStore'
import { useIncomeBreakdown, useIncomes } from '../Stores/IncomesStore'
import { NotLoggedIn } from '../components/Layout/NotLoggedIn'
import { DATE_FORMATTING_MONTH_YEAR } from '../config/constants'
import { generateBlankExpensesTally } from '../utils/expenseDataFormatting'
import { SummaryTable } from '../components/Summaries/SummaryTable'
import { MonthlySummaryTable } from '../components/Summaries/MonthlySummaryTable'
import { SummaryChart } from '../components/Summaries/SummaryChart'
import { currencyFormatter } from '../utils/numberFormatter'
import { MonthlyTable } from '../components/Summaries/MonthlyTable'
import { DesktopTable as IncomeDesktopTable } from '../components/Incomes/DesktopTable'
import { DesktopTable as ExpenseDesktopTable } from '../components/Expenses/DesktopTable'
import { MonthlyTimeSeriesExpenses } from '../components/Summaries/MonthlyTimeSeriesExpenses'

export const Monthly = () => {
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
        if (!selectedMonth) return

        const startOfMonth = new Date(selectedMonth.replace('-', ' '))
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
            <Select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} w={220} ml={5} mb={5}>
                {monthsOptions.map((option, index) => (
                    <option key={index} value={option}>
                        {option.replace('-', ' ')}
                    </option>
                ))}
            </Select>
            <Heading m={5}>{`Net Income: ${currencyFormatter.format(totalIncome - totalExpenses)}`}</Heading>
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
                                Individual Expenses and Incomes
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel>
                        <Box mx={3} mb={5} p={2} border={'1px'} borderRadius={10}>
                            <Heading m={2}>Income</Heading>

                            <IncomeDesktopTable incomes={selectedMonthIncomes} />
                        </Box>
                        <Box mx={3} mb={5} p={2} border={'1px'} borderRadius={10}>
                            <Heading m={2}>Expenses</Heading>

                            <ExpenseDesktopTable expenses={selectedMonthExpenses} />
                        </Box>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </main>
    )
}
