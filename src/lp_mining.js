let blockchain = require("./blockchain.js");
let fs = require("fs");
let cws = require("./cws.js");

// address and abi of second game: nft rush
var artifact = JSON.parse(fs.readFileSync("./src/abi/Staking.json", "utf8"));
var wethArtifact = JSON.parse(fs.readFileSync("./src/abi/weth.json", "utf8"));

module.exports = {
    loadContracts: async function() {
	let networkId = await blockchain.web3.eth.net.getId();
	this.networkId = networkId;

	// Game 1.
	this.address = artifact.networks[networkId].address;
	this.contract = await blockchain.loadContract(
	    blockchain.web3,
	    this.address, artifact.abi);	

        // WETH to calculate APY in the game   
	this.wethAddress = wethArtifact.networks[networkId].address;
	this.wethContract = await blockchain.loadContract(
	    blockchain.web3,	    
	    this.wethAddress, wethArtifact.abi);
    },

    /**
     * Return last active session Id
     *
     * @param lpToken return for lp token
     */
    setSessionId: async function(lpToken) {
	if (this.contract == undefined) {
	    throw "no abi was loaded for contract";
	}
	
	let sessionId = await this.contract.methods.lastSessionIds(lpToken).call();

	if (sessionId == undefined) {
	    throw "no session found in contract";
	} else {
	    this.sessionId = parseInt(sessionId);
	    return this.sessionId;
	}
    },

    /**
     * Load session data
     */
    setSession: async function(sessionId) {
	let session = await this.contract.methods.sessions(sessionId).call();

	this.session = session;
	return session;
    },

    /**
     * APY: it depends on shares and claimed token amount
     */
    setApy(session, cwsPrice = 1) {
	let amount = parseFloat(blockchain.web3.utils.fromWei(session.amount));
	let claimed = parseFloat(blockchain.web3.utils.fromWei(session.claimed));

	if (amount == 0) {
	    return 0;
	}

	let startUnix = parseInt(session.startTime);
	let period = parseInt(session.period);
	let endUnix = period + startUnix;
	let startTime = new Date(startUnix * 1000);
	// Event didn't start yet
	if (startTime > Date.now()) {
	    return 0;
	}

	let endTime = new Date(endUnix * 1000);
	// Event finished
	if (endTime < Date.now()) {
	    return 0;
	}

	//--------------------
	// APY Calculation
	//--------------------

	let cwsSupply = parseFloat(blockchain.web3.utils.fromWei(session.totalReward));

	// Reward per second:
	let rewardUnit = cwsSupply/period;
		
	// units per year, units are seconds
	let annualUnits = 31556952;  // 1 year in seconds
	let annualReward = rewardUnit * annualUnits * cwsPrice;
	let apy = (annualReward/amount)*100;

	return apy;
    }
};
