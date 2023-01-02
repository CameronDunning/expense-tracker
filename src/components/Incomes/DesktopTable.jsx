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
    Button,
} from '@chakra-ui/react'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'

import { currencyFormatter } from '../../utils/numberFormatter'
import { DATE_FORMATTING } from '../../config/constants'
import { db } from '../../config/firebase'
import { useUser } from '../../Stores/UserStore'
import { IncomeEditorModal } from './IncomeEditorModal'

const IN_VIEW_INCREMENT = 100

export const DesktopTable = ({ incomes }) => {
    const user = useUser()
    const modalControls = useDisclosure()
    const [selectedIncome, setSelectedIncome] = useState(null)
    const [numberIncomesInView, setNumberIncomesInView] = useState(IN_VIEW_INCREMENT)

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
                        incomes.map((income, key) => {
                            if (key > numberIncomesInView) return null

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
                                        onClick={() => handleDelete(income)}>
                                        <Icon as={FaTrashAlt} />
                                    </IconButton>
                                </HStack>
                            )

                            return (
                                <Tr key={income.id}>
                                    <Td>{income.date.toDate().toLocaleDateString(undefined, DATE_FORMATTING)}</Td>
                                    <Td>{income.incomeName}</Td>
                                    <Td isNumeric>{currencyFormatter.format(income.amount)}</Td>
                                    <Td isNumeric maxWidth={'70px'}>
                                        {actions}
                                    </Td>
                                </Tr>
                            )
                        })}
                </Tbody>
            </Table>
            {incomes && incomes.length > numberIncomesInView && (
                <HStack justifyContent={'center'}>
                    <Button m={5} onClick={() => setNumberIncomesInView(numberIncomesInView + IN_VIEW_INCREMENT)}>
                        Show more incomes
                    </Button>
                </HStack>
            )}
            <IncomeEditorModal modalControls={modalControls} income={selectedIncome} />
        </TableContainer>
    )
}
