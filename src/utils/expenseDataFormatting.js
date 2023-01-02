import { CATEGORIES, DATE_FORMATTING_MONTH_YEAR } from '../config/constants'

export const generateExpensesBreakdown = expenses => {
    if (!expenses) return { expensesTally: {}, expensesBreakdown: {} }

    // ExpensesTally: { category: totalAmount }
    // ExpensesBreakdown: { dateKey: { data: { category: totalAmount }, date: Date, name: string } }
    let newExpensesTally = generateBlankExpensesTally()
    let newExpensesBreakdown = {}

    expenses.forEach(expense => {
        newExpensesTally[expense.category] += expense.split ? expense.amount / 2 : expense.amount

        const dateName = expense.date.toDate().toLocaleDateString(undefined, DATE_FORMATTING_MONTH_YEAR)
        const monthString = String(expense.date.toDate().getMonth() + 1).padStart(2, 0)
        const dateKey = `${expense.date.toDate().getFullYear()}${monthString}`
        if (!newExpensesBreakdown[dateKey]) {
            newExpensesBreakdown[dateKey] = {
                data: {},
                date: new Date(expense.date.toDate().getFullYear(), expense.date.toDate().getMonth(), 1),
                name: dateName,
            }
            CATEGORIES.forEach(category => {
                newExpensesBreakdown[dateKey].data[category] = 0
            })
        }

        newExpensesBreakdown[dateKey].data[expense.category] += expense.split ? expense.amount / 2 : expense.amount
    })

    return { expensesTally: newExpensesTally, expensesBreakdown: newExpensesBreakdown }
}

export const generateBlankExpensesTally = () => {
    let expensesTally = {}
    CATEGORIES.forEach(category => {
        expensesTally[category] = 0
    })

    return expensesTally
}
