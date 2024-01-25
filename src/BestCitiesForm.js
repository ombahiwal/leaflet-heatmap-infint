import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';

const BestCitiesForm = () => {
  const [greennessWeight, setGreennessWeight] = useState('');
  const [walkabilityWeight, setWalkabilityWeight] = useState('');
  const [aqiWeight, setAqiWeight] = useState('');
  const [transportationWeight, setTransportationWeight] = useState('');
  const [cityList, setCityList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const queryParams = {
      greenness_weight: greennessWeight,
      walkability_weight: walkabilityWeight,
      aqi_weight: aqiWeight,
      transportation_weight: transportationWeight,
    };

    try {
      const response = await axios.get('http://127.0.0.1:5000/best_location', { params: queryParams });
      setCityList(response.data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Label>Find the best city based on your own weighting:</Form.Label>
            <Form.Group controlId="greenness_weight">
              <Form.Label>Greenness:</Form.Label>
              <Form.Control
                type="number"
                value={greennessWeight}
                onChange={(e) => setGreennessWeight(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="walkability_weight">
              <Form.Label>Walkability:</Form.Label>
              <Form.Control
                type="number"
                value={walkabilityWeight}
                onChange={(e) => setWalkabilityWeight(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="aqi_weight">
              <Form.Label>AQI:</Form.Label>
              <Form.Control
                type="number"
                value={aqiWeight}
                onChange={(e) => setAqiWeight(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="transportation_weight">
              <Form.Label>Transportation:</Form.Label>
              <Form.Control
                type="number"
                value={transportationWeight}
                onChange={(e) => setTransportationWeight(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Find your best city
            </Button>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col>
          <ListGroup>
            {cityList.map((city, index) => (
              <ListGroup.Item key={index}>
                <strong>Name:</strong> {city.name},{' '}
                <strong>Coordinates:</strong> ({city.geoCoordinate.latitude}, {city.geoCoordinate.longitude}),{' '}
                <strong>Score:</strong> {city.score}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default BestCitiesForm;
