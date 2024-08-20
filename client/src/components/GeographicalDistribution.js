import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet for custom icons
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { Container, Row, Col } from 'react-bootstrap';

// Example static city to coordinates mapping
const cityToCoordinates = {
    'Plano': [33.0198, -96.6989],
    'Stockton': [38.0078, -121.3153],
    'El Paso': [31.7619, -106.4850],
    'St. Paul': [44.9542, -93.1008],
    'Oakland': [37.8049, -122.2711],
    'San Antonio': [29.4241, -98.4936],
    'Las Vegas': [36.1699, -115.1398],
    'Washington': [38.8951, -77.0369],
    'Kansas City': [39.0997, -94.5786],
    'Seattle': [47.6062, -122.3321],
    'Wichita': [37.6872, -97.3301],
    'Hialeah': [25.8576, -80.2785],
    'Houston': [29.7604, -95.3698],
    'Dallas': [32.7767, -96.7970],
    'Cincinnati': [39.1031, -84.5120],
    'Laredo': [27.5036, -99.5075],
    'San Jose': [37.3382, -121.8863],
    'Austin': [30.2672, -97.7431],
    'Boston': [42.3601, -71.0589],
    'Chula Vista': [32.6401, -117.0842],
    'San Francisco': [37.7749, -122.4194],
    'Colorado Springs': [38.8339, -104.8214],
    'Aurora': [39.7294, -104.8319],
    'Jacksonville': [30.3322, -81.6557],
    'Henderson': [36.0395, -114.9817],
    'Detroit': [42.3314, -83.0458],
    'Fort Worth': [32.7555, -97.3308],
    'Memphis': [35.1495, -90.0490],
    'Corpus Christi': [27.8006, -97.3964],
    'Toledo': [41.6540, -83.5379],
    'Denver': [39.7392, -104.9903],
    'Jersey City': [40.7178, -74.0431],
    'Santa Ana': [33.7455, -117.8677],
    'Tucson': [32.2226, -110.9747],
    'Columbus': [39.9612, -82.9988],
    'Lexington': [38.0406, -84.5037],
    'Chicago': [41.8781, -87.6298],
    'Los Angeles': [34.0522, -118.2437],
    'Gilbert': [33.3528, -111.7890],
    'Newark': [40.7357, -74.1724],
    'Buffalo': [42.8864, -78.8784],
    'Riverside': [33.9806, -117.3755],
    'Minneapolis': [44.9778, -93.2650],
    'Greensboro': [36.0726, -79.7920],
    'Atlanta': [33.7490, -84.3880],
    'Tulsa': [36.1539, -95.9928],
    'Bakersfield': [35.3733, -119.0187],
    'Nashville': [36.1627, -86.7816],
    'Baltimore': [39.2904, -76.6122],
    'San Diego': [32.7157, -117.1611],
    'New York': [40.7128, -74.0060],
    'Chattanooga': [35.0456, -85.3097],
    'St. Louis': [38.6270, -90.1994],
    'Honolulu': [21.3069, -157.8583],
    'Orlando': [28.5383, -81.3792],
    'St. Petersburg': [27.7739, -82.6310],
    'Garland': [32.9126, -96.6389],
    'Oklahoma City': [35.4676, -97.5164],
    'Phoenix': [33.4484, -112.0740],
    'Portland': [45.5152, -122.6780],
    'Tampa': [27.9506, -82.4572],
    'Charlotte': [35.2271, -80.8431],
    'Philadelphia': [39.9526, -75.1652],
    'Glendale': [33.5387, -112.1854],
    'Indianapolis': [39.7684, -86.1581],
    'Arlington': [32.7357, -97.1081],
    'Cleveland': [41.4993, -81.6944],
    'Miami': [25.7617, -80.1918],
    'Lincoln': [40.8136, -96.7026],
    'Anaheim': [33.8366, -117.9143],
    'Fort Wayne': [41.0793, -85.1394],
    'Raleigh': [35.7796, -78.6382],
    'Madison': [43.0731, -89.4012],
};

// Define a simple dot icon
const simpleDotIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1076/1076983.png',
    iconSize: [10, 10], // Size of the icon
    iconAnchor: [5, 5], // Anchor point for the icon
    popupAnchor: [0, -10] // Anchor point for the popup
});

const GeographicalDistribution = () => {
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/geographical-distribution')
            .then(response => {
                const customerData = response.data || [];
                console.log('API response data:', customerData);

                if (!Array.isArray(customerData)) {
                    console.error('Unexpected data format:', customerData);
                    setError('Data format error');
                    return;
                }

                const locationData = customerData.map(item => ({
                    city: item._id,
                    count: item.customerCount,
                    coords: cityToCoordinates[item._id] || [0, 0], // Default to [0,0] if city not found
                }));

                if (!locationData.length) {
                    console.error('No data available for map');
                    setError('No data available');
                    return;
                }

                setLocations(locationData);
            })
            .catch(err => {
                console.error('Error fetching geographical data:', err);
                setError('Error fetching data');
            });
    }, []);

    const renderMap = () => {
        if (error) return <p>{error}</p>;

        return (
            <MapContainer center={[37.7749, -122.4194]} zoom={4} style={{ height: '500px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {locations.map((loc, index) => (
                    <Marker key={index}
                        position={loc.coords}
                        icon={simpleDotIcon}>
                        <Popup>
                            {loc.city}<br />
                            Customers: {loc.count}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        );
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={12} className="text-center mb-4">
                    <h1>Geographical Distribution of Customers</h1>
                </Col>
                <Col md={12}>
                    {renderMap()}
                </Col>
            </Row>
        </Container>
    );
};

export default GeographicalDistribution;
