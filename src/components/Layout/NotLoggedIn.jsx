import { Container, Stack, Heading, Box } from '@chakra-ui/react'
import { Link } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export const NotLoggedIn = () => {
    return (
        <main>
            <Container maxW={'3xl'} centerContent>
                <Stack as={Box} textAlign={'center'} spacing={{ base: 8, md: 14 }} py={{ base: 20 }}>
                    <Heading as={'h1'} fontWeight={600} fontSize={{ base: '4xl', md: '6xl' }} lineHeight={'110%'}>
                        You are not logged in! Please log in to view this page.
                    </Heading>
                    <Link as={RouterLink} to="/login">
                        Login
                    </Link>
                </Stack>
            </Container>
        </main>
    )
}
