import { TableContainer, Table, Thead, Tr, Th, Td, Tbody } from '@chakra-ui/react'

import { CATEGORIES } from '../../config/constants'
import { currencyFormatter, percentFormatter } from '../../utils/numberFormatter'
import { useWindowDimensions } from '../../Stores/UtilsStore'

export const MonthlySummaryTable = ({ expensesTally, totalIncome }) => {
    const windowDimensions = useWindowDimensions()
    const isMobile = windowDimensions.width < 768

    const totalExpenses = Object.values(expensesTally).reduce((a, b) => a + b, 0)

    return (
        <TableContainer>
            <Table>
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th px={isMobile ? styles.tablePaddingX : null} isNumeric>
                            Amount
                        </Th>
                        <Th px={isMobile ? styles.tablePaddingX : null} isNumeric>
                            %
                        </Th>
                        <Th px={isMobile ? styles.tablePaddingX : null} isNumeric>
                            Income %
                        </Th>
                    </Tr>
                    <Tr>
                        <Th fontSize={'l'} px={isMobile ? styles.tablePaddingX : null}>
                            Expenses
                        </Th>
                        <Th fontSize={'l'} px={isMobile ? styles.tablePaddingX : null} isNumeric>
                            {currencyFormatter.format(totalExpenses)}
                        </Th>
                        <Th fontSize={'l'} px={isMobile ? styles.tablePaddingX : null} isNumeric>
                            100%
                        </Th>
                        <Th fontSize={'l'} px={isMobile ? styles.tablePaddingX : null} isNumeric>
                            {totalIncome === 0 ? 'N/A' : percentFormatter.format(totalExpenses / totalIncome)}
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {CATEGORIES.map(category => (
                        <Tr key={category}>
                            <Td py={styles.tablePaddingY} px={isMobile ? styles.tablePaddingX : null}>
                                {category}
                            </Td>
                            <Td py={styles.tablePaddingY} px={isMobile ? styles.tablePaddingX : null} isNumeric>
                                {currencyFormatter.format(expensesTally[category])}
                            </Td>
                            <Td py={styles.tablePaddingY} px={isMobile ? styles.tablePaddingX : null} isNumeric>
                                {percentFormatter.format(expensesTally[category] / totalExpenses)}
                            </Td>
                            <Td py={styles.tablePaddingY} px={isMobile ? styles.tablePaddingX : null} isNumeric>
                                {totalIncome === 0
                                    ? 'N/A'
                                    : percentFormatter.format(expensesTally[category] / totalIncome)}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
                <Thead>
                    <Tr>
                        <Th fontSize={'l'} px={isMobile ? styles.tablePaddingX : null}>
                            Income
                        </Th>
                        <Th fontSize={'l'} px={isMobile ? styles.tablePaddingX : null} isNumeric>
                            {currencyFormatter.format(totalIncome)}
                        </Th>
                        <Th></Th>
                        <Th fontSize={'l'} px={isMobile ? styles.tablePaddingX : null} isNumeric></Th>
                    </Tr>
                    <Tr>
                        <Th fontSize={'l'} px={isMobile ? styles.tablePaddingX : null}>
                            Savings
                        </Th>
                        <Th fontSize={'l'} px={isMobile ? styles.tablePaddingX : null} isNumeric>
                            {currencyFormatter.format(totalIncome - totalExpenses)}
                        </Th>
                        <Th></Th>
                        <Th fontSize={'l'} px={isMobile ? styles.tablePaddingX : null} isNumeric>
                            {totalIncome === 0 ? 'N/A' : percentFormatter.format(1 - totalExpenses / totalIncome)}
                        </Th>
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
