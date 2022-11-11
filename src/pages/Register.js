import { useState } from 'react'

import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { Navigate } from 'react-router-dom'
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    Image,
    Text,
    HStack,
    Alert,
    AlertIcon,
} from '@chakra-ui/react'
import { GoogleButton } from '../components/GoogleButton/GoogleButton'

import { auth, db } from '../config/firebase'
import { useUser, useSetUser } from '../Stores/UserStore'

export const Register = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState('')
    const [errorMissingFields, setErrorMissingFields] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)
    const [errorFirebase, setErrorFirebase] = useState(false)

    const user = useUser()
    const setUser = useSetUser()
    if (user) {
        return <Navigate to={'/'} />
    }

    const handleSubmit = event => {
        event.preventDefault()
        setErrorMissingFields(false)
        setErrorPassword(false)
        setErrorFirebase(false)

        if (!firstName || !lastName || !email || !password || !checkPassword) {
            setErrorMissingFields(true)
            return
        }

        if (password !== checkPassword) {
            setErrorPassword(true)
            return
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user

                // Add user metadata to databse
                try {
                    setDoc(doc(db, 'users', user.uid), {
                        firstName,
                        lastName,
                        email,
                    })
                } catch (e) {
                    console.error('Error adding document: ', e)
                }

                // Send verification email
                sendEmailVerification(auth.currentUser)

                // Set userStore state
                const userWithMetaData = {
                    ...user,
                    firstName,
                    lastName,
                }
                // Set user in store
                setUser(userWithMetaData)

                // Redirect to home page
                return <Navigate to="/" />
            })
            .catch(error => {
                setErrorFirebase(error.message)
                return
            })
    }

    return (
        <Stack direction={'row'} flex={1} style={styles.containerStack}>
            <Flex flex={{ base: 0, md: 1 }}>
                <Image alt={'Login Image'} objectFit={'cover'} src={'/register.jpg'} />
            </Flex>
            <form style={styles.form} onSubmit={handleSubmit}>
                <Stack direction={'row'} flex={1} minH={'100%'}>
                    <Flex p={8} flex={1} align={'center'} justify={'center'}>
                        <Stack spacing={4} w={'full'} maxW={'md'}>
                            <Heading fontSize={'2xl'}>Register an account</Heading>
                            <FormControl id="firstName">
                                <FormLabel>First Name</FormLabel>
                                <Input onChange={e => setFirstName(e.target.value)} />
                            </FormControl>
                            <FormControl id="lastName">
                                <FormLabel>Last Name</FormLabel>
                                <Input onChange={e => setLastName(e.target.value)} />
                            </FormControl>
                            <FormControl id="email">
                                <FormLabel>Email address</FormLabel>
                                <Input type="email" onChange={e => setEmail(e.target.value)} />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel>Password</FormLabel>
                                <Input type="password" onChange={e => setPassword(e.target.value)} />
                            </FormControl>
                            <FormControl id="checkPassword">
                                <FormLabel>Re-enter Password</FormLabel>
                                <Input type="password" onChange={e => setCheckPassword(e.target.value)} />
                            </FormControl>
                            <Stack spacing={6}>
                                <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'right'}>
                                    <HStack>
                                        <Text>Already have an account?</Text>
                                        <Link color={'blue.500'} href={'/login'}>
                                            Log in
                                        </Link>
                                    </HStack>
                                </Stack>
                                <Button colorScheme={'blue'} variant={'solid'} type={'submit'}>
                                    Register
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
                                        Passwords do not match
                                    </Alert>
                                )}
                                {errorFirebase && (
                                    <Alert status="error">
                                        <AlertIcon />
                                        {errorFirebase}
                                    </Alert>
                                )}
                                <GoogleButton>Register with Google</GoogleButton>
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
