import { DATE_FORMATTING_MONTH_YEAR } from '../config/constants'

export const generateIncomeBreakdown = incomes => {
    if (!incomes) return {}

    // IncomeBreakdown: { dateKey: { total: totalAmount, date: Date, name: string } }
    let newIncomeBreakdown = {}

    incomes.forEach(income => {
        const dateName = income.date.toDate().toLocaleDateString(undefined, DATE_FORMATTING_MONTH_YEAR)
        const monthString = String(income.date.toDate().getMonth() + 1).padStart(2, 0)
        const dateKey = `${income.date.toDate().getFullYear()}${monthString}`
        if (!newIncomeBreakdown[dateKey]) {
            newIncomeBreakdown[dateKey] = {
                total: 0,
                date: new Date(income.date.toDate().getFullYear(), income.date.toDate().getMonth(), 1),
                name: dateName,
            }
        }

        newIncomeBreakdown[dateKey].total += income.amount
    })

    return newIncomeBreakdown
}
