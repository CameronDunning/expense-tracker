import { useEffect, useState } from 'react'

import { getDoc, doc, setDoc } from 'firebase/firestore'
import { Navigate } from 'react-router-dom'
import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue } from '@chakra-ui/react'

import { db } from '../config/firebase'
import { useUser, useSetUser } from '../Stores/UserStore'

import { Link } from '../components/Link/Link'

export const Profile = () => {
    const user = useUser()
    const setUser = useSetUser()
    const [firstName, setFirstName] = useState(user?.firstName)
    const [lastName, setLastName] = useState(user?.lastName)

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName)
            setLastName(user.lastName)
        } else {
            return <Navigate to={'/login'} />
        }
    }, [user])

    const handleSave = () => {
        const userRef = doc(db, 'users', user.uid)
        getDoc(userRef)
            .then(document => {
                if (document.exists()) {
                    // Set user in store
                    setUser({
                        ...user,
                        firstName,
                        lastName,
                    })

                    // Update user metadata in database
                    setDoc(doc(db, 'users', user.uid), {
                        email: user.email,
                        firstName,
                        lastName,
                    })
                } else {
                    console.log('No such document!')
                }
            })
            .catch(error => {
                console.log('Error getting document:', error)
            })
    }

    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                bg={useColorModeValue('white', 'gray.700')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12}>
                <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                    User Profile Edit
                </Heading>
                <FormControl id="firstName" isRequired>
                    <FormLabel>First name</FormLabel>
                    <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
                </FormControl>
                <FormControl id="lastName" isRequired>
                    <FormLabel>Last name</FormLabel>
                    <Input value={lastName} onChange={e => setLastName(e.target.value)} />
                </FormControl>
                <Stack spacing={6} direction={['column', 'row']}>
                    <Button
                        bg={'red.400'}
                        color={'white'}
                        w="full"
                        _hover={{
                            bg: 'red.500',
                        }}>
                        <Link
                            href={'/'}
                            hover={{
                                textDecoration: 'none',
                            }}>
                            Cancel
                        </Link>
                    </Button>
                    <Button
                        bg={'blue.400'}
                        color={'white'}
                        w="full"
                        _hover={{
                            bg: 'blue.500',
                        }}
                        onClick={handleSave}>
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Flex>
    )
}
