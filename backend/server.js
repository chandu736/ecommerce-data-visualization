const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://db_user_read:LdmrVA5EDEv4z3Wr@cluster0.n10ox.mongodb.net/RQ_Analytics', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Connection error', error);
});

// API Routes

//Total sales over-time
app.get('/api/sales-over-time', async (req, res) => {
  const { interval } = req.query; 

  const groupBy = {
    daily: { year: { $year: '$created_at' }, month: { $month: '$created_at' }, day: { $dayOfMonth: '$created_at' } },
    monthly: { year: { $year: '$created_at' }, month: { $month: '$created_at' } },
    quarterly: { year: { $year: '$created_at' }, quarter: { $ceil: { $divide: [{ $month: '$created_at' }, 3] } } },
    yearly: { year: { $year: '$created_at' } }
  };

  try {
    const salesData = await mongoose.connection.db.collection('shopifyOrders').aggregate([
      {
        $addFields: {
          created_at: {
            $dateFromString: { dateString: '$created_at' }
          }
        }
      },
      {
        $group: {
          _id: groupBy[interval],
          totalSales: { $sum: { $toDouble: '$total_price_set.shop_money.amount' } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]).toArray();

    res.json(salesData);
  } catch (error) {
    console.error('Error fetching sales over time data:', error);
    res.status(500).send('Error fetching sales data');
  }
});


// Sales Growth Rate Over Time
app.get('/api/sales-growth-rate', async (req, res) => {
  const { interval } = req.query;

  const groupBy = {
    daily: { year: { $year: '$created_at' }, month: { $month: '$created_at' }, day: { $dayOfMonth: '$created_at' } },
    monthly: { year: { $year: '$created_at' }, month: { $month: '$created_at' } },
    quarterly: { year: { $year: '$created_at' }, quarter: { $ceil: { $divide: [{ $month: '$created_at' }, 3] } } },
    yearly: { year: { $year: '$created_at' } }
  };

  try {
    const salesData = await mongoose.connection.db.collection('shopifyOrders').aggregate([
      {
        $addFields: {
          created_at: {
            $dateFromString: { dateString: '$created_at' }
          }
        }
      },
      {
        $group: {
          _id: groupBy[interval],
          totalSales: { $sum: { $toDouble: '$total_price_set.shop_money.amount' } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]).toArray();

    const growthRates = salesData.map((current, index) => {
      if (index === 0) return { ...current, growthRate: 0 }; 
      const previous = salesData[index - 1];
      const growthRate = ((current.totalSales - previous.totalSales) / previous.totalSales) * 100;
      return { ...current, growthRate };
    });

    res.json(growthRates);
  } catch (error) {
    console.error('Error fetching sales growth rate data:', error);
    res.status(500).send('Error fetching sales growth rate data');
  }
});


// New Customers Added Over Time
app.get('/api/new-customers-over-time', async (req, res) => {
  const { interval } = req.query; 

  const groupBy = {
    daily: { year: { $year: '$created_at' }, month: { $month: '$created_at' }, day: { $dayOfMonth: '$created_at' } },
    monthly: { year: { $year: '$created_at' }, month: { $month: '$created_at' } },
    quarterly: { year: { $year: '$created_at' }, quarter: { $ceil: { $divide: [{ $month: '$created_at' }, 3] } } },
    yearly: { year: { $year: '$created_at' } }
  };

  try {
    const newCustomersData = await mongoose.connection.db.collection('shopifyCustomers').aggregate([
      { $addFields: { created_at: { $dateFromString: { dateString: '$created_at' } } } },
      { $group: { _id: groupBy[interval], newCustomers: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]).toArray();

    res.json(newCustomersData);
  } catch (error) {
    console.error('Error fetching new customers data:', error);
    res.status(500).send('Error fetching new customers data');
  }
});



// Number of Repeat Customers
app.get('/api/repeat-customers', async (req, res) => {
  const { interval } = req.query;

  const groupBy = {
    daily: { year: { $year: '$created_at' }, month: { $month: '$created_at' }, day: { $dayOfMonth: '$created_at' } },
    monthly: { year: { $year: '$created_at' }, month: { $month: '$created_at' } },
    quarterly: { year: { $year: '$created_at' }, quarter: { $ceil: { $divide: [{ $month: '$created_at' }, 3] } } },
    yearly: { year: { $year: '$created_at' } }
  };

  try {
    const repeatCustomersData = await mongoose.connection.db.collection('shopifyOrders').aggregate([
      { $group: { _id: '$customer.id', orderCount: { $sum: 1 } } },
      { $match: { orderCount: { $gt: 1 } } },
      {
        $lookup: {
          from: 'shopifyCustomers',
          localField: '_id',
          foreignField: 'id',
          as: 'customerDetails'
        }
      },
      { $unwind: { path: '$customerDetails', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          created_at: {
            $cond: {
              if: { $isArray: '$customerDetails.created_at' },
              then: { $arrayElemAt: ['$customerDetails.created_at', 0] },
              else: '$customerDetails.created_at'
            }
          }
        }
      },
      {
        $project: {
          created_at: {
            $cond: {
              if: { $regexMatch: { input: '$created_at', regex: /^\d{4}-\d{2}-\d{2}/ } },
              then: { $dateFromString: { dateString: '$created_at' } },
              else: '$created_at'
            }
          }
        }
      },
      { $group: { _id: groupBy[interval], repeatCustomers: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]).toArray();

    res.json(repeatCustomersData);
  } catch (error) {
    console.error('Error fetching repeat customers data:', error);
    res.status(500).send('Error fetching repeat customers data');
  }
});

// Geographical Distribution of Customers
app.get('/api/geographical-distribution', async (req, res) => {
  try {
    const geoDistributionData = await mongoose.connection.db.collection('shopifyCustomers').aggregate([
      { $group: { _id: '$default_address.city', customerCount: { $sum: 1 } } },
      { $sort: { customerCount: -1 } }
    ]).toArray();

    res.json(geoDistributionData);
  } catch (error) {
    res.status(500).send('Error fetching geographical distribution data');
  }
});

// Customer Lifetime Value by Cohorts
app.get('/api/customer-lifetime-value-cohorts', async (req, res) => {
  try {
    const cohortData = await mongoose.connection.db.collection('shopifyOrders').aggregate([
      {
        $lookup: {
          from: 'shopifyCustomers',
          localField: 'customer.id',
          foreignField: 'id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $addFields: {
          'customer.created_at': { $dateFromString: { dateString: '$customer.created_at' } }
        }
      },
      {
        $group: {
          _id: { 
            customer_id: '$customer.id', 
            firstPurchaseMonth: { $month: '$customer.created_at' }, 
            firstPurchaseYear: { $year: '$customer.created_at' } 
          },
          totalValue: { $sum: { $toDouble: '$total_price_set.shop_money.amount' } }
        }
      },
      {
        $group: {
          _id: { year: '$_id.firstPurchaseYear', month: '$_id.firstPurchaseMonth' },
          lifetimeValue: { $sum: '$totalValue' },
          customerCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]).toArray();

    res.json(cohortData);
  } catch (error) {
    console.error('Error fetching customer lifetime value data:', error);
    res.status(500).send('Error fetching customer lifetime value data');
  }
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
