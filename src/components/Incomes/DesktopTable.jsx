import { useState } from 'react'

import { doc, updateDoc } from 'firebase/firestore'
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
    useToast,
} from '@chakra-ui/react'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'

import { currencyFormatter } from '../../utils/numberFormatter'
import { DATE_FORMATTING, NOTIFICATION_DURATION } from '../../config/constants'
import { db } from '../../config/firebase'
import { useUser } from '../../Stores/UserStore'
import { useIncomes } from '../../Stores/IncomesStore'
import { IncomeEditorModal } from './IncomeEditorModal'

const IN_VIEW_INCREMENT = 100

export const DesktopTable = () => {
    const modalControls = useDisclosure()
    const toast = useToast()
    const user = useUser()
    const incomes = useIncomes()
    const [selectedIncome, setSelectedIncome] = useState(null)
    const [numberIncomesInView, setNumberIncomesInView] = useState(IN_VIEW_INCREMENT)

    const handleEditClick = income => {
        setSelectedIncome(income)

        modalControls.onOpen()
    }

    const handleDelete = income => {
        const { id } = income
        const newIncomes = incomes.filter(income => income.id !== id)

        try {
            const userRef = doc(db, `/users/${user.uid}`)
            updateDoc(userRef, { incomes: newIncomes })
        } catch (e) {
            toast({
                title: 'Error',
                description: 'There was an error deleting your expense, please try again later',
                status: 'error',
                duration: NOTIFICATION_DURATION,
                isClosable: true,
            })
            console.log('error', e)
        }
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
