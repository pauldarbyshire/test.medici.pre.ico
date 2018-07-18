// Tabulate 2D data
function tabulate(arr, element) {

  var tableDiv = document.getElementById(element);
  var table = document.createElement('table');
  var tableBody = document.createElement('tbody');

  table.border = '1';
  table.appendChild(tableBody);

  var heading = [];
  heading[0] = "Acc.";
  heading[1] = "Wallet Addr.";
  heading[2] = "Trxs";
  heading[3] = "ETH";
  //heading[4] = "MED";

  var data = [];

  for (i = 0; i < arr.length; i++)
      //data[i] = new Array(i, web3.eth.accounts[i], web3.eth.getTransactionCount(web3.eth.accounts[i]), arr[i], (arr[i] * 6088));
      data[i] = new Array(i, web3.eth.accounts[i], web3.eth.getTransactionCount(web3.eth.accounts[i]), arr[i]);

  // Table cols
  var tr = document.createElement('tr');
  tableBody.appendChild(tr);
  for (i = 0; i < heading.length; i++) {
      var th = document.createElement('th');
      th.width = '75';
      th.appendChild(document.createTextNode(heading[i]));
      tr.appendChild(th);
  }

  // Table rows
  for (i = 0; i < data.length; i++) {
      tr = document.createElement('tr');
      for (j = 0; j < data[i].length; j++) {
          var td = document.createElement('td');
          td.appendChild(document.createTextNode(data[i][j]));
          tr.appendChild(td);
      }
      tableBody.appendChild(tr);
  }
  tableDiv.appendChild(table);
}

// List data
function list(arr, element) {

  var html = '';
 
  for (var i=0; i<arr.length; i++)
     html += '<div>' + arr[i] + '</div>';
  
  var data = document.getElementById(element);
  data.innerHTML = html;
}

function getDetails (n) {
    
    switch (n) {
        case 0:
            val = crowdsale.totalTokensMintable();
            break;
        case 1:
            val = crowdsale.totalTokensForSale();
            break;
        case 2:
            val = crowdsale.tokensForStakeRewards();
            break;
        case 3:
            val = crowdsale.tokensForFounders();
            break;
        case 4:
            val = crowdsale.tokensForAdvisers();
            break;
        case 5:
            val = crowdsale.tokensForMarketing();
            break;
        case 6:
            val = crowdsale.tokensForDevelopment();
            break;
        case 7:
            val = crowdsale.tokensForAirdrops();
    }
    document.getElementById('getDetails').innerHTML = (val / 1e18).toLocaleString('en', { useGrouping: true }) +  ' MDI'; 
    var popup = document.getElementById('getDetails');
    popup.classList.toggle('show');
}

function getParams (n) {
    
    switch (n) {
        case 0:
            val = crowdsale.openingTime();
            break;
        case 1:
            val = crowdsale.closingTime();
            break;
        case 2:
            val = '1 ETH = ' +crowdsale.rate() + ' MDI';
            break;
        case 3:
            val = crowdsale.cap().toNumber() / 1e18 + ' ETH';
    }
    document.getElementById('getDetails').innerHTML = val; 
    var popup = document.getElementById('getDetails');
    popup.classList.toggle('show');
}

// As per Ethereum Improvement Proposal (EIP) 55
/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};