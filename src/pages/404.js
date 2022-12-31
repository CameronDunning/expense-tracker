import { Container, Stack, Heading, Box } from '@chakra-ui/react'
import { Link } from '../components/Link/Link'

export const NotFound = () => {
    return (
        <main>
            <Container maxW={'3xl'} centerContent>
                <Stack as={Box} textAlign={'center'} spacing={{ base: 8, md: 14 }} py={{ base: 20 }}>
                    <Heading as={'h1'} fontWeight={600} fontSize={{ base: '4xl', md: '6xl' }} lineHeight={'110%'}>
                        404 Not Found
                    </Heading>
                    <Link href="/">Home</Link>
                </Stack>
            </Container>
        </main>
    )
}
