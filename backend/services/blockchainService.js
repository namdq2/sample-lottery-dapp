const ethers = require('ethers');
const lotteryController = require('../controllers/lotteryController');
const dotenv = require('dotenv');
dotenv.config();

// Replace with your actual contract ABI and address
const LOTTERY_CONTRACT_ABI = [
  // ABI will go here - this is just a placeholder
  "event DrawResult(uint256 indexed drawId, uint8 winningTicket, address winner)"
  // Add other events and functions based on your contract
];

const LOTTERY_CONTRACT_ADDRESS = process.env.LOTTERY_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

let provider;
let contract;

// Initialize provider and contract
const initializeBlockchainConnection = () => {
  try {
    // Use environment variables for network configuration
    const network = process.env.ETHEREUM_NETWORK || "amoy";
    const providerUrl = process.env.ETHEREUM_PROVIDER_URL || `https://${network}.infura.io/v3/YOUR_INFURA_KEY`;

    provider = new ethers.providers.JsonRpcProvider(providerUrl);
    contract = new ethers.Contract(LOTTERY_CONTRACT_ADDRESS, LOTTERY_CONTRACT_ABI, provider);

    console.log('Blockchain connection initialized');
  } catch (error) {
    console.error('Failed to initialize blockchain connection:', error);
  }
};

// Setup event listeners
const setupEventListeners = () => {
  try {
    initializeBlockchainConnection();

    // Listen for draw result events
    contract.on("DrawResult", async (drawId, winningTicket, winner, event) => {
      console.log(`Draw result event: Draw ID=${drawId}, Winning Ticket=${winningTicket}, Winner=${winner}`);

      // Convert from BigNumber if needed
      const drawIdNum = drawId.toNumber ? drawId.toNumber() : parseInt(drawId.toString());
      const winningTicketNum = winningTicket.toNumber ? winningTicket.toNumber() : parseInt(winningTicket.toString());

      // Update the draw result in our backend
      await lotteryController.updateDrawResult({
        params: { drawId: drawIdNum },
        body: {
          winningTicket: winningTicketNum,
          winner: winner
        }
      }, {
        status: () => ({
          json: () => {}
        })
      }, (err) => {
        if (err) console.error('Error updating draw result:', err);
      });
    });

    console.log('Event listeners setup complete');
  } catch (error) {
    console.error('Failed to setup event listeners:', error);
  }
};

// Get draw result from blockchain by draw ID
const getDrawResultFromBlockchain = async (drawId) => {
  try {
    if (!provider || !contract) {
      initializeBlockchainConnection();
    }

    // Query past events to find the draw result
    const filter = contract.filters.DrawResult(drawId);
    const events = await contract.queryFilter(filter);

    if (events.length === 0) {
      return null;
    }

    // Get the latest event for this draw
    const event = events[events.length - 1];
    const { winningTicket, winner } = event.args;

    return {
      winningTicket: winningTicket.toNumber ? winningTicket.toNumber() : parseInt(winningTicket.toString()),
      winner,
      resultTime: new Date()
    };
  } catch (error) {
    console.error(`Error fetching draw result from blockchain for draw ID ${drawId}:`, error);
    return null;
  }
};

module.exports = {
  setupEventListeners,
  getDrawResultFromBlockchain
};
