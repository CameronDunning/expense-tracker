import { useState, useCallback, useEffect } from 'react'

import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

import { CATEGORIES, COLOURS } from '../../config/constants'
import { useWindowDimensions } from '../../Stores/UtilsStore'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export const MonthlyExpensesChart = ({ expensesBreakdown }) => {
    const isMobile = useWindowDimensions().width < 768
    const [labels, setLabels] = useState([])
    const [datasets, setDatasets] = useState([])

    const generateDatasets = useCallback(() => {
        let datasets = []
        CATEGORIES.forEach((category, key) => {
            datasets.push({ data: [], label: category, fill: false, borderColor: COLOURS[key], tension: 0 })
        })
        return datasets
    }, [])

    useEffect(() => {
        let newLabels = []
        let newDatasets = generateDatasets()

        Object.keys(expensesBreakdown).forEach(key => {
            newLabels.push(expensesBreakdown[key].name)
            CATEGORIES.forEach((category, index) => {
                newDatasets[index].data.push(expensesBreakdown[key].data[category])
            })
        })

        setLabels(newLabels)
        setDatasets(newDatasets)
    }, [expensesBreakdown, generateDatasets])

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
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

    if (labels.length === 0 || datasets.length === 0) return <div>data not loaded</div>

    return <Line data={{ labels, datasets }} width={'300px'} height={'400px'} options={options} />
}
