const expenseTemplate = ['date', 'expenseName', 'category', 'split', 'recurring', 'amount']
const incomeTemplate = ['date', 'incomeName', 'amount']

export const parseFileExpenses = reader => {
    const rows = reader.result.split('\r\n')

    let expensesArray = []
    rows.forEach(row => {
        const array = row.split(',')

        let expenseObject = {}
        expenseTemplate.forEach((key, index) => {
            if (key === 'split' || key === 'recurring') {
                expenseObject[key] = array[index] === '1' ? true : false
            } else if (key === 'amount') {
                expenseObject[key] = parseFloat(array[index])
            } else if (key === 'date') {
                // hack to get around pacific time zone vs UTC
                const date = new Date(array[index])
                expenseObject[key] = new Date(date.setHours(date.getHours() + 8))
            } else {
                expenseObject[key] = array[index]
            }
        })

        expensesArray.push(expenseObject)
    })

    return expensesArray
}

export const parseFileIncome = reader => {
    const rows = reader.result.split('\r\n')

    let incomesArray = []
    rows.forEach(row => {
        const array = row.split(',')

        let incomeObject = {}
        incomeTemplate.forEach((key, index) => {
            if (key === 'amount') {
                incomeObject[key] = parseFloat(array[index])
            } else if (key === 'date') {
                // hack to get around pacific time zone vs UTC
                const date = new Date(array[index])
                incomeObject[key] = new Date(date.setHours(date.getHours() + 8))
            } else {
                incomeObject[key] = array[index]
            }
        })

        incomesArray.push(incomeObject)
    })

    return incomesArray
}
