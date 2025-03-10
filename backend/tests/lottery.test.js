const lotteryController = require('../controllers/lotteryController');

// Mock response and next function
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Lottery Controller', () => {
  beforeEach(() => {
    // Reset data before each test
    lotteryController.resetData();
  });

  test('Should create a new draw', async () => {
    const req = {
      body: {
        drawId: 1,
        prize: '0.01',
        drawDate: '2023-12-31T23:59:59Z'
      }
    };
    const res = mockResponse();

    await lotteryController.saveDraw(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({
        id: 1,
        prize: '0.01'
      })
    });
  });

  test('Should get all draws', async () => {
    // First create a draw
    const createReq = {
      body: {
        drawId: 1,
        prize: '0.01',
        drawDate: '2023-12-31T23:59:59Z'
      }
    };
    await lotteryController.saveDraw(createReq, mockResponse(), mockNext);

    // Then get all draws
    const req = {};
    const res = mockResponse();

    await lotteryController.getAllDraws(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          prize: '0.01'
        })
      ])
    });
  });

  test('Should get a draw by ID', async () => {
    // First create a draw
    const createReq = {
      body: {
        drawId: 1,
        prize: '0.01',
        drawDate: '2023-12-31T23:59:59Z'
      }
    };
    await lotteryController.saveDraw(createReq, mockResponse(), mockNext);

    // Then get the draw by ID
    const req = {
      params: {
        drawId: '1'
      }
    };
    const res = mockResponse();

    await lotteryController.getDrawById(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({
        id: 1,
        prize: '0.01'
      })
    });
  });

  test('Should update draw result', async () => {
    // First create a draw
    const createReq = {
      body: {
        drawId: 1,
        prize: '0.01',
        drawDate: '2023-12-31T23:59:59Z'
      }
    };
    await lotteryController.saveDraw(createReq, mockResponse(), mockNext);

    // Then update the draw result
    const req = {
      params: {
        drawId: '1'
      },
      body: {
        winningTicket: 7,
        winner: '0xabc123...'
      }
    };
    const res = mockResponse();

    await lotteryController.updateDrawResult(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({
        id: 1,
        result: expect.objectContaining({
          winningTicket: 7,
          winner: '0xabc123...'
        })
      })
    });
  });
});
