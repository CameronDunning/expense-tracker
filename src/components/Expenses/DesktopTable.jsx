import { useState } from 'react'

import { deleteDoc, doc } from 'firebase/firestore'
import {
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Flex,
    Icon,
    HStack,
    useDisclosure,
    IconButton,
} from '@chakra-ui/react'
import { TbArrowsSplit } from 'react-icons/tb'
import { FaPencilAlt, FaRedoAlt, FaTrashAlt } from 'react-icons/fa'

import { formatter } from '../../utils/currencyFormatter'
import { DATE_FORMATTING } from '../../config/constants'
import { db } from '../../config/firebase'
import { useUser } from '../../Stores/UserStore'
import { ExpenseEditorModal } from './ExpenseEditorModal'

export const DesktopTable = ({ expenses }) => {
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
        <TableContainer w={'100%'}>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Date</Th>
                        <Th>Expense</Th>
                        <Th>Category</Th>
                        <Th>Amount</Th>
                        <Th>Split</Th>
                        <Th></Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {expenses &&
                        expenses.map(expense => {
                            const icons = (
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
                            )

                            const split = expense.split ? formatter.format(expense.amount / 2) : ''

                            const actions = (
                                <HStack>
                                    <IconButton
                                        w={8}
                                        h={8}
                                        align={'center'}
                                        justify={'center'}
                                        rounded={'15%'}
                                        bg={'blue.500'}
                                        _hover={{ bg: 'blue.600' }}
                                        onClick={() => handleEditClick(expense)}>
                                        <Icon as={FaPencilAlt} size={'md'} w={5} h={5} />
                                    </IconButton>
                                    <IconButton
                                        w={8}
                                        h={8}
                                        align={'center'}
                                        justify={'center'}
                                        rounded={'15%'}
                                        bg={'red.500'}
                                        _hover={{ bg: 'red.600' }}
                                        onClick={() => handleDelete(expense)}>
                                        <Icon as={FaTrashAlt} size={'md'} w={5} h={5} />
                                    </IconButton>
                                </HStack>
                            )

                            return (
                                <Tr key={expense.id}>
                                    <Td>{expense.date.toDate().toLocaleDateString(undefined, DATE_FORMATTING)}</Td>
                                    <Td>{expense.expenseName}</Td>
                                    <Td>{expense.category}</Td>
                                    <Td>{formatter.format(expense.amount)}</Td>
                                    <Td>{split}</Td>
                                    <Td>{icons}</Td>
                                    <Td>{actions}</Td>
                                </Tr>
                            )
                        })}
                </Tbody>
            </Table>
            <ExpenseEditorModal modalControls={modalControls} expense={selectedExpense} />
        </TableContainer>
    )
}
