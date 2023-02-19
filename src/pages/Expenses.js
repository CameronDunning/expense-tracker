import { useState, useEffect } from 'react'

import { Container, VStack, StackDivider, Select } from '@chakra-ui/react'

import { CATEGORIES } from '../config/constants'
import { useUser } from '../Stores/UserStore'
import { useExpenses } from '../Stores/ExpensesStore'
import { useWindowDimensions } from '../Stores/UtilsStore'
import { ExpenseForm } from '../components/Expenses/ExpenseForm'
import { DesktopTable } from '../components/Expenses/DesktopTable'
import { MobileTable } from '../components/Expenses/MobileTable'
import { NotLoggedIn } from '../components/Layout/NotLoggedIn'

export const Expenses = () => {
    const windowDimensions = useWindowDimensions()
    const user = useUser()
    const expenses = useExpenses()

    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedCategoryExpenses, setSelectedCategoryExpenses] = useState(expenses)

    useEffect(() => {
        if (selectedCategory === 'All') {
            setSelectedCategoryExpenses(expenses)
            return
        }

        const filteredExpenses = expenses.filter(expense => expense.category === selectedCategory)
        setSelectedCategoryExpenses(filteredExpenses)
    }, [selectedCategory, expenses])

    if (!user) return <NotLoggedIn />

    return (
        <main>
            <Container maxW="8xl">
                <VStack divider={<StackDivider borderColor="gray.400" />} spacing={4}>
                    <ExpenseForm />

                    {windowDimensions.width > 768 ? (
                        <div style={styles.container}>
                            <Select
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                w={220}
                                ml={5}
                                mb={5}>
                                {['All', ...CATEGORIES].map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>

                            <DesktopTable expenses={selectedCategoryExpenses} />
                        </div>
                    ) : (
                        <MobileTable expenses={expenses} />
                    )}
                </VStack>
            </Container>
        </main>
    )
}

const styles = {
    container: {
        width: '100%',
    },
}
