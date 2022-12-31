import create from 'zustand'

const ExpensesStore = create(set => ({
    expenses: null,
    setExpenses: expenses => set({ expenses }),
}))

export const useExpenses = () => ExpensesStore(state => state.expenses)
export const useSetExpenses = () => ExpensesStore(state => state.setExpenses)
