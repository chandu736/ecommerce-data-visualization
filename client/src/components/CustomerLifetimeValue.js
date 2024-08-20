import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import { Container, Row, Col } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const CustomerLifetimeValueByCohorts = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/customer-lifetime-value-cohorts')
      .then(response => {
        const clvData = response.data || [];
        console.log('API response data:', clvData);

        if (!Array.isArray(clvData)) {
          console.error('Unexpected data format:', clvData);
          setError('Data format error');
          return;
        }

        // Expand data to display by months
        let labels = clvData.map(item => {
          const month = String(item._id.month).padStart(2, '0');
          return `${item._id.year}-${month}`;
        });
        let values = clvData.map(item => item.lifetimeValue);

        if (!labels.length || !values.length) {
          console.error('No data available for chart');
          setError('No data available');
          return;
        }

        setData({
          labels,
          datasets: [{
            label: 'Customer Lifetime Value by Cohorts (Monthly)',
            data: values,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
          }]
        });
      })
      .catch(err => {
        console.error('Error fetching CLV by cohorts data:', err);
        setError('Error fetching data');
      });
  }, []);

  const renderChart = () => {
    if (error) return <p>{error}</p>;

    return data ? <Line data={data} /> : <p>No chart data available.</p>;
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12} className="text-center mb-4">
          <h1>Customer Lifetime Value by Cohorts (Monthly)</h1>
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

export default CustomerLifetimeValueByCohorts;
