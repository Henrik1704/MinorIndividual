import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';

function App() {
  const [dataT, setT] = useState([]);
  useEffect(() => {
    axios.get('/getT')
      .then(response => {
        setT(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const [dataH, setH] = useState([]);
  useEffect(() => {
    axios.get('/getH')
      .then(response => {
        setH(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const [dataC, setC] = useState([]);
  useEffect(() => {
    axios.get('/getCarbon')
      .then(response => {
        setC(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const lastTenObservationsT = dataT.slice(-10);
  const validTemperatureObservations = lastTenObservationsT.filter(observation => !isNaN(observation.temperature));
  const averageTemperature = validTemperatureObservations.length > 0
    ? validTemperatureObservations.reduce((sum, observation) => sum + observation.temperature, 0) / validTemperatureObservations.length
    : NaN;
  const temperatureStatusT = (averageTemperature >= 20 && averageTemperature <= 24)
    ? 'Temperature is at an optimal level!'
    : 'Temperature is not at an optimal level!';

  const lastTenObservationsH = dataH.slice(-10);
  const validHumidityObservations = lastTenObservationsH.filter(observation => !isNaN(observation.humidity));
  const averageHumidity = validHumidityObservations.length > 0
    ? validHumidityObservations.reduce((sum, observation) => sum + observation.humidity, 0) / validHumidityObservations.length
    : NaN;
  const statusH = (averageHumidity >= 40 && averageHumidity <= 60)
    ? 'Humidity is at an optimal level!'
    : (averageHumidity > 60)
      ? 'Humidity is not at an optimal level!'
      : 'Humidity is not at an optimal level!';

  const lastTenObservationsC = dataC.slice(-10);
  const validCObservations = lastTenObservationsC.filter(observation => !isNaN(observation.carbon));
  const averageC = validCObservations.length > 0
    ? validCObservations.reduce((sum, observation) => sum + observation.carbon, 0) / validCObservations.length
    : NaN;
  const statusC = (averageC >= 1500)
    ? 'Carbon Dioxide level is not at an optimal level!'
    : (averageC >= 650)
      ? 'Carbon Dioxide level is not at an optimal level!'
      : 'Carbon Dioxide level is at an optimal level!';

  const recommendations = (averageHumidity > 60)
    ? `You can do the following steps to minimize the humidity:
        - Minimize the moisture in the air by using ventilation, fans, air conditioning, and letting it escape.
        - Maintain a constant temperature!`
    : (averageHumidity < 40)
      ? 'Place water bowls near heat sources, hang laundry indoors.'
      : '';
  const temperatureRecommendations = (averageTemperature < 20)
    ? 'The temperature might be too low. Close the window if possible and use heating devices.'
    : (averageTemperature > 24)
      ? 'The temperature might be too high. Open the window to let some fresh air in.'
      : '';

      const cRecommendations = (averageC >= 650)
    ? 'Please consider using the ventilation to guarantee a good environment! Either open a window or trigger the ventilation system!'
    : (averageC >= 1500)
      ? 'The carbon dioxide level is way too high! Consider leaving the room and let some fresh air in!'
      : '';

  return (
    <div className="container">
      <div className="header">
        <h1 className="fancy-heading">Analyzing the indoor air quality</h1>
        
      </div>
      <div className="chart-container">
        <div className="chart-column">
          <LineChart width={400} height={300} data={dataH}>
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="humidity" stroke="#8884d8" />
            <Tooltip />
            <Legend />  
          </LineChart>
          <div className="status-box">
            <p className="status">{statusH}</p>
          </div>
          {recommendations && (
            <div className="recommendations-box">
              <p className="recommendations">{recommendations}</p>
            </div>
          )}
          <p className={`average ${averageHumidity > 70 || averageHumidity < 30 ? 'border-red' : averageHumidity > 60 || averageHumidity < 40 ? 'border-orange' : 'border-green'}`}>
            Average Humidity:{' '}
            <span className={`bold ${averageHumidity > 70 || averageHumidity < 30 ? 'red' : averageHumidity > 60 || averageHumidity < 40 ? 'orange' : 'green'}`}>
              {isNaN(averageHumidity) ? 'N/A' : averageHumidity.toFixed(2)}%
            </span>
          </p>
        </div>
        <div className="chart-column">
          <LineChart width={400} height={300} data={dataT}>
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
            <Tooltip />
            <Legend />
          </LineChart>
          <div className="status-box">
            <p className="status">{temperatureStatusT}</p>
          </div>
          {temperatureRecommendations && (
            <div className="recommendations-box">
              <p className="recommendations">{temperatureRecommendations}</p>
            </div>
          )}
          <p className={`average ${averageTemperature > 26 || averageTemperature < 16 ? 'border-red' : averageTemperature > 24 || averageTemperature < 20 ? 'border-orange' : 'border-green'}`}>
            Average Temperature:{' '}
            <span className={`bold ${averageTemperature > 26 || averageTemperature < 16 ? 'red' : averageTemperature > 24 || averageTemperature < 20 ? 'orange' : 'green'}`}>
              {isNaN(averageTemperature) ? 'N/A' : averageTemperature.toFixed(2)}°C
            </span>
          </p>
        </div>
        <div className="chart-column">
          <LineChart width={400} height={300} data={dataC}>
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="carbon" stroke="#8884d8" />
            <Tooltip />
            <Legend />
          </LineChart>
          <div className="status-box">
            <p className="status">{statusC}</p>
          </div>
          {cRecommendations && (
            <div className="recommendations-box">
              <p className="recommendations">{cRecommendations}</p>
            </div>
          )}
          <p className={`average ${averageC >= 1500 ? 'border-red' : averageC >= 650 ? 'border-orange' : 'border-green'}`}>
            Average Carbon Dioxide level:{' '}
            <span className={`bold ${averageC >= 1500 ? 'red' : averageC >= 650  ? 'orange' : 'green'}`}>
              {isNaN(averageC) ? 'N/A' : averageC.toFixed(2)} ppm
            </span>
          </p>
        </div>
      </div>
      <div className="text-field-container">
        <textarea
          className="text-field"
          value={`Long term recommendations:\n\nCO2: Limit open flames, place plants indoors, observe the humidity levels\n\nHumidity: Observe the windows for moisture, check walls and ceilings for the development of mold\n\nTemperature: Activate the ventilation & heating system`}
          readOnly
        />
        <textarea
          className="text-field"
          value={"Potential health risks:\n\nCO2: Dizziness, headache, visual and hearing dysfunction and unconsciousness within a few minutes to an hour\n\nHumidity: The rate at which chemicals are released from building materials is usually higher at higher building temperatures\n\nTemperature: The rate at which chemicals are released from building materials is usually higher at higher building temperatures"}
          readOnly
        />
      </div>
      
    </div>
  );
}

export default App;
