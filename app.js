// app.js
const apiKeyGecko = 'YOUR_COIN_GECKO_API_KEY';  // Replace with your API key
const apiKeyRugCheck = 'YOUR_RUGCHECK_API_KEY'; // Replace with your RugCheck API key
const coinGeckoApiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

// RugCheck API Setup
const BASE_URL = 'https://api.rugcheck.xyz/v1';

// Fetch CoinGecko data
async function fetchCryptoData() {
    try {
        const response = await axios.get(coinGeckoApiUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching CoinGecko cryptocurrency data:', error);
        return [];
    }
}

// Authenticate with RugCheck API and get auth token
async function getAuthToken(wallet, privateKey) {
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
}

// Fetch trending tokens from RugCheck API
async function fetchTrendingTokens(authToken) {
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
}

// Express route to fetch both data
app.get('/data', async (req, res) => {
    try {
        const [cryptoData, authToken, trendingTokens] = await Promise.all([
            fetchCryptoData(),
            getAuthToken(YOUR_WALLET, YOUR_PRIVATE_KEY),
            fetchTrendingTokens(authToken)
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
