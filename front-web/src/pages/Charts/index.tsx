import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

import Filters from '../../components/Filters';
import { barOptions, pieOptions } from './chart-options';
import { buildBarSeries, getGenderChartData, getPlatformChartData } from './helpers';

import './styles.css';

const url = 'https://sds1-jordan.herokuapp.com';

type PieChartData = {
    labels: string[],
    series: number[],
}
type BarChartData = {
    x: string,
    y: number,
}

const initialPieData = {
    labels: [],
    series: []
}
 
const Charts = () => {

    const [barChartData, setBarChartData] = useState<BarChartData[]>([])
    const [platformData, setPlatformData] = useState<PieChartData>(initialPieData)
    const [genderData, setGenderData] = useState<PieChartData>(initialPieData)

    useEffect(() => {
        async function getData(){
            const recordsResponse = await axios.get(`${url}/records`)
            const gamesResponse = await axios.get(`${url}/games`)

            const barData = buildBarSeries(gamesResponse.data, recordsResponse.data.content)
            console.log(barData);
            setBarChartData(barData)

            const platformChartData = getPlatformChartData(recordsResponse.data.content)
            setPlatformData(platformChartData)

            const genderChartData = getGenderChartData(recordsResponse.data.content)
            setGenderData(genderChartData)
        }
        getData()
    }, [])

    return (
        <div className="page-container">
            <Filters link="/records" linkText="VER TABELA"/> 
            <div className="chart-container">
                <div className="top-related">
                    <h1 className="top-related-title">
                        Jogos mais votados
                    </h1>
                    <div className="games-container">
                        <Chart 
                            options={ barOptions}
                            type="bar"
                            width="900"
                            height="650"
                            series={[{ data: barChartData }]}
                        />
                    </div>
                </div>
                <div className="charts">
                    <div className="platform-chart">
                        <h2 className="chart-title">Plataformas</h2>
                        <Chart 
                            options={{ ...pieOptions, labels: platformData?.labels }}
                            type="donut"
                            width="350"
                            series={ platformData?.series}
                        />
                    </div>
                    <div className="gender-chart">
                        <h2 className="chart-title">Gêneros</h2>
                        <Chart 
                            options={{ ...pieOptions, labels: genderData?.labels }}
                            type="donut"
                            width="350"
                            series={ genderData?.series}
                        />
                    </div>
                </div>
            </div>
        </div>
    );    
}

export default Charts;