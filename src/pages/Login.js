import { useState } from 'react'

import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getDoc, setDoc, doc } from 'firebase/firestore'
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
    Link,
} from '@chakra-ui/react'
import { GoogleButton } from '../components/GoogleButton/GoogleButton'
import { Link as RouterLink } from 'react-router-dom'

import { auth, db } from '../config/firebase'
import { useUser, useSetUser } from '../Stores/UserStore'
import { NOTIFICATION_DURATION } from '../config/constants'

export const Login = () => {
    const toast = useToast()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMissingFields, setErrorMissingFields] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)
    const [errorUserNotFound, setErrorUserNotFound] = useState(false)
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
        setErrorUserNotFound(false)

        if (!email || !password) {
            setErrorMissingFields(true)
            return
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                // Signed in
                const user = userCredential.user

                // Get metadata and set user in store
                const userRef = doc(db, 'users', user.uid)
                getDoc(userRef)
                    .then(document => {
                        if (document.exists()) {
                            // Set user in store
                            setUser({
                                ...user,
                                firstName: document.data().firstName,
                                lastName: document.data().lastName,
                            })

                            // Notification
                            toast({
                                title: 'You are logged in.',
                                description: 'Welcome back!',
                                status: 'success',
                                duration: NOTIFICATION_DURATION,
                                isClosable: true,
                            })
                        } else {
                            console.log('No such document!')
                        }
                    })
                    .catch(error => {
                        console.log('Error getting document:', error)
                    })
            })
            .catch(error => {
                setErrorPassword(error.message)
            })
    }

    const handleGoogleClick = () => {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
            .then(result => {
                const user = result.user
                const isNewUser = result._tokenResponse.isNewUser

                if (isNewUser) {
                    // Add user metadata to databse
                    try {
                        setDoc(doc(db, 'users', user.uid), {
                            firstName: user.displayName.split(' ')[0],
                            lastName: user.displayName.split(' ')[1],
                            email: user.email,
                        })
                    } catch (e) {
                        console.error('Error adding document: ', e)
                    }

                    // Set userStore state
                    const userWithMetaData = {
                        ...user,
                        firstName: user.displayName.split(' ')[0],
                        lastName: user.displayName.split(' ')[1],
                    }
                    setUser(userWithMetaData)

                    // Redirect to home page
                    return <Navigate to="/" />
                } else {
                    try {
                        getDoc(doc(db, 'users', user.uid)).then(doc => {
                            if (doc.exists()) {
                                const userWithMetaData = {
                                    ...user,
                                    firstName: doc.data().firstName,
                                    lastName: doc.data().lastName,
                                }
                                setUser(userWithMetaData)

                                return <Navigate to="/" />
                            } else {
                                console.log('No such document!')
                            }
                        })
                    } catch (e) {
                        console.error('Error getting document: ', e)
                    }
                }
            })
            .catch(error => {
                setErrorFirebase(error.message)
            })
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
                                <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'right'}>
                                    <HStack>
                                        <Text>Don't have an account?</Text>
                                        <Link as={RouterLink} to="/register" color={'blue.500'}>
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
                                {errorUserNotFound && (
                                    <Alert status="error">
                                        <AlertIcon />
                                        User not found
                                    </Alert>
                                )}
                                {errorFirebase && (
                                    <Alert status="error">
                                        <AlertIcon />
                                        Firebase error
                                    </Alert>
                                )}
                                <GoogleButton onClick={handleGoogleClick}>Sign in with Google</GoogleButton>
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
