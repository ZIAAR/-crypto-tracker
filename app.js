// Required Modules
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CoinGecko API Setup
const coinGeckoApiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';
const coinGeckoApiKey = 'CG-QjrwWo471k8awTn9V3UQ5e96'; // Replace with your CoinGecko API key

// Enable CORS
app.use(cors());

// Fetch CoinGecko data
const fetchCryptoData = async () => {
    try {
        const response = await axios.get(coinGeckoApiUrl, {
            headers: {
                'Authorization': `Bearer ${coinGeckoApiKey}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching CoinGecko cryptocurrency data:', error);
        return [];
    }
};

// Express route to fetch data
app.get('/crypto-data', async (req, res) => {
    try {
        const cryptoData = await fetchCryptoData();
        res.json({ cryptoData });
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        res.status(500).send('An error occurred while fetching crypto data.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
document.addEventListener('DOMContentLoaded', () => {
    const cryptoList = document.getElementById('coin-data');

    const fetchCryptoData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/crypto-data');
            const { cryptoData } = response.data;

            cryptoData.forEach(coin => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>${coin.name}</strong> (${coin.symbol.toUpperCase()}): $${coin.current_price.toFixed(2)} 
                    - Market Cap: $${coin.market_cap.toLocaleString()}
                `;
                cryptoList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Failed to fetch crypto data:', error);
        }
    };

    fetchCryptoData();
});

