# E-commerce Data Visualization

This project is a full-stack web application that visualizes e-commerce data from a sample Shopify store. It features a REST API built with Node.js and Express that connects to a MongoDB database, and a frontend built with React.js and Chart.js for data visualization.

## Features

- **Total Sales Over Time**: Visualize sales data aggregated by day, month, quarter, and year.
- **Sales Growth Rate Over Time**: Track the growth rate of sales.
- **New Customers Added Over Time**: Monitor the addition of new customers.
- **Number of Repeat Customers**: Identify and visualize repeat customers over different time frames.
- **Geographical Distribution of Customers**: View the distribution of customers on a map.
- **Customer Lifetime Value by Cohorts**: Group customers by the month of their first purchase and visualize their lifetime value.

## Tech Stack

- **Frontend**: React.js, Chart.js
- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB (hosted on MongoDB Atlas)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/chandu736/ecommerce-data-visualization.git

## Backend setup
 - Navigate to backend directory
   ```bash
    cd backend
 - Install dependencies
   ```bash
   npm install
 - Set up environment variables
   ```bash
   MONGDB_URI: mongodb+srv://db_user_read:LdmrVA5EDEv4z3Wr@cluster0.n10ox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
 - Start the backend server
   ```bash
   npm start

 ## Frontend setup
 - Navigate to frontend directory
   ```bash
    cd ../client
 - Install dependencies
   ```bash
   npm install
 - Build the frontend
   ```bash
   npm run build
 - Start the frontend
   ```bash
   npm start  

## API Endpoints
 - Base URL
   ```bash
   https://ecommerce-data-visualization-1.onrender.com
 ## Endpoints
   1 **Total Sales Over Time**
     `GET /api/sales-over-time`
   - Query Parameters:
      ```bash
      `interval`: `daily`,`monthly`,`quarterly`,`yearly`
   2 **Sales Growth Rate Over Time**
     `GET /api/sales-growth-rate`
   - Query Parameters:
      ```bash
      `interval`: `daily`,`monthly`,`quarterly`,`yearly`
   3 **New Customers Added Over Time**
     `GET /api/new-customers-over-time`
   - Query Parameters:
      ```bash
      `interval`: `daily`,`monthly`,`quarterly`,`yearly`
   4 **Number of Repeat Customers**
     `GET /api/repeat-customers`
   - Query Parameters:
      ```bash
      `interval`: `daily`,`monthly`,`quarterly`,`yearly`
   5 **Geographical Distribution of Customers**
     `GET /api/geographical-distribution`
   6 *Customer Lifetime Value by Cohorts*
     `GET /api/customer-lifetime-value-cohorts`
