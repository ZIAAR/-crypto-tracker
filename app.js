const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CoinGecko API Setup
const coinGeckoApiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

// RugCheck API Setup
const BASE_URL = 'https://api.rugcheck.xyz/v1';
const YOUR_WALLET = 'your_solana_wallet_address'; // Replace with your wallet
const YOUR_PRIVATE_KEY = 'your_private_key'; // Replace with your private key

// Enable CORS
app.use(cors());

// Fetch CoinGecko data
const fetchCryptoData = async () => {
    try {
        const response = await axios.get(coinGeckoApiUrl);
        console.log('CoinGecko Data:', response.data); // Log CoinGecko response
        return response.data;
    } catch (error) {
        console.error('Error fetching CoinGecko cryptocurrency data:', error);
        return []; // Return empty array if fetch fails
    }
};

// Authenticate with RugCheck API and get auth token
const getAuthToken = async (wallet, privateKey) => {
    const authUrl = `${BASE_URL}/auth/login/solana`;
    const payload = {
        message: {
            publicKey: wallet,
            timestamp: Math.floor(Date.now() / 1000),
        },
        signature: {
            data: privateKey,
            type: 'ed25519',
        },
        wallet: wallet,
    };

    try {
        const response = await axios.post(authUrl, payload);
        console.log('RugCheck Auth Token:', response.data.token); // Log auth token
        return response.data.token;
    } catch (error) {
        console.error('Failed to get auth token:', error);
        return null;
    }
};

// Fetch trending tokens from RugCheck API
const fetchTrendingTokens = async (authToken) => {
    const headers = {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.get(`${BASE_URL}/stats/trending`, { headers });
        console.log('Trending Tokens:', response.data); // Log trending tokens response
        return response.data.data || [];
    } catch (error) {
        console.error('Failed to fetch trending tokens:', error);
        return [];
    }
};

// Express route to fetch both data
app.get('/data', async (req, res) => {
    try {
        const [cryptoData, authToken, trendingTokens] = await Promise.all([
            fetchCryptoData(),
            getAuthToken(YOUR_WALLET, YOUR_PRIVATE_KEY),
            fetchTrendingTokens(authToken),
        ]);

        if (!authToken) {
            return res.status(500).send('Failed to authenticate with RugCheck.');
        }

        res.json({ cryptoData, trendingTokens });
    } catch (error) {
        console.error('Error fetching combined data:', error);
        res.status(500).send('An error occurred while fetching data.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataDisplay = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [trendingTokens, setTrendingTokens] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/data');
                const { cryptoData, trendingTokens } = response.data;

                setCryptoData(cryptoData);
                setTrendingTokens(trendingTokens);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                alert('An error occurred while fetching data. Please try again.');
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

            <h1>Trending Tokens</h1>
            <ul>
                {trendingTokens.map((token, index) => (
                    <li key={index}>
                        {token.name} - {token.symbol}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DataDisplay;
