
const { default: BigNumber } = require("bignumber.js")
var Web3 = require("web3")
const Tx = require('ethereumjs-tx').Transaction;

var _20abi = require("../build/contracts/XENCrypto.json")['abi']

var ownerKey = "***"

var chain_name = "goerli"
var provider = new Web3.providers.HttpProvider("https://goerli.infura.io/v3/8b37038648e54752892337a023898054")

var web3 = new Web3(provider)
var gldtoken = new web3.eth.Contract(_20abi, "0x2787f70BEA35EC1D47EA480E44f5E3BaBE3946f1", {
    from: 0,
    gasPrice: '21808007493'
})



async function setValue(prikey) {
    const privateKey = Buffer.from(prikey, 'hex');

    const walletAccount = web3.eth.accounts.privateKeyToAccount(prikey);
    console.log("address: ",walletAccount.address)

    let nonce = await web3.eth.getTransactionCount(walletAccount.address)
    console.log('get nonce:', nonce)

    let bn = web3.utils.toBN(0.035*(10**18))
    console.log('bn=====', bn.toString())
    let data = await gldtoken.methods.relayMint(bn.toString()).encodeABI()
    console.log(data)

    const txParams = {
        from: walletAccount.address,
        nonce: web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(500000), 
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        to: "0x2787f70BEA35EC1D47EA480E44f5E3BaBE3946f1",
        data: data
    }
    const tx = new Tx(txParams, {'chain':chain_name})
    // const tx = new Tx(txParams)
    tx.sign(privateKey)

    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')
    console.log(raw)
    web3.eth.sendSignedTransaction(raw)
        .on('transactionHash', function(hash) {
            console.log('tx hash:', hash)
        })
        .on('receipt', function(receipt) {
            console.log('tx receipt:', receipt)
        })
        .on('error', console.error)
}


setValue(ownerKey)