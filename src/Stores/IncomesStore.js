import create from 'zustand'

const IncomesStore = create(set => ({
    incomes: null,
    setIncomes: incomes => set({ incomes }),
}))

export const useIncomes = () => IncomesStore(state => state.incomes)
export const useSetIncomes = () => IncomesStore(state => state.setIncomes)
