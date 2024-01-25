import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Heatmap from './Heatmap';
import BestCitiesForm from './BestCitiesForm';

const App = () => {
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [circles, setCircles] = useState([]);
  const [indexValue, setIndexValue] = useState('greenness');

  const handleRadioChange = (event) => {
    setIndexValue(event.target.value);
  };

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/locations');
        const data = response.data;
        setHeatmapPoints(data.locations.map(location => [location.geoCoordinate.latitude, location.geoCoordinate.longitude]));
        console.log(data);
        const markersArray = data.locations.map(location => ({
          indexValue: location[indexValue],
          popupContent: location.placename + "<br/> AQI: " +location.aqi +
          "\nGreenness: " + location.greenness + "\nTransitscore: " + location.transitscore +
          "\n Walkability"+location.walkability,
          center: [location.geoCoordinate.latitude, location.geoCoordinate.longitude],
          radius: 300,
          position: { lat: location.geoCoordinate.latitude, lng: location.geoCoordinate.longitude }
        }));

        console.log(markersArray);
        setCircles(markersArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [indexValue]);

  return (
    <div>
      <h1>InfInt</h1>
      <div>
        <label>
          <input
            type="radio"
            value="greenness"
            checked={indexValue === 'greenness'}
            onChange={handleRadioChange}
          />
          Greenness
        </label>

        <label>
          <input
            type="radio"
            value="walkability"
            checked={indexValue === 'walkability'}
            onChange={handleRadioChange}
          />
          Walkability
        </label>

        <label>
          <input
            type="radio"
            value="scaled_aqi"
            checked={indexValue === 'scaled_aqi'}
            onChange={handleRadioChange}
          />
          AQI
        </label>

        <label>
          <input
            type="radio"
            value="transitscore"
            checked={indexValue === 'transitscore'}
            onChange={handleRadioChange}
          />
          Transit Score
        </label>
      </div>

      {loading ? (
        <p>Loading heatmap data...</p>
      ) : (
        <Heatmap center={heatmapPoints[0]} zoom={10} points={heatmapPoints} circles={circles} />
      )}
      <BestCitiesForm/>
    </div>
  );
};

export default App;
