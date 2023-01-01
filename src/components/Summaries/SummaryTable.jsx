import { TableContainer, Table, Thead, Tr, Th, Td, Tbody } from '@chakra-ui/react'

import { CATEGORIES } from '../../config/constants'
import { currencyFormatter, percentFormatter } from '../../utils/numberFormatter'

export const SummaryTable = ({ expensesTally, totalIncome, numberOfMonths }) => {
    const totalExpenses = Object.values(expensesTally).reduce((a, b) => a + b, 0)

    return (
        <TableContainer>
            <Table>
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th isNumeric>Total</Th>
                        <Th isNumeric>Monthly</Th>
                        <Th isNumeric>Income %</Th>
                    </Tr>
                    <Tr>
                        <Th fontSize={'l'}>Expenses</Th>
                        <Th isNumeric fontSize={'l'}>
                            {currencyFormatter.format(totalExpenses)}
                        </Th>
                        <Th isNumeric fontSize={'l'}>
                            {currencyFormatter.format(totalExpenses / numberOfMonths)}
                        </Th>
                        <Th isNumeric fontSize={'l'}>
                            {percentFormatter.format(totalExpenses / totalIncome)}
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {CATEGORIES.map(category => (
                        <Tr key={category} lineHeight={2}>
                            <Td py={styles.tablePadding}>{category}</Td>
                            <Td py={styles.tablePadding} isNumeric>
                                {currencyFormatter.format(expensesTally[category])}
                            </Td>
                            <Td py={styles.tablePadding} isNumeric>
                                {currencyFormatter.format(expensesTally[category] / numberOfMonths)}
                            </Td>
                            <Td py={styles.tablePadding} isNumeric>
                                {percentFormatter.format(expensesTally[category] / totalIncome)}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
                <Thead>
                    <Tr>
                        <Th fontSize={'l'}>Income</Th>
                        <Th isNumeric fontSize={'l'}>
                            {currencyFormatter.format(totalIncome)}
                        </Th>
                        <Th isNumeric fontSize={'l'}>
                            {currencyFormatter.format(totalIncome / numberOfMonths)}
                        </Th>
                        <Th isNumeric fontSize={'l'}></Th>
                    </Tr>
                    <Tr>
                        <Th fontSize={'l'}>Net Income</Th>
                        <Th isNumeric fontSize={'l'}>
                            {currencyFormatter.format(totalIncome - totalExpenses)}
                        </Th>
                        <Th isNumeric fontSize={'l'}>
                            {currencyFormatter.format((totalIncome - totalExpenses) / numberOfMonths)}
                        </Th>
                        <Th isNumeric fontSize={'l'}>
                            {percentFormatter.format(1 - totalExpenses / totalIncome)}
                        </Th>
                    </Tr>
                </Thead>
            </Table>
        </TableContainer>
    )
}

const styles = {
    tablePadding: 1.5,
}
