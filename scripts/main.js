document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    document.head.appendChild(style);

    updatePrices(); // Update immediately when the page loads
    setInterval(updatePrices, 300000); // Update every 5 minutes
    startTicker(); // Start the ticker effect
});

// Object to map common coin names to their tickers
const coinTickerMap = {
    'Bitcoin': 'BTC',
    'Ethereum': 'ETH',
    'Cardano': 'ADA',
    'Polkadot': 'DOT',
    'Solana': 'SOL',
    'XRP': 'XRP',
    'BNB': 'BNB',
    'Dogecoin': 'DOGE',
    'Chainlink': 'LINK',
    'Litecoin': 'LTC',
    'Bitcoin Cash': 'BCH',
    'Stellar': 'XLM',
    'Vechain': 'VET',
    'Ethereum Classic': 'ETC',
    'TRON': 'TRX',
    'Tezos': 'XTZ',
    'EOS': 'EOS',
    'Neo': 'NEO',
    'Monero': 'XMR',
    'Cosmos': 'ATOM',
    'Toncoin': 'TON',
    'Avalanche': 'AVAX',
};

// Function to retrieve the ticker symbol for a coin
function getTicker(coinName) {
    return coinTickerMap[coinName] || 'N/A'; // Return 'N/A' if the ticker is not found
}

// Update the updatePrices function to include clickable functionality
function updatePrices() {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false')
    .then(response => response.json())
    .then(coins => {
        const container = document.getElementById('coin-container');
        container.innerHTML = ''; // Clear previous entries
        coins.forEach(coin => {
            if (['tether', 'usd-coin', 'dai', 'terrausd', 'wrapped-bitcoin', 'shiba-inu', 'staked-ether' ].includes(coin.id)) return; // Skip stablecoins or specific coins

            const ticker = getTicker(coin.name);
            const priceChange = coin.price_change_percentage_24h;
            const color = priceChange < 0 ? 'rgb(243, 63, 63)' : 'rgb(51, 204, 51)';
            const formattedPriceChange = priceChange < 0 ? `(${formatNumber(-priceChange)}%)` : formatNumber(priceChange) + '%';

            const coinDiv = document.createElement('div');
            coinDiv.className = 'coin';
            coinDiv.setAttribute('data-ticker', coin.id); // Use coin.id or another unique identifier
            coinDiv.innerHTML = `
                <div class="coin-header">
                    <h2>${ticker}</h2>
                    <p style="color: ${color};">$${formatNumber(coin.current_price)}</p>
                </div>
                <div class="coin-info">
                    <a id="change-${ticker}">
                        24hr Change: <span style="color: ${color};">${formattedPriceChange}</span>
                    </a>
                    <a>Market Cap: $${formatBillion(coin.market_cap)} Billion</a>
                </div>
            `;
            container.appendChild(coinDiv);
        });
    })
    .catch(error => console.error('Failed to fetch coin data:', error));
}

// Redirect to CoinMarketCap page when a coin is clicked
document.getElementById('coin-container').addEventListener('click', function(event) {
    let target = event.target;
    while (target != null && !target.classList.contains('coin')) {
        target = target.parentNode; // Traverse up to find the .coin element if nested elements are clicked
    }
    if (target) {
        const ticker = target.getAttribute('data-ticker');
        if (ticker) {
            window.open(`https://coinmarketcap.com/currencies/${ticker}/`, '_blank'); // Open CoinMarketCap page in a new tab
        }
    }
});



function formatNumber(value) {
    // Check if the value is defined and is a number
    if (value === undefined || isNaN(value)) return 'N/A';
    return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatBillion(value) {
    // Convert to billions and format, or return 'N/A' if undefined
    return value ? (value / 1e9).toFixed(2) : 'N/A';
}

function startTicker() {
    const container = document.getElementById('coin-container');
    const originalContent = container.innerHTML; // Store the original content for cloning
    container.innerHTML += originalContent; // Double the content by appending a clone of itself

    let timer = setInterval(() => {
        if (container.scrollLeft < container.scrollWidth / 2) {
            container.scrollLeft += 1; // Move scroll position smoothly
        } else {
            container.scrollLeft = 0; // Reset scroll position to start when halfway through
        }
    }, 10); // Adjust speed of scrolling as necessary

    // Optional: Clear the interval when not visible to save performance
    window.onblur = function() {
        clearInterval(timer);
    };
    window.onfocus = function() {
        timer = setInterval(() => {
            if (container.scrollLeft < container.scrollWidth / 2) {
                container.scrollLeft += 1;
            } else {
                container.scrollLeft = 0;
            }
        }, 10);
    };
}



