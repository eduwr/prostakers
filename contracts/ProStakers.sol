// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ProStakers {
    address[] public stakers;
    mapping(address => bool) public isStaker;
    mapping(address => uint) public stakedAmount;

    function deposit() public payable {
        require(msg.value >= 0.01 ether, "Minimum amount is 0.01");

        stakers.push(msg.sender);
        isStaker[msg.sender] = true;
        stakedAmount[msg.sender] = msg.value;
    }
}
