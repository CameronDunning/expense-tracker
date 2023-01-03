import { TableContainer, Table, Thead, Tr, Th, Td, Tbody } from '@chakra-ui/react'

import { CATEGORIES, DATE_FORMATTING_MONTH_YEAR } from '../../config/constants'
import { currencyFormatter } from '../../utils/numberFormatter'

export const MonthlyTable = ({ expensesBreakdown, incomeBreakdown }) => {
    return (
        <TableContainer mx={3} mb={5} p={2} border={'1px'} borderRadius={10}>
            <Table>
                <Thead>
                    <Tr>
                        <Th></Th>
                        {expensesBreakdown &&
                            Object.values(expensesBreakdown).map((breakdown, index) => {
                                return (
                                    <Th key={index} isNumeric>
                                        {breakdown.date.toLocaleDateString('en-US', DATE_FORMATTING_MONTH_YEAR)}
                                    </Th>
                                )
                            })}
                    </Tr>
                    <Tr>
                        <Th fontSize={'l'}>Expenses</Th>
                        {expensesBreakdown &&
                            Object.values(expensesBreakdown).map((breakdown, index) => {
                                return (
                                    <Th key={index} fontSize={'l'} isNumeric>
                                        {currencyFormatter.format(
                                            Object.values(breakdown.data).reduce((a, b) => a + b, 0)
                                        )}
                                    </Th>
                                )
                            })}
                    </Tr>
                </Thead>
                <Tbody>
                    {CATEGORIES.map(category => (
                        <Tr key={category}>
                            <Td py={styles.tablePaddingY}>{category}</Td>
                            {expensesBreakdown &&
                                Object.values(expensesBreakdown).map((breakdown, index) => {
                                    return (
                                        <Td key={index} py={styles.tablePaddingY} isNumeric>
                                            {currencyFormatter.format(breakdown.data[category])}
                                        </Td>
                                    )
                                })}
                        </Tr>
                    ))}
                </Tbody>
                <Thead>
                    <Tr>
                        <Th fontSize={'l'}>Income</Th>
                        {incomeBreakdown &&
                            expensesBreakdown &&
                            Object.keys(expensesBreakdown).map(monthKey => {
                                return (
                                    <Th key={monthKey} fontSize={'l'} isNumeric>
                                        {currencyFormatter.format(
                                            incomeBreakdown[monthKey] ? incomeBreakdown[monthKey].total : 0
                                        )}
                                    </Th>
                                )
                            })}
                    </Tr>
                    <Tr>
                        <Th fontSize={'l'}>Savings</Th>
                        {incomeBreakdown &&
                            expensesBreakdown &&
                            Object.keys(expensesBreakdown).map(monthKey => {
                                const income = incomeBreakdown[monthKey] ? incomeBreakdown[monthKey].total : 0
                                const expenses = Object.values(expensesBreakdown[monthKey].data).reduce(
                                    (a, b) => a + b,
                                    0
                                )
                                return (
                                    <Th key={monthKey} fontSize={'l'} isNumeric>
                                        {currencyFormatter.format(income - expenses)}
                                    </Th>
                                )
                            })}
                    </Tr>
                </Thead>
            </Table>
        </TableContainer>
    )
}

const styles = {
    tablePaddingY: 1.5,
    tablePaddingX: 0.8,
}
