import { Container, VStack, StackDivider } from '@chakra-ui/react'

import { useUser } from '../Stores/UserStore'
import { useIncomes } from '../Stores/IncomesStore'
import { useWindowDimensions } from '../Stores/UtilsStore'
import { IncomeForm } from '../components/Incomes/IncomeForm'
import { DesktopTable } from '../components/Incomes/DesktopTable'
import { MobileTable } from '../components/Incomes/MobileTable'
import { NotLoggedIn } from '../components/Layout/NotLoggedIn'

export const Incomes = () => {
    const user = useUser()
    const windowDimensions = useWindowDimensions()
    const incomes = useIncomes()

    if (!user) {
        return <NotLoggedIn />
    }

    return (
        <main>
            <Container maxW="8xl">
                <VStack divider={<StackDivider borderColor="gray.400" />} spacing={4}>
                    <IncomeForm />

                    {windowDimensions.width > 768 ? (
                        <DesktopTable incomes={incomes} />
                    ) : (
                        <MobileTable incomes={incomes} />
                    )}
                </VStack>
            </Container>
        </main>
    )
}
