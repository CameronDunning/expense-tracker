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

export const MonthlyTimeSeriesExpenses = ({ expenses, daysInMonth }) => {
    const isMobile = window.innerWidth < 768

    if (!expenses || !daysInMonth) return null

    const days = Array.from({ length: daysInMonth }, (v, i) => i)
    const recurringExpenses = Array(daysInMonth).fill(0)
    const nonRecurringExpenses = Array(daysInMonth).fill(0)
    const labels = days.map(day => {
        return (day + 1) % 5 ? (day === 0 ? 'Day 1' : '') : `Day ${day + 1}`
    })

    expenses.forEach(expense => {
        const dateNumber = expense.date.toDate().getDate()

        if (expense.recurring) {
            for (let i = dateNumber; i <= daysInMonth; i++) {
                recurringExpenses[i - 1] += expense.split ? expense.amount / 2 : expense.amount
            }
        } else {
            for (let i = dateNumber; i <= daysInMonth; i++) {
                nonRecurringExpenses[i - 1] += expense.split ? expense.amount / 2 : expense.amount
            }
        }
    })

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                stacked: true,
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
                position: isMobile ? 'bottom' : 'right',
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 20,
                    },
                },
            },
        },
    }

    const data = {
        labels,
        datasets: [
            {
                data: recurringExpenses,
                label: 'Recurring',
                backgroundColor: 'rgba(72, 147, 240, 0.4)',
                borderColor: 'rgba(72, 147, 240, 1)',
                borderWidth: 2,
                fill: true,
            },
            {
                data: nonRecurringExpenses,
                label: 'Non-recurring',
                backgroundColor: 'rgba(240, 72, 105, 0.4)',
                borderColor: 'rgba(240, 72, 105, 1)',
                borderWidth: 2,
                fill: true,
            },
        ],
    }

    return <Line data={data} width={'300px'} height={'400px'} options={options} />
}
