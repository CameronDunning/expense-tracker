import create from 'zustand'

import { generateIncomeBreakdown } from '../utils/incomeDataFormatting'

const IncomesStore = create(set => ({
    incomes: null,
    incomeBreakdown: {},

    setIncomes: incomes => {
        set({ incomes })

        const incomeBreakdown = generateIncomeBreakdown(incomes)
        set({ incomeBreakdown })
    },
}))

export const useIncomes = () => IncomesStore(state => state.incomes)
export const useSetIncomes = () => IncomesStore(state => state.setIncomes)
export const useIncomeBreakdown = () => IncomesStore(state => state.incomeBreakdown)
export const useSetIncomeBreakdown = () => IncomesStore(state => state.setIncomeBreakdown)
