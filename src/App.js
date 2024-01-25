import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, FormGroup, FormControl, FormCheck } from 'react-bootstrap';
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

        const markersArray = data.locations.map(location => ({
          indexValue: location[indexValue],
          popupContent: `${location.placename}<br/>AQI: ${location.aqi}<br/>Greenness: ${location.greenness}<br/>Transitscore: ${location.transitscore}<br/>Walkability: ${location.walkability}`,
          center: [location.geoCoordinate.latitude, location.geoCoordinate.longitude],
          radius: 300,
          position: { lat: location.geoCoordinate.latitude, lng: location.geoCoordinate.longitude }
        }));

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
    <Container fluid>
      <Row>
        <Col>
          <h1>InfInt</h1>
          <Form>
            <Form.Group>
              <Form.Check
                inline
                type="radio"
                label="Greenness"
                value="greenness"
                checked={indexValue === 'greenness'}
                onChange={handleRadioChange}
              />
              <Form.Check
                inline
                type="radio"
                label="Walkability"
                value="walkability"
                checked={indexValue === 'walkability'}
                onChange={handleRadioChange}
              />
              <Form.Check
                inline
                type="radio"
                label="AQI"
                value="scaled_aqi"
                checked={indexValue === 'scaled_aqi'}
                onChange={handleRadioChange}
              />
              <Form.Check
                inline
                type="radio"
                label="Transit Score"
                value="transitscore"
                checked={indexValue === 'transitscore'}
                onChange={handleRadioChange}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col>
          {loading ? (
            <p>Loading heatmap data...</p>
          ) : (
            <Heatmap center={heatmapPoints[0]} zoom={10} points={heatmapPoints} circles={circles} />
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <BestCitiesForm />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
