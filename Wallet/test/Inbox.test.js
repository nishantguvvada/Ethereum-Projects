const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let inbox;

async function fetchAccounts() {
    listAccounts = await web3.eth.getAccounts();
    return listAccounts;
}

beforeEach(async ()=>{
    // get a list of all accounts
    // accounts = await web3.eth.getAccounts();
    accounts = await fetchAccounts();

    // use one of those accounts to deploy a contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hello world'] })
        .send({ from: accounts[0], gas: '1000000' })
});

describe('Inbox', ()=>{
    it('deploys a contract', () =>{
        assert.ok(inbox.options.address);
    });

    it('has a default message', async ()=>{
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hello world');
    });

    it("can change the message", async ()=>{
        await inbox.methods.setMessage('bye').send({ from: accounts[0] }); // sending a transaction returns a hash, .send code is not assigned to any variables to store the hash
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });

});