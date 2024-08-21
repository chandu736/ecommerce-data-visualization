import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import { Container, Row, Col, Form, Dropdown } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const SalesGrowthRate = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState('monthly');
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    axios.get(`${apiUrl}/api/sales-growth-rate?interval=${interval}`)
      .then(response => {
        const growthData = response.data || [];
        console.log('API response data:', growthData);

        if (!Array.isArray(growthData)) {
          console.error('Unexpected data format:', growthData);
          setError('Data format error');
          return;
        }

        // Sort data based on the interval
        let sortedData = growthData.slice(); // Clone array to avoid mutating original data

        if (interval === 'monthly') {
          sortedData.sort((a, b) => {
            const yearDiff = a._id.year - b._id.year;
            const monthDiff = a._id.month - b._id.month;
            return yearDiff !== 0 ? yearDiff : monthDiff;
          });
        } else if (interval === 'yearly') {
          sortedData.sort((a, b) => a._id.year - b._id.year);
        } else if (interval === 'quarterly') {
          sortedData.sort((a, b) => {
            const yearDiff = a._id.year - b._id.year;
            const quarterDiff = a._id.quarter - b._id.quarter;
            return yearDiff !== 0 ? yearDiff : quarterDiff;
          });
        } else if (interval === 'daily') {
          sortedData.sort((a, b) => {
            const yearDiff = a._id.year - b._id.year;
            const monthDiff = a._id.month - b._id.month;
            const dayDiff = a._id.day - b._id.day;
            return yearDiff !== 0 ? yearDiff : (monthDiff !== 0 ? monthDiff : dayDiff);
          });
        }

        let labels;
        const values = sortedData.map(item => item.growthRate);

        switch (interval) {
          case 'daily':
            labels = sortedData.map(item => `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`);
            break;
          case 'monthly':
            labels = sortedData.map(item => `${item._id.year}-${String(item._id.month).padStart(2, '0')}`);
            break;
          case 'quarterly':
            labels = sortedData.map(item => `Q${item._id.quarter} ${item._id.year}`);
            break;
          case 'yearly':
            labels = sortedData.map(item => `${item._id.year}`);
            break;
          default:
            labels = [];
        }

        if (!labels.length || !values.length) {
          console.error('No data available for chart');
          setError('No data available');
          return;
        }

        setData({
          labels,
          datasets: [{
            label: 'Sales Growth Rate Over Time',
            data: values,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
          }]
        });
      })
      .catch(err => {
        console.error('Error fetching sales growth rate data:', err);
        setError('Error fetching data');
      });
  }, [interval]);

  const handleIntervalChange = (eventKey) => {
    setInterval(eventKey);
  };

  const renderChart = () => {
    if (error) return <p>{error}</p>;

    return data ? <Line data={data} /> : <p>No chart data available.</p>;
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12} className="text-center mb-4">
          <h1>Sales Growth Rate Over Time</h1>
        </Col>
        <Col md={12} className="mb-4">
          <Form.Group>
            <Form.Label>Interval</Form.Label>
            <Dropdown onSelect={handleIntervalChange}>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {interval.charAt(0).toUpperCase() + interval.slice(1)}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="daily">Daily</Dropdown.Item>
                <Dropdown.Item eventKey="monthly">Monthly</Dropdown.Item>
                <Dropdown.Item eventKey="quarterly">Quarterly</Dropdown.Item>
                <Dropdown.Item eventKey="yearly">Yearly</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Col>
        <Col md={12} className="d-flex justify-content-center">
          <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
            {renderChart()}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SalesGrowthRate;
