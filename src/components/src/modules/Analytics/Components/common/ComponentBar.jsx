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
import { useEffect, useState } from "react";

const ComponentBar = ({xAxis_sellIn, xAxis_sellOut}) => {
  const [maxNumber, setMaxNumber] = useState(5000)
  useEffect(() => {
    if (xAxis_sellIn.length > 0 && xAxis_sellOut.length > 0) {
    const sellInMax = xAxis_sellIn.reduce((a, b) => Math.max(a, b.receivedStock), 0);
    const sellOutMax = xAxis_sellOut.reduce((a, b) => Math.max(a, b.sell_out), 0); 
    const maxNumber = Math.max(sellInMax, sellOutMax)
    setMaxNumber(Math.ceil(maxNumber/1000) * 1000)
    }
  }, [xAxis_sellIn, xAxis_sellOut])
  
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
  
  // console.log(+sellOutMax);
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
        titleFont: {
          weight: "bold"
        },
        bodyFont: {
          weight: "bold",
          size: 14
        },
        bodySpacing: 5,
        padding: 15,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: function (context) {            
            const label = `${context.dataset.label} ${context.formattedValue} cases`;
            // const label = `${context.formattedValue} cases`;
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
      },
      y: {
        max: maxNumber,
        min: 0,
        ticks: {
          stepSize: 1000,
          padding: 1,
          showLabelBackdrop: true,
        },
      },
    },
    maintainAspectRatio: false,
  };

  const labels = xAxis_sellIn.map((label)=>(label.brand));
  const data = {
    labels,
    datasets: [
      {
        label: "Sell-In",
        data: xAxis_sellIn.map((label) =>label.receivedStock),
        backgroundColor: "#325A6D",
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Sell-Out",
        data: xAxis_sellOut.map((label) =>label.sell_out),
        backgroundColor: "#E88475",
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

export default ComponentBar;
