import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

const BarChart = ({routeData}) => {
  ChartJS.register(
    Tooltip,
    CategoryScale,
    Legend,
    ChartDataLabels,
    LinearScale,
    BarElement,
    Title,
    TimeScale
  );
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        backgroundColor: "black",
        bodyColor: "white",
        bodySpacing: 5,
        padding: 15,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: function (context) {            
            const label = `${context.dataset.label} ${context.formattedValue}%`;
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        stacked: true,
      },
      y: {
        max: 100,
        min: 0,
        ticks: {
          stepSize: 25,
          padding: 2,
          showLabelBackdrop: true,
          callback(value) {
            return `${value}%`;
          },
        },
        stacked: true,
      },
    },
    maintainAspectRatio: false,
  };

  const labels = routeData&&routeData.map((val) => val.Route_Name);

  const data = {
    labels,
    datasets: [
      {
        label: "Cases Sold",
        data: routeData&&routeData.map((val) => val.Percentage),
        backgroundColor: "#959B7B",
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 4
      },
    ],
  };
  return  <Bar options={options} data={data} />
};

export default BarChart;
