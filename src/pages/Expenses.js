import { Container, VStack, StackDivider } from '@chakra-ui/react'

import { useUser } from '../Stores/UserStore'
import { useExpenses } from '../Stores/ExpensesStore'
import { useWindowDimensions } from '../Stores/UtilsStore'
import { ExpenseForm } from '../components/Expenses/ExpenseForm'
import { DesktopTable } from '../components/Expenses/DesktopTable'
import { MobileTable } from '../components/Expenses/MobileTable'
import { NotLoggedIn } from '../components/Layout/NotLoggedIn'

export const Expenses = () => {
    const user = useUser()
    const windowDimensions = useWindowDimensions()
    const expenses = useExpenses()

    if (!user) {
        return <NotLoggedIn />
    }

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
