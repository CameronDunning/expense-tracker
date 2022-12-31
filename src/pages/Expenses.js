import { useState, useEffect } from 'react'

import { Container, VStack, StackDivider } from '@chakra-ui/react'

import { getWindowDimensions } from '../utils/windowDimensions'
import { useExpenses } from '../Stores/ExpensesStore'
import { ExpenseForm } from '../components/Expenses/ExpenseForm'
import { DesktopTable } from '../components/Expenses/DesktopTable'
import { MobileTable } from '../components/Expenses/MobileTable'

export const Expenses = () => {
    const expenses = useExpenses()

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions())
        }
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <main>
            <Container maxW="8xl">
                <VStack divider={<StackDivider borderColor="gray.400" />} spacing={4}>
                    <ExpenseForm />

                    {windowDimensions.width > 768 ? (
                        <DesktopTable expenses={expenses} />
                    ) : (
                        <MobileTable expenses={expenses} />
                    )}
                </VStack>
            </Container>
        </main>
    )
}
