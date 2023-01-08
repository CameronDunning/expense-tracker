import { useEffect, useState, useCallback } from 'react'

import { getDoc, doc, setDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react'

import { db } from '../config/firebase'
import { useUser, useSetUser } from '../Stores/UserStore'
import { NotFound } from './404'
import { useExpenses } from '../Stores/ExpensesStore'
import { useIncomes } from '../Stores/IncomesStore'

export const Profile = () => {
    const navigate = useNavigate()
    const user = useUser()
    const setUser = useSetUser()
    const expenses = useExpenses()
    const incomes = useIncomes()

    const [firstName, setFirstName] = useState(user?.firstName || '')
    const [lastName, setLastName] = useState(user?.lastName || '')
    const [startingNetWorth, setStartingNetWorth] = useState(user?.startingNetWorth || '')

    useEffect(() => {
        if (!user) return

        setFirstName(user.firstName)
        setLastName(user.lastName)
        setStartingNetWorth(user.startingNetWorth)
    }, [user])

    const handleSave = useCallback(() => {
        const userRef = doc(db, 'users', user.uid)
        getDoc(userRef)
            .then(document => {
                if (document.exists()) {
                    // Set user in store
                    setUser({
                        ...user,
                        firstName,
                        lastName,
                        startingNetWorth,
                    })

                    // Update user metadata in database
                    setDoc(doc(db, 'users', user.uid), {
                        firstName,
                        lastName,
                        expenses,
                        incomes,
                        startingNetWorth,
                    })

                    navigate('/')
                } else {
                    console.log('No such document!')
                }
            })
            .catch(error => {
                console.log('Error getting document:', error)
            })
    }, [firstName, lastName, startingNetWorth, setUser, user, navigate])

    const bgColourFlex = useColorModeValue('gray.50', 'gray.800')
    const bgColourStack = useColorModeValue('white', 'gray.700')

    if (!user) {
        return <NotFound />
    }

    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={bgColourFlex}>
            <Stack spacing={4} w={'full'} maxW={'md'} bg={bgColourStack} rounded={'xl'} boxShadow={'lg'} p={6} my={12}>
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
                <FormLabel>Starting Net Worth</FormLabel>
                <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" />
                    <Input
                        placeholder="Amount"
                        type="number"
                        value={startingNetWorth}
                        onChange={e => setStartingNetWorth(parseFloat(e.target.value))}
                    />
                </InputGroup>
                <Stack spacing={6} direction={['column', 'row']}>
                    <Link to={'/'}>
                        <Button
                            bg={'red.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'red.500',
                            }}>
                            Cancel
                        </Button>
                    </Link>
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
