import create from 'zustand'

import { generateExpensesBreakdown } from '../utils/expenseDataFormatting'

const ExpensesStore = create(set => ({
    expenses: null,
    expensesTally: {},
    expensesBreakdown: {},

    setExpenses: expenses => {
        set({ expenses })

        const { expensesTally, expensesBreakdown } = generateExpensesBreakdown(expenses)
        set({ expensesTally })
        set({ expensesBreakdown })
    },
    setExpensesTally: expensesTally => set({ expensesTally }),
    setExpensesBreakdown: expensesBreakdown => set({ expensesBreakdown }),
}))

export const useExpenses = () => ExpensesStore(state => state.expenses)
export const useSetExpenses = () => ExpensesStore(state => state.setExpenses)
export const useExpensesTally = () => ExpensesStore(state => state.expensesTally)
export const useSetExpensesTally = () => ExpensesStore(state => state.setExpensesTally)
export const useExpensesBreakdown = () => ExpensesStore(state => state.expensesBreakdown)
export const useSetExpensesBreakdown = () => ExpensesStore(state => state.setExpensesBreakdown)
