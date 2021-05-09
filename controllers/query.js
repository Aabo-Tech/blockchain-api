'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'first-network', 'connection-org1.json');
const CHAINCODE_NAME = "vaxpassport"
const REAL_WALLET_PATH = "controllers/wallet"

async function readPassport(id,user) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), REAL_WALLET_PATH);
        const wallet = new FileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(user);
        if (!userExists) {
            console.log('An identity for the user '+user+' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract(CHAINCODE_NAME);
        // Get the result and send it back
        const result = await contract.evaluateTransaction('readPassport',id);
        return JSON.parse(result)

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return error
    }
}

async function getHistoryForPassport(id,user) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), REAL_WALLET_PATH);
        const wallet = new FileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(user);
        if (!userExists) {
            console.log('An identity for the user '+user+' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract(CHAINCODE_NAME);
        // Get the result and send it back
        const result = await contract.evaluateTransaction('getHistoryForPassport',id);
        return JSON.parse(result)

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return error
    }
}

module.exports = {
    readPassport,
    getHistoryForPassport
}