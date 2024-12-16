const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CoinGecko API Setup
const coinGeckoApiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';
const CG_API_KEY = 'CG-QjrwWo471k8awTn9V3UQ5e96'; // Your CoinGecko API key

// Enable CORS
app.use(cors());

// Fetch CoinGecko data
const fetchCryptoData = async () => {
    try {
        const response = await axios.get(coinGeckoApiUrl, {
            headers: {
                'Authorization': `Bearer ${CG_API_KEY}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching CoinGecko cryptocurrency data:', error);
        return [];
    }
};

// Express route to fetch crypto data
app.get('/data', async (req, res) => {
    try {
        const cryptoData = await fetchCryptoData();
        res.json({ cryptoData });
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        res.status(500).send('An error occurred while fetching data.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
