const { getDrawResultFromBlockchain } = require('../services/blockchainService');

// In-memory storage for draws
let draws = [];

// Get all draws history
exports.getAllDraws = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: draws });
  } catch (error) {
    next(error);
  }
};

// Get a specific draw by ID
exports.getDrawById = async (req, res, next) => {
  try {
    const drawId = parseInt(req.params.drawId);
    
    // Find the draw in memory
    const draw = draws.find(d => d.id === drawId);
    
    // If draw not found or no result yet, try to get from blockchain
    if (!draw || !draw.result) {
      const blockchainResult = await getDrawResultFromBlockchain(drawId);
      
      if (blockchainResult) {
        // If we found a result in blockchain but not in memory, update memory
        if (draw && !draw.result) {
          draw.result = blockchainResult;
        }
        
        return res.status(200).json({
          success: true,
          data: draw || { id: drawId, result: blockchainResult }
        });
      }
      
      // If not found in memory or blockchain
      if (!draw) {
        return res.status(404).json({
          success: false,
          error: `Draw with ID ${drawId} not found`
        });
      }
    }
    
    res.status(200).json({ success: true, data: draw });
  } catch (error) {
    next(error);
  }
};

// Save new draw data
exports.saveDraw = async (req, res, next) => {
  try {
    const { drawId, prize, drawDate } = req.body;
    
    if (!drawId || !prize || !drawDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide prize and drawDate'
      });
    }
    
    const draw = draws.find(d => d.id === drawId);
    if (draw) {
      return res.status(400).json({
        success: false,
        error: `Draw with ID ${drawId} already exists`
      });
    }

    const newDraw = {
      id: drawId,
      prize,
      drawDate: new Date(drawDate),
      participants: [],
      result: null,
      createdAt: new Date()
    };
    
    draws.push(newDraw);
    
    res.status(201).json({
      success: true,
      data: newDraw
    });
  } catch (error) {
    next(error);
  }
};

// Update draw with result
exports.updateDrawResult = async (req, res, next) => {
  try {
    const drawId = parseInt(req.params.drawId);
    const { winningTicket, winner } = req.body;
    
    const draw = draws.find(d => d.id === drawId);
    
    if (!draw) {
      return res.status(404).json({
        success: false,
        error: `Draw with ID ${drawId} not found`
      });
    }
    
    draw.result = {
      winningTicket,
      winner,
      resultTime: new Date()
    };
    
    res.status(200).json({
      success: true,
      data: draw
    });
  } catch (error) {
    next(error);
  }
};

// Reset all data (for testing purposes)
exports.resetData = () => {
  draws = [];
};

// Export draws for testing
exports.getDraws = () => draws;
