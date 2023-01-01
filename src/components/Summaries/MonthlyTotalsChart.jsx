import { useState, useCallback, useEffect } from 'react'

import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

const CATEGORIES = ['Net Income', 'Income', 'Expenses']
const COLOURS = ['rgba(236, 171, 20, 1)', 'rgba(12, 198, 14, 0.4)', 'rgba(240, 5, 5, 0.4)']
const COLOUR_BORDERS = ['rgba(236, 171, 20, 1)', 'rgba(12, 198, 14, 1)', 'rgba(240, 5, 5, 1)']

export const MonthlyTotalsChart = ({ expensesBreakdown, incomeBreakdown }) => {
    const [labels, setLabels] = useState([])
    const [datasets, setDatasets] = useState([])

    const generateDatasets = useCallback(() => {
        let datasets = []
        CATEGORIES.forEach((category, key) => {
            datasets.push({
                data: [],
                label: category,
                backgroundColor: COLOURS[key],
                borderColor: COLOUR_BORDERS[key],
                borderWidth: 2,
                fill: true,
            })
        })
        return datasets
    }, [])

    useEffect(() => {
        let newLabels = []
        let newDatasets = generateDatasets()

        Object.keys(expensesBreakdown).forEach(key => {
            newLabels.push(expensesBreakdown[key].name)

            const income = incomeBreakdown[key] ? incomeBreakdown[key].total : 0

            const expenses = expensesBreakdown[key].data
            const expenseTotal = Object.values(expenses).reduce((a, b) => a + b, 0)
            const netIncome = income - expenseTotal

            newDatasets[0].data.push(netIncome)
            newDatasets[1].data.push(income)
            newDatasets[2].data.push(-expenseTotal)
        })

        setLabels(newLabels)
        setDatasets(newDatasets)
    }, [expensesBreakdown, incomeBreakdown, generateDatasets])

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                ticks: {
                    font: {
                        size: 15,
                    },
                },
            },
            x: {
                ticks: {
                    font: {
                        size: 15,
                    },
                },
            },
        },
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 20,
                    },
                },
            },
        },
    }

    if (labels.length === 0 || datasets.length === 0) return <div>data not loaded</div>

    return <Line data={{ labels, datasets }} width={'300px'} height={'300px'} options={options} />
}
