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
    Button,
} from '@chakra-ui/react'
import { TbArrowsSplit } from 'react-icons/tb'
import { FaPencilAlt, FaRedoAlt, FaTrashAlt } from 'react-icons/fa'

import { currencyFormatter } from '../../utils/numberFormatter'
import { DATE_FORMATTING } from '../../config/constants'
import { db } from '../../config/firebase'
import { useUser } from '../../Stores/UserStore'
import { ExpenseEditorModal } from './ExpenseEditorModal'

const IN_VIEW_INCREMENT = 100

export const DesktopTable = ({ expenses }) => {
    const user = useUser()
    const modalControls = useDisclosure()
    const [selectedExpense, setSelectedExpense] = useState(null)
    const [numberExpensesInView, setNumberExpensesInView] = useState(IN_VIEW_INCREMENT)

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
                        <Th isNumeric>Amount</Th>
                        <Th isNumeric>Split</Th>
                        <Th></Th>
                        <Th isNumeric>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {expenses &&
                        expenses.map((expense, key) => {
                            if (key > numberExpensesInView) return null

                            const icons = (
                                <HStack>
                                    <Flex
                                        w={8}
                                        h={8}
                                        align={'center'}
                                        justify={'center'}
                                        rounded={'full'}
                                        bg={expense.split ? 'green.500' : 'gray.400'}>
                                        <Icon as={TbArrowsSplit} />
                                    </Flex>
                                    <Flex
                                        w={8}
                                        h={8}
                                        align={'center'}
                                        justify={'center'}
                                        rounded={'full'}
                                        bg={expense.recurring ? 'green.500' : 'gray.400'}>
                                        <Icon as={FaRedoAlt} />
                                    </Flex>
                                </HStack>
                            )

                            const split = expense.split ? currencyFormatter.format(expense.amount / 2) : ''

                            const actions = (
                                <HStack justifyContent={'right'}>
                                    <IconButton
                                        w={8}
                                        h={8}
                                        align={'center'}
                                        justify={'center'}
                                        rounded={'15%'}
                                        bg={'blue.500'}
                                        _hover={{ bg: 'blue.600' }}
                                        onClick={() => handleEditClick(expense)}>
                                        <Icon as={FaPencilAlt} />
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
                                        <Icon as={FaTrashAlt} />
                                    </IconButton>
                                </HStack>
                            )

                            return (
                                <Tr key={expense.id}>
                                    <Td>{expense.date.toDate().toLocaleDateString(undefined, DATE_FORMATTING)}</Td>
                                    <Td>{expense.expenseName}</Td>
                                    <Td>{expense.category}</Td>
                                    <Td isNumeric>{currencyFormatter.format(expense.amount)}</Td>
                                    <Td isNumeric>{split}</Td>
                                    <Td>{icons}</Td>
                                    <Td isNumeric maxW={'70px'}>
                                        {actions}
                                    </Td>
                                </Tr>
                            )
                        })}
                </Tbody>
            </Table>
            {expenses && expenses.length > numberExpensesInView && (
                <HStack justifyContent={'center'}>
                    <Button m={5} onClick={() => setNumberExpensesInView(numberExpensesInView + IN_VIEW_INCREMENT)}>
                        Show more expenses
                    </Button>
                </HStack>
            )}
            <ExpenseEditorModal modalControls={modalControls} expense={selectedExpense} />
        </TableContainer>
    )
}
