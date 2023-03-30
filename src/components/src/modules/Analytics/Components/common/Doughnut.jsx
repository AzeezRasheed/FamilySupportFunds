import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js'
import { Doughnut as DoughnutChart } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useEffect } from 'react';


const Doughnut = ({ data }) => {    
    ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

    const chartData = {
        labels: data&&data.map((item) => item.tagName),
        datasets: [
            {
                labels: ['sdsd', 'sdsd'],
                data: data&&data.map((item) => item.percentage || 0 ),
                backgroundColor: data&&data.map((item) => item.color),
                borderColor: data&&data.map((item) => item.color),
                borderWidth: 1,
                datalabels: {
                    color: 'white',
                },
                hoverOffset: 10,
                hoverBorderWidth: 10,
                hoverBorderJoinStyle: 'miter',
            },
        ],
    }

    const options = {
        plugins: {
            datalabels: {
                display: false,
            },
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'black',
                bodyColor: 'white',
                bodySpacing: 5,
                padding: 15,
                boxWidth: 8,
                boxHeight: 8,
                boxPadding: 5,
                usePointStyle: true,
                callbacks: {
                    label: function (context) {
                        const label = `${context.label} ${context.parsed}%`
                        return label
                    },
                },
            },
        },
        layout: {
            padding: 20,
        },
        // onClick: (evt, item) => {
        
    }

    const isNotEmpty = (data) => {
        const nonEmptyItems = data&&data.find((item) => Number(item.percentage) > 0)
        return Boolean(nonEmptyItems)
    }
    if(!isNotEmpty(data)){
        return  <div style={{textAlign: "center", margin: "45% 0"}}>No Data found</div> 
    } else {
        return <DoughnutChart data={chartData} options={options} />
    } 
}

export default Doughnut
