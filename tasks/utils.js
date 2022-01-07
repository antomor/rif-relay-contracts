const safeCoreSdk = require('@gnosis.pm/safe-core-sdk');
const { Web3Adapter } = safeCoreSdk;

const getTestTokenInstance = async (artifacts) => {
    const TestToken = artifacts.require('TestToken');
    const testTokenInstance = await TestToken.deployed();
    return testTokenInstance;
};

const getCollectorInstance = async (artifacts) => {
    const Collector = artifacts.require('Collector');
    const collectorInstance = await Collector.deployed();
    return collectorInstance;
};

const signWithAddress = async (web3, safeSdk, safeTransaction, owner) => {
    const ethAdapterOwner = new Web3Adapter({
        web3,
        signerAddress: owner
    });
    const safeSdk2 = await safeSdk.connect({
        ethAdapter: ethAdapterOwner,
        safeAddress: safeSdk.getAddress()
    });
    const txHash = await safeSdk2.getTransactionHash(safeTransaction);
    const approveTxResponse = await safeSdk2.approveTransactionHash(txHash);
    await approveTxResponse.transactionResponse?.wait();
};

const safeProxyFactoryAddress = '0x1938517B0762103d52590Ca21d459968c25c9E67';
const multiSendAddress = '0x89bac3BB0517F7Dc0E5E94265217A9Acc5cc489f';
const safeMasterCopyAddress = '0xB7a001eE69E7C1eef25Eb8e628e46214Ea74BF0F';
const contractNetworks = {
    33: {
        multiSendAddress,
        safeMasterCopyAddress,
        safeProxyFactoryAddress
    }
};

module.exports = {
    getTestTokenInstance,
    getCollectorInstance,
    signWithAddress,
    contractNetworks,
    safeMasterCopyAddress,
    safeProxyFactoryAddress
};