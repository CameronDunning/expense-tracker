import { useState, useEffect } from 'react'

import { Container, VStack, StackDivider } from '@chakra-ui/react'

import { getWindowDimensions } from '../utils/windowDimensions'
import { useUser } from '../Stores/UserStore'
import { useIncomes } from '../Stores/IncomesStore'
import { IncomeForm } from '../components/Incomes/IncomeForm'
import { DesktopTable } from '../components/Incomes/DesktopTable'
import { MobileTable } from '../components/Incomes/MobileTable'
import { NotLoggedIn } from '../components/Layout/NotLoggedIn'

export const Incomes = () => {
    const user = useUser()
    const incomes = useIncomes()

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions())
        }
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

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
