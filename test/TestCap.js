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
    const lessThanCap = ether(10);

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

    describe('setting zero cap', function () {
        it('should fail with zero cap', async function () {
            await MediciCrowdsale.new(this.openingTime, this.closingTime, RATE, wallet, 0, this.token.address, { from: owner }).should.be.rejectedWith('revert');
        })
    });

    describe('accepting payments', function () {
        it('should accept payments within cap', async function () {
            await this.crowdsale.send(CAP.minus(lessThanCap)).should.be.fulfilled;
            await this.crowdsale.send(lessThanCap).should.be.fulfilled;
        });
    
        it('should reject payments outside cap', async function () {
            await this.crowdsale.send(CAP);
            await this.crowdsale.send(1).should.be.rejectedWith('revert');
        });
    
        it('should reject payments that exceed cap', async function () {
            await this.crowdsale.send(CAP.plus(1)).should.be.rejectedWith('revert');
        });
    });

    describe('ending', function () {
        it('should not reach cap if sent under cap', async function () {
          let capReached = await this.crowdsale.capReached();
          capReached.should.equal(false);
          await this.crowdsale.send(lessThanCap);
          capReached = await this.crowdsale.capReached();
          capReached.should.equal(false);
        });
    
        it('should not reach cap if sent just under cap', async function () {
          await this.crowdsale.send(CAP.minus(1));
          let capReached = await this.crowdsale.capReached();
          capReached.should.equal(false);
        });
    
        it('should reach cap if cap sent', async function () {
          await this.crowdsale.send(CAP);
          let capReached = await this.crowdsale.capReached();
          capReached.should.equal(true);
        });
    });
});