import { useState } from 'react'

import { deleteDoc, doc } from 'firebase/firestore'
import {
    VStack,
    StackDivider,
    Box,
    Text,
    Heading,
    Flex,
    Icon,
    Spacer,
    HStack,
    Divider,
    IconButton,
    useDisclosure,
} from '@chakra-ui/react'
import { TbArrowsSplit } from 'react-icons/tb'
import { FaPencilAlt, FaRedoAlt, FaTrashAlt } from 'react-icons/fa'

import { formatter } from '../../utils/currencyFormatter'
import { DATE_FORMATTING } from '../../config/constants'
import { db } from '../../config/firebase'
import { useUser } from '../../Stores/UserStore'
import { ExpenseEditorModal } from './ExpenseEditorModal'

export const MobileTable = ({ expenses }) => {
    const modalControls = useDisclosure()
    const [selectedExpense, setSelectedExpense] = useState(null)
    const user = useUser()

    const handleEditClick = expense => {
        setSelectedExpense(expense)

        modalControls.onOpen()
    }

    const handleDelete = expense => {
        deleteDoc(doc(db, `/users/${user.uid}/expenses`, expense.id))
    }

    return (
        <>
            <VStack divider={<StackDivider borderColor="gray.400" />} spacing={4} w={'100%'}>
                {expenses &&
                    expenses.map(expense => (
                        <Box mb={1} w={'100%'}>
                            <Flex>
                                <Box>
                                    <Text fontWeight={700} textTransform={'uppercase'} color={'gray.500'}>
                                        {expense.category}
                                    </Text>
                                    <Heading color={'white'} mb={1}>
                                        {expense.expenseName}
                                    </Heading>
                                    <Text color={'gray.400'}>
                                        {expense.date.toDate().toLocaleDateString(undefined, DATE_FORMATTING)}
                                    </Text>
                                </Box>
                                <Spacer />
                                <Flex>
                                    <VStack alignItems={'end'}>
                                        <Text
                                            color={'gray.500'}
                                            fontWeight={700}
                                            fontSize={'2xl'}
                                            lineHeight={0.9}
                                            mt={1}>
                                            {formatter.format(expense.amount)}
                                        </Text>
                                        {expense.split ? (
                                            <Text color={'gray.500'} fontWeight={700} fontSize={'large'}>
                                                {'(' + formatter.format(expense.amount / 2) + ')'}
                                            </Text>
                                        ) : (
                                            <Spacer />
                                        )}
                                        <HStack>
                                            <Flex
                                                w={8}
                                                h={8}
                                                align={'center'}
                                                justify={'center'}
                                                rounded={'full'}
                                                bg={expense.split ? 'green.500' : 'gray.400'}>
                                                <Icon as={TbArrowsSplit} size={'md'} w={5} h={5} />
                                            </Flex>
                                            <Flex
                                                w={8}
                                                h={8}
                                                align={'center'}
                                                justify={'center'}
                                                rounded={'full'}
                                                bg={expense.recurring ? 'green.500' : 'gray.400'}>
                                                <Icon as={FaRedoAlt} size={'md'} w={5} h={5} />
                                            </Flex>
                                        </HStack>
                                    </VStack>
                                </Flex>
                                <Box>
                                    <Divider orientation="vertical" mx={6} />
                                </Box>
                                <Box>
                                    <VStack h={'100%'}>
                                        <IconButton
                                            w={8}
                                            h={8}
                                            align={'center'}
                                            justify={'center'}
                                            rounded={'15%'}
                                            bg={'blue.500'}
                                            _hover={{ bg: 'blue.500' }}
                                            onClick={() => handleEditClick(expense)}>
                                            <Icon as={FaPencilAlt} size={'md'} w={5} h={5} />
                                        </IconButton>
                                        <Spacer />
                                        <IconButton
                                            w={8}
                                            h={8}
                                            align={'center'}
                                            justify={'center'}
                                            rounded={'15%'}
                                            bg={'red.500'}
                                            _hover={{ bg: 'red.500' }}
                                            onClick={() => handleDelete(expense)}>
                                            <Icon as={FaTrashAlt} size={'md'} w={5} h={5} />
                                        </IconButton>
                                    </VStack>
                                </Box>
                            </Flex>
                        </Box>
                    ))}
            </VStack>
            <ExpenseEditorModal modalControls={modalControls} expense={selectedExpense} />
        </>
    )
}
