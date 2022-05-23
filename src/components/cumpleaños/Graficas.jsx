import React, {useState} from 'react'
import { Chart } from 'primereact/chart';

const Graficas = () => {

    const [chartData] = useState({
        labels: ['4-14 años', '15-20 años', '20-35 años', '>30 años'],
        datasets: [
            {
                data: [5, 9, 13, 3],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#14CE7F"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#14CE7F"
                ]
            }]
    });

    const [lightOptions] = useState({
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    });


  return (
    <div className="card flex justify-content-center">
        <Chart type="doughnut" data={chartData} options={lightOptions} style={{ position: 'relative', width: '55%' }} />
    </div>
  )
}

export default Graficas