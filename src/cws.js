const { ChainId, Token, WETH, Fetcher, Route } = require('@uniswap/sdk');
const axios = require("axios");

let url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

// You might want to return the prices instead of printing
let getPrice = async function(chainId, cwsAddress) {    
    const CWS = new Token(chainId, cwsAddress, 18)
    
    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const pair = await Fetcher.fetchPairData(CWS, WETH[CWS.chainId])    

    const route = new Route([pair], WETH[CWS.chainId])    

    //let cwsToEth = route.midPrice.toSignificant(6); // 201.306    
    let ethToCws = route.midPrice.invert().toSignificant(6); // 0.00496756

    // Fetch the price of 1 eth
    const https = require('https');

    try {
	let priceChart = await axios.get(url);

	let ethPrice = priceChart.data.ethereum.usd;
	let cwsPrice = ethPrice * ethToCws;

	return {eth: ethPrice, cws: cwsPrice, invert: ethToCws};
    } catch(e) {

	return {eth: 0, cws: 0};
    }
};

module.exports = {
    getPrice: getPrice
};

