// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMyERC20Token is IERC20 {
    function mint(address to, uint256 amount) external;
}

contract TokenSale {
    uint256 public ratio;
    IMyERC20Token public paymentToken; // So here whe use the interface so we can access to the mint function

    constructor(uint256 _ratio, address _paymentToken) {
        ratio = _ratio;
        paymentToken = IMyERC20Token(_paymentToken);
    }

    function buyTokens() public payable {
        uint256 paymentReceived = msg.value;
        uint256 amountToBeGiven = paymentReceived / ratio; // This problem is about rounding  , There's no floats
        paymentToken.mint(msg.sender, amountToBeGiven);
    }

    function burnTokens(uint256 amount) public {
        // Patter pull over Push Pattern
        paymentToken.transferFrom(msg.sender, address(this), amount);
    }
}
