// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Import OpenZeppelin's proxy contracts
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";


/**
 * @title DLottery
 * @dev A decentralized lottery system with upgradeability
 */
contract DLottery is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, PausableUpgradeable {
    // State variables
    uint256 private drawId;
    uint256 private nextDrawTimestamp;
    uint256 private currentPrize;
    bool private drawCompleted;
    address private winner;

    // Max participants is 20
    uint8 private constant MAX_PARTICIPANTS = 20;

    // Array to store available ticket numbers
    uint8[] private availableTickets;

    // Mapping of ticket number to participant address
    mapping(uint8 => address) private ticketToParticipant;

    // Mapping to check if an address is already registered
    mapping(address => bool) private isParticipant;

    // Events
    event DrawCreated(uint256 indexed drawId, uint256 prize, uint256 drawTime);
    event ParticipantRegistered(uint256 indexed drawId, address participant, uint8 ticketNumber);
    event DrawResult(uint256 indexed drawId, uint8 winningTicket, address winner);
    event PrizeWithdrawn(uint256 indexed drawId, address winner, uint256 amount);
    event NewLotteryStarted(uint256 indexed drawId);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        
        // Transfer ownership to initialOwner after initialization
        _transferOwnership(initialOwner);

        drawId = 1;
        drawCompleted = true; // No active lottery initially
    }

    // Admin functions

    // function startNewLottery() external onlyOwner {
    //     require(drawCompleted, "Previous lottery still in progress");

    //     // Reset lottery state
    //     nextDrawTimestamp = 0;
    //     currentPrize = 0;
    //     drawCompleted = false;
    //     winner = address(0);

    //     // Reset participant tracking
    //     for (uint8 i = 1; i <= MAX_PARTICIPANTS; i++) {
    //         if (ticketToParticipant[i] != address(0)) {
    //             isParticipant[ticketToParticipant[i]] = false;
    //             ticketToParticipant[i] = address(0);
    //         }
    //     }

    //     // Reset available tickets
    //     delete availableTickets;
    //     for (uint8 i = 1; i <= MAX_PARTICIPANTS; i++) {
    //         availableTickets.push(i);
    //     }

    //     emit NewLotteryStarted(drawId);
    // }

    function uploadPrize() external payable onlyOwner {
        require(drawCompleted || currentPrize == 0, "Active lottery with prize already set");
        require(msg.value > 0, "Prize amount must be greater than 0");
        
        // Reset lottery state
        nextDrawTimestamp = 0;
        currentPrize = msg.value;
        drawCompleted = false;
        winner = address(0);

        // Reset participant tracking
        for (uint8 i = 1; i <= MAX_PARTICIPANTS; i++) {
            if (ticketToParticipant[i] != address(0)) {
                isParticipant[ticketToParticipant[i]] = false;
                ticketToParticipant[i] = address(0);
            }
        }

        // Reset available tickets
        delete availableTickets;
        for (uint8 i = 1; i <= MAX_PARTICIPANTS; i++) {
            availableTickets.push(i);
        }

        emit NewLotteryStarted(drawId);
    }

    function setDrawDate(uint256 timestamp) external onlyOwner {
        require(!drawCompleted, "No active lottery");
        require(currentPrize > 0, "Upload prize first");
        require(timestamp > block.timestamp, "Draw date must be in the future");

        nextDrawTimestamp = timestamp;

        emit DrawCreated(drawId, currentPrize, nextDrawTimestamp);
    }

    function performDraw() external onlyOwner nonReentrant {
        require(!drawCompleted, "No active lottery or draw already completed");
        require(nextDrawTimestamp > 0, "Draw date not set");
        require(block.timestamp >= nextDrawTimestamp, "Draw time not reached");

        // Generate a random winning ticket
        uint8 winningTicket = _getRandomTicket();

        // Get winner address (may be address(0) if ticket wasn't selected)
        address winnerAddress = ticketToParticipant[winningTicket];
        winner = winnerAddress;
        drawCompleted = true;

        emit DrawResult(drawId, winningTicket, winnerAddress);
    }

    // User functions

    function participate() external whenNotPaused {
        require(!drawCompleted, "No active lottery");
        require(nextDrawTimestamp > 0, "Draw not configured yet");
        require(block.timestamp < nextDrawTimestamp, "Registration period ended");
        require(!isParticipant[msg.sender], "Already registered");
        require(availableTickets.length > 0, "No tickets available");

        // Pick a random available ticket
        uint256 randomIndex = _getRandomNumber() % availableTickets.length;
        uint8 ticketNumber = availableTickets[randomIndex];

        // Remove the selected ticket from available tickets
        availableTickets[randomIndex] = availableTickets[availableTickets.length - 1];
        availableTickets.pop();

        // Register the participant
        ticketToParticipant[ticketNumber] = msg.sender;
        isParticipant[msg.sender] = true;

        emit ParticipantRegistered(drawId, msg.sender, ticketNumber);
    }

    function withdrawPrize() external nonReentrant {
        require(drawCompleted, "Draw not completed");
        require(winner == msg.sender, "Not the winner");
        require(currentPrize > 0, "No prize to withdraw");

        uint256 prize = currentPrize;
        currentPrize = 0;

        // Increment drawId for the next lottery
        drawId += 1;

        // Transfer the prize
        (bool sent,) = payable(msg.sender).call{value: prize}("");
        require(sent, "Failed to send prize");

        emit PrizeWithdrawn(drawId - 1, msg.sender, prize);
    }

    // View functions

    function getCurrentDrawInfo() external view returns (
        uint256 _drawId,
        uint256 _prize,
        uint256 _drawTime,
        bool _completed,
        address _winner
    ) {
        return (drawId, currentPrize, nextDrawTimestamp, drawCompleted, winner);
    }

    function getTicketInfo(uint8 ticket) external view returns (address participant) {
        require(ticket > 0 && ticket <= MAX_PARTICIPANTS, "Invalid ticket number");
        return ticketToParticipant[ticket];
    }

    function getRemainingTickets() external view returns (uint256) {
        return availableTickets.length;
    }

    function isRegistered(address user) external view returns (bool) {
        return isParticipant[user];
    }

    // Admin control
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Internal functions

    function _getRandomNumber() internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender
        )));
    }

    function _getRandomTicket() internal view returns (uint8) {
        // This returns a number between 1 and MAX_PARTICIPANTS
        return uint8((_getRandomNumber() % MAX_PARTICIPANTS) + 1);
    }
}
