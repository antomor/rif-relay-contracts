const collector = '0xdac5481925A298B95Bf5b54c35b68FC6fc2eF423';
const multisigOwner = '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826';
const relayOperator = '0x3BFFdaE0D62b8A745337a85738dC18C0A23F78DB'; // no balance
// const relayOperator = '0x7986b3DF570230288501EEa3D890bd66948C9B79'; // regtest accounts
const walletProvider = '0x0a3aA774752ec2042c46548456c094A76C7F3a79';
const liquidityProvider = '0xCF7CDBbB5F7BA79d3ffe74A0bBA13FC0295F6036';
const iovLabsRecipient = '0x39B12C05E8503356E3a7DF0B7B33efA4c054C409';

module.exports = async (callback) => {
    var accounts = await web3.eth.getAccounts();
    console.log('At the beginning...');
    await printBalances();

    const collectorArtifact = artifacts.require('Collector');
    const collectorAbi = collectorArtifact.abi;
    const collectorContract = await new web3.eth.Contract(
        collectorAbi,
        collector
    );
    console.log('Before the collector receives some funds...');
    await web3.eth.sendTransaction({
        from: accounts[0],
        to: collector,
        value: web3.utils.toWei('1')
    });
    console.log('After the collector receives some funds...');
    await printBalances();
    try {
        const tx = collectorContract.methods.withdraw();
        // console.log(tx);
        const txReceipt = await successfulTransaction(tx, collectorContract);
        // const txReceipt = await failingTransaction(tx);
        console.log('txReceipt', txReceipt);
        if (!txReceipt || !txReceipt.status) {
            callback(new Error(`Transaction ${txReceipt.tx} failed`));
        }
        console.log('After collector withdraw...');
        await printBalances();
        callback();
    } catch (error) {
        console.error(error);
        callback(error);
    }
};

async function failingTransaction(tx) {
    return await tx.send({ from: multisigOwner });
}

async function successfulTransaction(tx, collectorContract) {
    const gasEstimation = await collectorContract.methods
        .withdraw()
        .estimateGas({ from: multisigOwner });
    const additionalGas = 2253; // with 0 balance accounts, tx succeed
    // const additionalGas = 0;
    console.log('gasEstimation, additionalGas', gasEstimation, additionalGas);
    return await tx.send({
        from: multisigOwner,
        gas: gasEstimation + additionalGas
    });
}

async function printBalances() {
    var collectorBalance = web3.utils.fromWei(
        await web3.eth.getBalance(collector)
    );
    var multisigOwnerBalance = web3.utils.fromWei(
        await web3.eth.getBalance(multisigOwner)
    );
    var relayOperatorBalance = web3.utils.fromWei(
        await web3.eth.getBalance(relayOperator)
    );
    var walletProviderBalance = web3.utils.fromWei(
        await web3.eth.getBalance(walletProvider)
    );
    var liquidityProviderBalance = web3.utils.fromWei(
        await web3.eth.getBalance(liquidityProvider)
    );
    var iovLabsRecipientBalance = web3.utils.fromWei(
        await web3.eth.getBalance(iovLabsRecipient)
    );
    var balances =
        'collectorBalance: ' +
        collectorBalance +
        '\n' +
        'multisigOwnerBalance: ' +
        multisigOwnerBalance +
        '\n' +
        'relayOperatorBalance: ' +
        relayOperatorBalance +
        '\n' +
        'walletProviderBalance: ' +
        walletProviderBalance +
        '\n' +
        'liquidityProviderBalance: ' +
        liquidityProviderBalance +
        '\n' +
        'iovLabsRecipientBalance: ' +
        iovLabsRecipientBalance;
    console.log(balances);
}
