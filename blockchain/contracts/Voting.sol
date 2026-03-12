// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedCandidateId;
    }

    address public admin;
    bool public electionStarted;
    bool public electionEnded;

    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    uint256 public candidatesCount;

    event Voted(address indexed voter, uint256 indexed candidateId);
    event ElectionStarted();
    event ElectionEnded();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    constructor() {
        admin = msg.sender;
        electionStarted = false;
        electionEnded = false;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        require(!electionStarted, "Cannot add candidates after election starts");
        candidatesCount++;
        candidates.push(Candidate(candidatesCount, _name, 0));
    }

    function startElection() public onlyAdmin {
        require(!electionStarted, "Election already started");
        electionStarted = true;
        emit ElectionStarted();
    }

    function endElection() public onlyAdmin {
        require(electionStarted, "Election not started yet");
        require(!electionEnded, "Election already ended");
        electionEnded = true;
        emit ElectionEnded();
    }

    function vote(uint256 _candidateId) public {
        require(electionStarted, "Election has not started");
        require(!electionEnded, "Election has ended");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;
        candidates[_candidateId - 1].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getResult(uint256 _candidateId) public view returns (uint256) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        return candidates[_candidateId - 1].voteCount;
    }
}