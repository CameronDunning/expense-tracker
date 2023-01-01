import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import { CATEGORIES } from '../../config/constants'
import { useWindowDimensions } from '../../Stores/UtilsStore'

ChartJS.register(ArcElement, Tooltip, Legend)

export const SummaryChart = ({ expensesTally, totalIncome }) => {
    const windowDimensions = useWindowDimensions()
    const mobile = windowDimensions.width < 768

    const totalExpenses = Object.values(expensesTally).reduce((a, b) => a + b, 0)

    const data = {
        labels: [...CATEGORIES, 'Net Income'],
        datasets: [
            {
                data: [...Object.values(expensesTally), totalIncome - totalExpenses],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.4)',
                    'rgba(75, 192, 192, 0.4)',
                    'rgba(245, 40, 145, 0.4)',
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(255, 159, 64, 0.4)',
                    'rgba(255, 205, 86, 0.4)',
                    'rgba(153, 102, 255, 0.4)',
                    'rgba(201, 203, 207, 0.4)',
                    'rgba(39, 245, 84, 0.4)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(75, 192, 192)',
                    'rgba(245, 40, 145)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)',
                    'rgba(39, 245, 84)',
                ],
                borderWidth: 1,
            },
        ],
    }

    const options = {
        maintainAspectRatio: false,
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

    const size = mobile ? windowDimensions.width / 1.5 : Math.min(windowDimensions.width / 3, 440)

    console.log('size', size)

    return <Pie data={data} width={size} height={size} options={options} />
}
