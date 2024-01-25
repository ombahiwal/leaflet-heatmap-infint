import React, { useState } from 'react';
import axios from 'axios';

const BestCitiesForm = () => {
  const [greennessWeight, setGreennessWeight] = useState('');
  const [walkabilityWeight, setWalkabilityWeight] = useState('');
  const [aqiWeight, setAqiWeight] = useState('');
  const [transportationWeight, setTransportationWeight] = useState('');
  const [cityList, setCityList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the query parameters based on the form inputs
    const queryParams = {
      greenness_weight: greennessWeight,
      walkability_weight: walkabilityWeight,
      aqi_weight: aqiWeight,
      transportation_weight: transportationWeight,
    };

    try {
      // Send a GET request using Axios
      const response = await axios.get('http://127.0.0.1:5000/best_location', { params: queryParams });

      // Handle the response by updating the city list
      setCityList(response.data);
    } catch (error) {
      // Handle errors
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <form id="bestCitiesForm" onSubmit={handleSubmit}>
      <label>Find the best city based on your own weighting:</label><br />
      <label htmlFor="greenness_weight">Greenness:</label>
      <input
        type="number"
        id="greenness_weight"
        name="greenness_weight"
        value={greennessWeight}
        onChange={(e) => setGreennessWeight(e.target.value)}
      /><br />

      <label htmlFor="walkability_weight">Walkability:</label>
      <input
        type="number"
        id="walkability_weight"
        name="walkability_weight"
        value={walkabilityWeight}
        onChange={(e) => setWalkabilityWeight(e.target.value)}
      /><br />

      <label htmlFor="aqi_weight">AQI:</label>
      <input
        type="number"
        id="aqi_weight"
        name="aqi_weight"
        value={aqiWeight}
        onChange={(e) => setAqiWeight(e.target.value)}
      /><br />

      <label htmlFor="transportation_weight">Transportation:</label>
      <input
        type="number"
        id="transportation_weight"
        name="transportation_weight"
        value={transportationWeight}
        onChange={(e) => setTransportationWeight(e.target.value)}
      /><br />

      <button type="submit">Find your best city</button>
    </form>

      <ul>
        {cityList.map((city, index) => (
          <li key={index}>
            <strong>Name:</strong> {city.name},{' '}
            <strong>Coordinates:</strong> ({city.geoCoordinate.latitude}, {city.geoCoordinate.longitude}),{' '}
            <strong>Score:</strong> {city.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BestCitiesForm;
