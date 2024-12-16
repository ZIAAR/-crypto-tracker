const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CoinGecko API Setup
const coinGeckoApiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

// Enable CORS
app.use(cors());

// Fetch CoinGecko data
const fetchCryptoData = async () => {
    try {
        const response = await axios.get(coinGeckoApiUrl);
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
// app.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CryptoTracker = () => {
    const [cryptoData, setCryptoData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/data');
                setCryptoData(response.data.cryptoData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Crypto Data</h1>
            <ul>
                {cryptoData.map((coin, index) => (
                    <li key={index}>
                        <strong>{coin.name}</strong> ({coin.symbol.toUpperCase()}): ${coin.current_price.toFixed(2)} - Market Cap: ${coin.market_cap.toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CryptoTracker;
