import { useState } from 'react'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { Navigate } from 'react-router-dom'
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Image,
    Text,
    HStack,
    Alert,
    AlertIcon,
    useToast,
} from '@chakra-ui/react'
import { GoogleButton } from '../components/GoogleButton/GoogleButton'

import { auth } from '../config/firebase'
import { useUser, useSetUser } from '../Stores/UserStore'
import { Link } from '../components/Link/Link'

export const Login = () => {
    const toast = useToast()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMissingFields, setErrorMissingFields] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)

    const user = useUser()
    const setUser = useSetUser()
    if (user) {
        return <Navigate to={'/'} />
    }

    const handleSubmit = event => {
        event.preventDefault()
        setErrorMissingFields(false)
        setErrorPassword(false)

        if (!email || !password) {
            setErrorMissingFields(true)
            return
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                // Signed in
                const user = userCredential.user
                console.log(user)
                // ...
                setUser(user)
                toast({
                    title: 'You are logged in.',
                    status: 'success',
                    duration: 9000,
                })
            })
            .catch(error => {
                const errorCode = error.code
                const errorMessage = error.message
                console.log(errorCode, errorMessage)
                setErrorPassword(error.message)
            })

        // console.log('rememberMe', rememberMe)
    }

    return (
        <Stack direction={'row'} flex={1} minH={'100%'} style={styles.containerStack}>
            <Flex flex={{ base: 0, md: 1 }}>
                <Image alt={'Login Image'} objectFit={'cover'} src={'/login.jpg'} />
            </Flex>
            <form style={styles.form} onSubmit={handleSubmit}>
                <Stack direction={'row'} flex={1} minH={'100%'}>
                    <Flex p={8} flex={1} align={'center'} justify={'center'}>
                        <Stack spacing={4} w={'full'} maxW={'md'}>
                            <Heading fontSize={'2xl'}>Sign in to your account</Heading>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input type="email" onChange={e => setEmail(e.target.value)} />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" onChange={e => setPassword(e.target.value)} />
                            </FormControl>
                            <Stack spacing={6}>
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    align={'start'}
                                    justify={'space-between'}>
                                    {/* <Checkbox onChange={setRememberMe}>Remember me</Checkbox> */}
                                    <HStack>
                                        <Text>Don't have an account?</Text>
                                        <Link color={'blue.500'} href={'/register'}>
                                            Register
                                        </Link>
                                    </HStack>
                                </Stack>
                                <Button colorScheme={'blue'} variant={'solid'} onClick={handleSubmit} type={'submit'}>
                                    Sign in
                                </Button>
                                {errorMissingFields && (
                                    <Alert status="error">
                                        <AlertIcon />
                                        Please fill all fields
                                    </Alert>
                                )}
                                {errorPassword && (
                                    <Alert status="error">
                                        <AlertIcon />
                                        {errorPassword}
                                    </Alert>
                                )}
                                <GoogleButton>Sign in with Google</GoogleButton>
                            </Stack>
                        </Stack>
                    </Flex>
                </Stack>
            </form>
        </Stack>
    )
}

const styles = {
    containerStack: {
        marginTop: 0,
    },
    form: {
        flex: 1,
        margin: 0,
    },
}
