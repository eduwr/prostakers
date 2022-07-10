// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProStakers {
    uint public stakersCount = 0;
    mapping(address => bool) public isStaker;
    mapping(address => uint) public stakedAmount;

    event Deposit(address indexed _from, address indexed _to, uint _value);
    event Withdraw(address indexed _from, address indexed _to, uint _value);

    modifier minimumAmount(uint _amount) {
        require(_amount >= 0.01 ether, "Minimum amount is 0.01 ETH");
        _;
    }

    function deposit() public payable minimumAmount(msg.value) {
        if (!isStaker[msg.sender]) {
            stakersCount++;
            isStaker[msg.sender] = true;
        }

        stakedAmount[msg.sender] = stakedAmount[msg.sender] + msg.value;

        emit Deposit(msg.sender, address(this), msg.value);
    }

    function withdraw(uint _amount) public payable minimumAmount(_amount) {
        require(isStaker[msg.sender], "You must be a staker");
        require(stakedAmount[msg.sender] >= _amount, "You don't have enought funds.");

        stakedAmount[msg.sender] = stakedAmount[msg.sender] - _amount;

        (bool success,) = (msg.sender).call{value : _amount}("");
        require(success, "Failed to withdraw money from contract.");

        emit Withdraw(address(this), msg.sender, _amount);

        if (stakedAmount[msg.sender] == 0) {
            isStaker[msg.sender] = false;
            stakersCount--;
        }
    }

    function getStakedBalance() public view returns (uint) {
        return stakedAmount[msg.sender];
    }


}
