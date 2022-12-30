import { Container, TableContainer, Table, Thead, Tr, Th, Td, VStack, StackDivider, Tbody } from '@chakra-ui/react'

import { useExpenses } from '../Stores/ExpensesStore'
import { NewExpense } from '../components/NewExpense/NewExpense'

export const Expenses = () => {
    const expenses = useExpenses()
    const options = { year: 'numeric', month: 'short', day: 'numeric' }

    return (
        <main>
            <Container maxW="8xl">
                <VStack divider={<StackDivider borderColor="gray.400" />} spacing={4}>
                    <NewExpense />

                    <TableContainer w={'100%'}>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Date</Th>
                                    <Th>Expense</Th>
                                    <Th>Category</Th>
                                    <Th>Amount</Th>
                                    <Th>Split</Th>
                                    <Th>Recurring</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {expenses &&
                                    expenses.map(expense => (
                                        <Tr key={expense.id}>
                                            <Td>{expense.date.toDate().toLocaleDateString(undefined, options)}</Td>
                                            <Td>{expense.expenseName}</Td>
                                            <Td>{expense.category}</Td>
                                            <Td>{expense.amount}</Td>
                                            <Td>{expense.split}</Td>
                                            <Td>{expense.recurring}</Td>
                                            <Td></Td>
                                        </Tr>
                                    ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </VStack>
            </Container>
        </main>
    )
}
