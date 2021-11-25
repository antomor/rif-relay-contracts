require('ts-node/register/transpile-only');

const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic =
    'digital unknown jealous mother legal hedgehog save glory december universe spread figure custom found six';

const secretMnemonicFile = './secret_mnemonic';
const fs = require('fs');
let secretMnemonic;
if (fs.existsSync(secretMnemonicFile)) {
    secretMnemonic = fs.readFileSync(secretMnemonicFile, { encoding: 'utf8' });
}

module.exports = {
    networks: {
        development: {
            verbose: process.env.VERBOSE,
            host: '127.0.0.1',
            port: 4444,
            network_id: 33,
            gas: 6300000,
            gasPrice: 60000000 // 0.06 gwei
        },
        regtest: {
            verbose: process.env.VERBOSE,
            host: '127.0.0.1',
            port: 4444,
            network_id: 33,
            gas: 6300000,
            gasPrice: 60000000 // 0.06 gwei
        },
        testnet: {
            provider: function () {
                return new HDWalletProvider(
                    mnemonic,
		    'http://127.0.0.1:4444'
                    //'https://public-node.testnet.rsk.co'
                );
            },
            network_id: 31,
            gas: 6300000,
            gasPrice: 60000000 // 0.06 gwei
        },
        mainnet: {
            provider: function () {
                return new HDWalletProvider(
                    secretMnemonic,
                    'https://public-node.rsk.co'
                );
            },
            network_id: 30,
            gas: 6300000,
            gasPrice: 60000000 // 0.06 gwei
        }
    },
    mocha: {
        slow: 1000,
        reporter: 'eth-gas-reporter',
        reporterOptions: {
            currency: 'USD',
            onlyCalledMethods: true,
            showTimeSpent: true,
            excludeContracts: []
        }
    },
    compilers: {
        solc: {
            version: '0.6.12',
            settings: {
                evmVersion: 'istanbul',
                optimizer: {
                    enabled: true,
                    runs: 200 // Optimize for how many times you intend to run the code
                }
            }
        }
    },
    migrations_directory: './migrations'
};
