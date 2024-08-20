import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SalesOverTime from './components/SalesOverTime';
import SalesGrowthRate from './components/SalesGrowthRate';
import NewCustomersOverTime from './components/NewCustomersOverTime';
import RepeatCustomers from './components/RepeatCustomers';
import GeographicalDistribution from './components/GeographicalDistribution';
import CustomerLifetimeValue from './components/CustomerLifetimeValue';

function App() {
  return (
    <Container>
      <h3 className="text-center my-4">E-Commerce Data Visualization</h3>
      <Row>
        <Col xs={12} md={6} className="mb-4">
          <SalesOverTime />
        </Col>
        <Col xs={12} md={6} className="mb-4">
          <SalesGrowthRate />
        </Col>
        <Col xs={12} md={6} className="mb-4">
          <NewCustomersOverTime />
        </Col>
        <Col xs={12} md={6} className="mb-4">
          <RepeatCustomers />
        </Col>
        <Col xs={12} md={6} className="mb-4">
          <GeographicalDistribution />
        </Col>
        <Col xs={12} md={6} className="mb-4">
          <CustomerLifetimeValue />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
