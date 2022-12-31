import { sendEmailVerification, signOut } from '@firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Button, Heading, Container, useToast } from '@chakra-ui/react'

import { auth } from '../../config/firebase'
import { useUser, useSetUser } from '../../Stores/UserStore'
import { useSetExpenses } from '../../Stores/ExpensesStore'
import { useSetIncomes } from '../../Stores/IncomesStore'
import { NOTIFICATION_DURATION } from '../../config/constants'

export const Mask = () => {
    const setUser = useSetUser()
    const setExpenses = useSetExpenses()
    const setIncomes = useSetIncomes()
    const toast = useToast()
    const navigate = useNavigate()

    const sendVerificationEmail = () => {
        sendEmailVerification(auth.currentUser)
    }

    const logout = () => {
        signOut(auth)
        setUser(null)
        setExpenses([])
        setIncomes([])

        toast({
            title: 'Logged out',
            description: 'You have been logged out',
            status: 'success',
            duration: NOTIFICATION_DURATION,
            isClosable: true,
        })
        navigate('/login')
    }

    return (
        <div style={styles.mask}>
            <Container maxW={'2xl'} centerContent>
                <Heading mt={150} mb={20} textAlign="center">
                    Please Validate your email address before continuing
                </Heading>
                <Button bg={'red.500'} _hover={{ bg: 'red.400' }} onClick={sendVerificationEmail} m={10}>
                    Resend Email
                </Button>
                <Button bg={'red.500'} _hover={{ bg: 'red.400' }} onClick={logout} m={10}>
                    Logout
                </Button>
            </Container>
        </div>
    )
}

const styles = {
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#6b6b6ba6',
        zIndex: 2,
    },
}
