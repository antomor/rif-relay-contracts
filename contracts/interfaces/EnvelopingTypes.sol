// SPDX-License-Identifier:MIT
pragma solidity ^0.6.12;

import "./IForwarder.sol";

interface EnvelopingTypes {
    struct RelayData {
        uint256 gasPrice;
        uint256 pctRelayFee;
        uint256 baseRelayFee;
        bytes32 domainSeparator;
        address relayWorker;
        address callForwarder; 
        address callVerifier;
    }

    struct RelayRequest {
        IForwarder.ForwardRequest request;
        RelayData relayData;
    }

    struct DeployRequest {
        IForwarder.DeployRequest request;
        RelayData relayData;
    }
}
