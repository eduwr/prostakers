// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProStakers {
    address[] public stakers;
    uint public stakersCount = 0;
    mapping(address => bool) public isStaker;
    mapping(address => uint) public stakedAmount;

    event Deposit(address indexed _from, address indexed _to, uint _value);

    function deposit() public payable {
        require(msg.value >= 0.01 ether, "Minimum amount is 0.01");
        require(!isStaker[msg.sender], "Sender cannot be a staker");

        stakers.push(msg.sender);
        isStaker[msg.sender] = true;
        stakedAmount[msg.sender] = msg.value;
        stakersCount++;

        emit Deposit(msg.sender, address(this), msg.value);
    }

}
