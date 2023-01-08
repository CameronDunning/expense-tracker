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

import { useWindowDimensions } from '../../Stores/UtilsStore'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export const NetWorthChart = ({ expensesBreakdown, netWorthTally }) => {
    const isMobile = useWindowDimensions().width < 768

    const data = {
        labels: Object.keys(expensesBreakdown).map(key => expensesBreakdown[key].name),
        datasets: [
            {
                label: 'Net Worth',
                data: Object.values(netWorthTally),
                borderColor: 'rgba(12, 198, 14)',
                tension: 0,
            },
        ],
    }

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

    return <Line data={data} width={'300px'} height={'400px'} options={options} />
}
