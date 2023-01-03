import { useState, useEffect } from 'react'

import {
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Select,
} from '@chakra-ui/react'

import { useWindowDimensions } from '../../Stores/UtilsStore'
import { useExpenses, useExpensesBreakdown } from '../../Stores/ExpensesStore'
import { DesktopTable } from './DesktopTable'
import { MobileTable } from './MobileTable'

export const DuplicateRecurringExpenseModal = ({ isOpen, onClose, duplicateRecurringExpenses }) => {
    const mobile = useWindowDimensions().width < 768

    const expenses = useExpenses()
    const allExpensesBreakdown = useExpensesBreakdown()

    const [monthsOptions, setMonthsOptions] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(monthsOptions[0])
    const [selectedMonthExpenses, setSelectedMonthExpenses] = useState([])

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

        const selectedMonthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date.toDate())
            return expense.recurring && expenseDate >= startOfMonth && expenseDate <= endOfMonth
        })

        setSelectedMonthExpenses(selectedMonthExpenses)
    }, [selectedMonth, expenses, allExpensesBreakdown])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
            <ModalOverlay />
            <ModalContent maxW={'90%'}>
                <ModalHeader>Duplicate Recurring Expenses</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text color={'gray.500'}>
                        The following expenses will be duplicated for the current month. Please confirm.
                    </Text>
                    <Select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} w={220} m={5}>
                        {monthsOptions.map((option, index) => (
                            <option key={index} value={option}>
                                {option.replace('-', ' ')}
                            </option>
                        ))}
                    </Select>
                    {mobile ? (
                        <MobileTable expenses={selectedMonthExpenses} readOnly />
                    ) : (
                        <DesktopTable expenses={selectedMonthExpenses} readOnly />
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => duplicateRecurringExpenses(selectedMonthExpenses)}>
                        Confirm
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
