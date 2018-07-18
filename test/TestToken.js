function ether (n) {
    return new web3.BigNumber(web3.toWei(n, 'ether'));
}

function toNum (n) {
  return (n.toNumber() / 1e18);
}

const duration = {
    seconds: function (val) { return val; },
    minutes: function (val) { return val * this.seconds(60); },
    hours: function (val) { return val * this.minutes(60); },
    days: function (val) { return val * this.hours(24); },
    weeks: function (val) { return val * this.days(7); },
    years: function (val) { return val * this.days(365); },
};

function advanceBlock () {
    return new Promise((resolve, reject) => {
      web3.currentProvider.sendAsync({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: Date.now(),
      }, (err, res) => {
        return err ? reject(err) : resolve(res);
      });
    });
  }

// https://www.epochconverter.com/
function increaseTime (dur) {
    const id = Date.now();
  }
  
  function latestTime () {
    return web3.eth.getBlock('latest').timestamp;
  }
  
  function increaseTimeTo (target) {
    let now = latestTime();
    if (target < now) throw Error(`Cannot increase current time(${now}) to a moment in the past(${target})`);
    let diff = target - now;
    return increaseTime(diff);
  }

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const MediciCrowdsale = artifacts.require('MediciCrowdsale');
const MediciToken = artifacts.require('MediciToken');

contract('MediciCrowdsale', function ([owner, wallet, buyer]) {
    const RATE = new BigNumber(5000);
    const CAP = ether(20);

    before(async function () {
        // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
        await advanceBlock();
    });

    beforeEach(async function () {
        this.openingTime = latestTime() + duration.weeks(1);
        this.closingTime = this.openingTime + duration.weeks(1);
        this.afterClosingTime = this.closingTime + duration.seconds(1);

        this.token = await MediciToken.new({ from: owner });
        this.crowdsale = await MediciCrowdsale.new(this.openingTime, this.closingTime, RATE, wallet, CAP, this.token.address, { from: owner });
        await this.token.transferOwnership(this.crowdsale.address, { from: owner });
    });

    describe('Token initialisation', function () {
        it('should set amount Medici Tokens Mintable', async function () {
        const totalTokensMintable = await this.crowdsale.totalTokensMintable();
        assert.equal(toNum(totalTokensMintable), 750000000, 'Total amount of Medici Tokens Mintable should be 750,000,000');
        });

        it('should set amount Medici Tokens for Sale', async function () {
            const totalTokensForSale = await this.crowdsale.totalTokensForSale();
            assert.equal(toNum(totalTokensForSale), 375000000, 'Total amount of Medici Tokens for Sale should be 375,000,000');
        });

        it('should set amount Medici Tokens for Stake Rewards', async function () {
            const tokensForStakeRewards = await this.crowdsale.tokensForStakeRewards();
            assert.equal(toNum(tokensForStakeRewards), 75000000, 'Total amount of Medici Tokens for Stake Rewards should be 75,000,000');
        });

        it('should set amount of Medici Tokens for Founders', async function () {
            const tokensForFounders = await this.crowdsale.tokensForFounders();
            assert.equal(toNum(tokensForFounders), 150000000, 'Total amount of Medici Tokens for Founders should be 150,000,000');
        });

        it('should set amount Medici Tokens for Advisers', async function () {
            const tokensForAdvisers = await this.crowdsale.tokensForAdvisers();
            assert.equal(toNum(tokensForAdvisers), 30000000, 'Total amount of Medici Tokens for Advisers should be 30,000,000');
        });

        it('should set amount Medici Tokens for Marketing', async function () {
            const tokensForMarketing = await this.crowdsale.tokensForMarketing();
            assert.equal(toNum(tokensForMarketing), 60000000, 'Total amount of Medici Tokens for Marketing should be 60,000,000');
        });

        it('should set amount Medici Tokens Development', async function () {
            const tokensForDevelopment = await this.crowdsale.tokensForDevelopment();
            assert.equal(toNum(tokensForDevelopment), 22500000, 'Total amount of Medici Tokens for Development should be 22,500,000');
        });

        it('should set amount Medici Tokens Airdrops', async function () {
            const tokensForAirdrops = await this.crowdsale.tokensForAirdrops();
            assert.equal(toNum(tokensForAirdrops), 37500000, 'Total amount of Medici Tokens for Airdrops should be 37,500,000');
        });
    });
});