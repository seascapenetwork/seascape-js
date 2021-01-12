let seascape = require("./src/seascape.js");

let printApy = async function(){
    let lpMining = seascape.gameById(1);
    await lpMining.loadContracts();
    
    // lp token address is a pair CWS-ETH on uniswap
    //let lpToken = "0x168840Df293413A930d3D40baB6e1Cd8F406719D";
    let lpToken = "0xdC935332D39a4C632864DBBED3CfDBf049FB9267";

    let cwsAddress = "0x168840Df293413A930d3D40baB6e1Cd8F406719D";

    // return last session for lp token
    let sessionId = await lpMining.setSessionId(lpToken);

    // session data
    let session = await lpMining.setSession(sessionId);
    
    // finally, can show APY
    let prices = await seascape.cws.getPrice(lpMining.networkId, cwsAddress);

    let apy = await lpMining.setApy(session, prices.cws);
    console.log(`APY: ${apy} %`);
};

printApy();

var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('dist'));

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8080);

