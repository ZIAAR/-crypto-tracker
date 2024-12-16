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
