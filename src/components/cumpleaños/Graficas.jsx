import React, {useState} from 'react'
import { Chart } from 'primereact/chart';
import { TabView, TabPanel } from 'primereact/tabview';

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
    let basicOptions = {
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };

    const [activeIndex, setActiveIndex] = useState(0);

    const [basicData] = useState({
        labels: ['Alamedas', 'Arkadia', 'Administración', 'Guacarí', 'La Colina', 'Nuestro Bogotá'],
        datasets: [
            {
                label: 'Total Usuarios',
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
                ],
                data: [5, 7, 3, 4, 6, 5]
            }
        ]
    });

  return (
    <div className="card">
        <h5><span className='text-purple-700'>Cantidad de cumpleañeros:</span> 30</h5>
        
    
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
            <TabPanel header="Grafica Edad" className='flex justify-content-center'>
                <Chart type="doughnut" data={chartData} options={lightOptions} style={{ position: 'relative', width: 'auto' }} />
            </TabPanel>
            <TabPanel header="Grafica Lugares Registro">
                <Chart type="bar" data={basicData} options={basicOptions} style={{ position: 'relative', width: 'auto' }}/>
            </TabPanel>
            <TabPanel header="Header III">
                Content III
            </TabPanel>
        </TabView>

    </div>
  )
}

export default Graficas