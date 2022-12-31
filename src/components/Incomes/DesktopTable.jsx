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
    Icon,
    HStack,
    useDisclosure,
    IconButton,
} from '@chakra-ui/react'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'

import { formatter } from '../../utils/currencyFormatter'
import { DATE_FORMATTING } from '../../config/constants'
import { db } from '../../config/firebase'
import { useUser } from '../../Stores/UserStore'
import { IncomeEditorModal } from './IncomeEditorModal'

export const DesktopTable = ({ incomes }) => {
    const modalControls = useDisclosure()
    const [selectedIncome, setSelectedIncome] = useState(null)
    const user = useUser()

    const handleEditClick = income => {
        setSelectedIncome(income)

        modalControls.onOpen()
    }

    const handleDelete = income => {
        deleteDoc(doc(db, `/users/${user.uid}/incomes`, income.id))
    }

    return (
        <TableContainer w={'100%'}>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Date</Th>
                        <Th>Income</Th>
                        <Th isNumeric>Amount</Th>
                        <Th isNumeric maxWidth={'70px'}>
                            Actions
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {incomes &&
                        incomes.map(income => {
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
                                        onClick={() => handleEditClick(income)}>
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
                                        onClick={() => handleDelete(income)}>
                                        <Icon as={FaTrashAlt} size={'md'} w={5} h={5} />
                                    </IconButton>
                                </HStack>
                            )

                            return (
                                <Tr key={income.id}>
                                    <Td>{income.date.toDate().toLocaleDateString(undefined, DATE_FORMATTING)}</Td>
                                    <Td>{income.incomeName}</Td>
                                    <Td isNumeric>{formatter.format(income.amount)}</Td>
                                    <Td isNumeric maxWidth={'70px'}>
                                        {actions}
                                    </Td>
                                </Tr>
                            )
                        })}
                </Tbody>
            </Table>
            <IncomeEditorModal modalControls={modalControls} income={selectedIncome} />
        </TableContainer>
    )
}
