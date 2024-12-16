const apiKey = 'YOUR_COIN_GECKO_API_KEY';  // Replace with your API key
const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

async function fetchCryptoData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayCryptoData(data);
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
    }
}

function displayCryptoData(cryptoData) {
    const cryptoList = document.getElementById('coin-data');
    cryptoData.forEach(coin => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${coin.name}</strong> (${coin.symbol.toUpperCase()})
            <p>Price: $${coin.current_price.toFixed(2)}</p>
            <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
        `;
        cryptoList.appendChild(listItem);
    });
}

fetchCryptoData();

const express = require('express');
const axios = require('axios');
const app = express();

const BASE_URL = 'https://api.rugcheck.xyz/v1';
const YOUR_WALLET = 'your_solana_wallet_address';
const YOUR_PRIVATE_KEY = 'your_private_key';

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
        return response.data.token;
    } catch (error) {
        console.error('Failed to get auth token:', error);
        return null;
    }
};

const fetchTrendingTokens = async (authToken) => {
    const headers = {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
    };
    
    try {
        const response = await axios.get(`${BASE_URL}/stats/trending`, { headers });
        return response.data.data || [];
    } catch (error) {
        console.error('Failed to fetch trending tokens:', error);
        return [];
    }
};

app.get('/trending-tokens', async (req, res) => {
    const authToken = await getAuthToken(YOUR_WALLET, YOUR_PRIVATE_KEY);
    if (!authToken) {
        res.status(500).send('Failed to authenticate.');
        return;
    }

    const trendingTokens = await fetchTrendingTokens(authToken);
    res.json(trendingTokens);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrendingTokens = () => {
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        const fetchTrendingTokens = async () => {
            try {
                const response = await axios.get('http://localhost:3000/trending-tokens');
                setTokens(response.data);
            } catch (error) {
                console.error('Failed to fetch tokens:', error);
            }
        };

        fetchTrendingTokens();
    }, []);

    return (
        <div>
            <h1>Trending Coins</h1>
            <ul>
                {tokens.map((token, index) => (
                    <li key={index}>{token.name} - {token.symbol}</li>
                ))}
            </ul>
        </div>
    );
};

export default TrendingTokens;
