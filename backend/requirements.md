# Full Stack Web3 Developer Assessment Exercise
This exercise tests a comprehensive set of skills needed for web3 development including Solidity
programming, React development, Web3 integration, security considerations, and user experience design.

Technology Stack t  - be used:
- Blockchain (Testnet): Ethereum Sepolia, Arbitrum Sepolia, Polygon, compatible EVM…
- Smart Contract coding: Solidity , Hardhat/Truffle
- Front End coding: React, Next.js, TailwindCSS, Ethers.js
- Backend coding: NodeJS ; Express, Web3.js/Ethers.js
- Database: N/A
## Project: Decentralized Lottery Application (DLottery)
Create a decentralized lottery web application with the following requirements:
- The web application is built in one unique same page
- The web page has a button t  - connect a crypt  - wallet (Metamask)
### - Setting the lottery for the next draw
  - The upper part of the UI shows the settings for the admin t  - set the next lottery draw
  - The lottery administrator (the admin user) connects his metamask wallet (with a Connect
button). The wallet address must be the owner of the smart contract t  - be able t  - set the
lottery parameters.
  - When the crypt  - wallet is connected, it enables a button “New Lottery Draw”
  - Clicking on “New Lottery Draw” trigger the display of 3 buttons : “Upload Prize” (enabled) ,
“Set Date Next Draw” (disabled) and “Perform Draw” (disabled). “New Lottery Draw”
become then disabled until the current draw has been done and the prize has been
claimed/withdrawn.
    - Click on “Upload Prize”: the admin need t  - sign a transaction of 0.01 ETH (or any
custom amount) t  - be sent t  - the Smart Contract. That prize is stored in the contract.
Click on “Upload Prize” must be done first. Then it enable the button “Set Date Next
Draw”. Uploading the prize will trigger the display in the bottom End User part
“Next Lottery Draw: ” , “Prize: 0.01 ETH” (or any custom amount)
    - Click on “Set Date Next Draw”: set the date and time of the next draw. This is stored
in the contract. It will trigger the display in the bottom End User part, close t  - “Next
Lottery Draw ” with the date time of the draw, and als  - a countdown t  - the draw time.
### - End User registration t  - participate t  - the next draw
  - The bottom part of the UI shows the list of 20 tickets [1-20] in a table with in the first column
the ticket number, in the second column the wallet addresses of the participants matching
with each ticket number.
  - The end user connects his metamask wallet (with a Connect button).
  - When the crypt  - wallet is connected, it enables a button “Participate t  - next draw” (the Draw
setting need t  - be completed by the Admin first before t  - enable the button “Participate to
next draw”)
  - The end user clicks on “Participate t  - next draw”. It registers the wallet address in the smart
contract draw list. An address can register only 1 time t  - the same draw. A same wallet
address that try t  - register more than 1 time will be rejected with a relevant message.
  - Not more than 20 participants can register (only 20 tickets available)
  - Each time a participant registers, calling the contract, in return he get a random ticket number
and his wallet address is added in the UI in the table associated with the random ticket
number among the remaining available tickets.
### - Lottery Draw
  - When the countdown reach 00:00:00, the participants cannot register anymore and the button
“Perform Draw” become enabled.
  - The lottery administrator (the admin user) connects his metamask wallet. The wallet address
must be the owner of the smart contract.
  - The lottery administrator clicks on “Perform Draw”. It calls the contract, pick a random
number between 1-20 and set the value as the result of the draw. It emits an event with the
result of the draw. Each Draw should have a unique ID. That ID is used in the event.
  - If the admin try t  - perform the draw before the planned date, it will return an error. The draw
can only be done 1 time with a ticket number result and a winner or n  - winner.
  - The Front End UI send requests regularly t  - BE with DrawId t  - get the result of the draw and
display the winner in the UI.
    - If the random picked number has n  - participant registered with, the UI will display
something like “Result of the Draw: N  - Winner”
    - If the random picked number has a participant registered with, the UI will display
something like “Result of the Draw: [eth_address] wins 0.01 ETH.
Congratulations !!!”
    - The wining number and associated address in the table are highlighted in a flashy
colour.
    - After the Draw is done and the winner is known, a “Withdraw Prize” button is
enabled.
### - Withdraw the Prize
  - The end user connects his metamask wallet.
  - When the user click on “Withdraw Prize”, if the wallet address match with the winner of the
draw, then the user can withdraw from the contract the prize 0.01 ETH t  - his wallet.
  - If a user try t  - withdraw the prize and he is not the winner he get a relevant error message in
return
  - When the winner has successfully withdraw the prize or there is n  - winner, then:
    - The button “New Lottery Draw” become enabled.
    - When the admin click on “New Lottery Draw” then:
- All settings in the contract for the current draw are cleared (list of participants,
prize, draw date, …)
- The bottom part of the UI for end users is cleared with previous draw result
- The page is ready for a new lottery draw and the admin can set the new draw

## Smart Contract Requirements
- Create a Solidity smart contract that allows:
  - Creation of a draw with datetime
  - Receiving and store the prize 0.01 ETH (or any custom amount) in the contract (payable
contract)
  - User registration and verification (can use a simple whitelist approach)
  - Secure registration functionality with protection against double-registration
  - Emit an event with the result when the draw is performed
  - The winner t  - withdraw/claim the prize
## Frontend Requirements
- Build a responsive React web application that:
  - Connects t  - the user's Web3 wallet (MetaMask, etc.)
  - Allows Admin t  - set lottery draw in the top part of the page
  - Allows users in the bottom part of the page:
    - t  - participate t  - a draw
    - see the countdown t  - the draw until reach 00:00:00
    - see the result of the draw
    - winner can claim the prize
  - Provides a clean, intuitive UI in one unique page
  - Display proper loading/busy icon in UI during blockchain interactions (t  - make understand
the user t  - be patient while waiting for the answer)
## Backend/Integration Requirements
- Create a simple API t  - handle FE requests. List of the BE end points:
  - Save Draw data and result in BE memory (array). Each Draw is identified by a unique ID.
(data is cleared/lost each time the BE is restarted).
  - Get Draws history
  - Get the result of a draw using the DrawId. The backend will try t  - look in the list of emitted
past draw events t  - get the result and return it t  - FE. It will return null otherwise.
- Implement proper error handling
- Create an event listener that catch useful inf  - when draw blockchain events occur (for UI display
when needed)
- Include unit tests for both the smart contract and frontend components

## Bonus
- If time allows it: display at the bottom of the web page the history of the previous draws with the
DrawID, date, prize, winner.

## Evaluation Criteria
- Code Quality: Clean, modular, and well-documented code.
- Functionality: All features work as expected.
- Smart contract security: Prevent re-entrancy, double registration, and unauthorized actions.
- User Experience: Smooth UI with error handling.
- UI/UX: design and responsiveness
- Proper use of Web3 libraries and patterns
- Testing coverage
