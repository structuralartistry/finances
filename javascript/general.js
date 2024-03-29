// syntax
// TRANSACTIONS
//   date
//   [reconciled(x)] [date] amount category account /currency_divisor "notes"
// note: not doing anything with reconciled or notes... use string.split(',', limit) to get notes
// possibly use currency divisor, where would be the amout the amount is divided by to normalize in grand total and categories

//text file >
//parse raw >
//  determine section
//  if section is transactions
//    determine row type
//      date only > set current date
//      transaction row
//        parse row
//          if does not have date then date is the set current date
//          if does not have reconciled then is false
//        ?
//      empty > discard
//      bad > output
//
//  if section is categories
//
//  if section is account
//
//
//strategy: comment out to simplest (parseTransactionRow), get working and build up from there...

var currentDate, errorOutput, categorySums, accountSums, grandSum;
var formattingDelimiter = '|';

function initializeValues () {
  errorOutput=[];
  categorySums={};
  accountSums={};
  grandSum=0;
}

$.strPad = function(i,l,s) {
  var o;
  o = i.toString();
  if (!s) { s = '0'; }
  while (o.length < l) {
    o = s + o;
  }
  return o;
};

var MyDate = function (dateString) {
  // expect incomming in '6/2/2012' format
  var parsedDate;
  parsedDate = dateString.split('/');
  return new Date(parsedDate[2], Number(parsedDate[0])-1, parsedDate[1]);
}

var Transaction = function () {
  var transaction = {
    reconciled: false,
    date: '',
    amount: 0,
    category: '',
    account: '',
    currencyDivisor: 1,
    notes: ''
  }

  transaction.adjustedAmount = function () {
    return this.amount/this.currencyDivisor;
  }

  transaction.setAmount = function (rawAmount) {
    this.amount = parseAmount(rawAmount);
  }

  return transaction;
}

function formatInDecimal(amountString) {
  if(amountString.trim()=='') return '0.00';
  if(parseInt(amountString)==0) return '0.00';

  var split = amountString.split(/(\d\d)$/);
  return split[0] + '.'+ split[1];
}

function processDataInput () {
  var transactionsData, formattedOutput, parsedTransactions;
  initializeValues();
  transactionsData = $('#dataInput').val();
  parsedTransactions = parseTransactions(transactionsData);
  formattedOutput = formatTransactionsOutput(parsedTransactions);
  $('#dataOutput').html(formattedOutput);
  $('#sumsOutput').html(formatSumsOutput());
  $('#errorOutput').html(errorOutput.join('\n'));
}

function getCurrentDate () {
  if(currentDate===undefined) setCurrentDate(new Date());
  return currentDate;
}

function setCurrentDate (date) {
  currentDate = date;
}

function formatDateString (date) {
  return (date.getMonth()+1).toString() + '/' + (date.getDate()).toString() + '/' + date.getFullYear().toString();
}

function formatSumsOutput () {
  var formattedOutput='', categoryGrandSum=0, categorySum=0, percentOfTotal;
  formattedOutput += 'GRAND SUM' + '\n';
  formattedOutput += $.strPad(' ', 20, ' ') + formattingDelimiter + $.strPad(formatInDecimal(grandSum.toString()), 15, ' ') + '\n';

  formattedOutput += 'ACCOUNTS' + '\n';
  Object.keys(accountSums).sort().forEach( function(key) {
    formattedOutput += $.strPad(key, 20, ' ') + formattingDelimiter +  $.strPad(formatInDecimal(accountSums[key].toString()), 15, ' ') + '\n';
  });

  categoryGrandSum = getGrandSum(categorySums)
  formattedOutput += 'CATEGORIES' + '\n';
  Object.keys(categorySums).sort().forEach( function(key) {
    categorySum = categorySums[key];
    if(key[0]!='@') {
      percentOfTotal = ((categorySum/categoryGrandSum)*100).toString().match(/\d+/)[0] + '%';
      formattedOutput += $.strPad(key, 20, ' ') + formattingDelimiter +  $.strPad(formatInDecimal(categorySum.toString()), 15, ' ') + formattingDelimiter +  $.strPad(percentOfTotal, 8, ' ') + '\n';
    } else {
      formattedOutput += $.strPad(key, 20, ' ') + formattingDelimiter +  $.strPad(formatInDecimal(categorySum.toString()), 15, ' ') + formattingDelimiter +  $.strPad(' ', 8, ' ') + '\n';
    }
  });
  formattedOutput += $.strPad('TOTAL', 20, ' ') + formattingDelimiter +  $.strPad(formatInDecimal(categoryGrandSum.toString()), 15, ' ') + formattingDelimiter + '\n';

  return formattedOutput;
}

function formatTransactionsOutput (parsedTransactions) {
  var formattedOutput;
  formattedOutput = '';
  formattedOutput += $.strPad('x', 2, ' ') + formattingDelimiter;
  formattedOutput += $.strPad('DATE', 12, ' ') + formattingDelimiter;
  formattedOutput += $.strPad('AMOUNT', 10, ' ') + formattingDelimiter;
  formattedOutput += $.strPad('CATEGORY', 10, ' ') + formattingDelimiter;
  formattedOutput += $.strPad('ACCOUNT', 10, ' ') + formattingDelimiter;
  formattedOutput += $.strPad('CURR', 5, ' ') + formattingDelimiter;
  formattedOutput += $.strPad('NOTES', 1, ' ') + '\n';
  parsedTransactions.forEach( function(parsedTransaction) {
    formattedOutput += $.strPad( (parsedTransaction.reconciled ? 'x' : '') , 2, ' ') + formattingDelimiter;
    formattedOutput += $.strPad(formatDateString(parsedTransaction.date), 12, ' ') + formattingDelimiter;
    formattedOutput += $.strPad(formatInDecimal(parsedTransaction.amount.toString()), 10, ' ') + formattingDelimiter;
    formattedOutput += $.strPad(parsedTransaction.category, 10, ' ') + formattingDelimiter;
    formattedOutput += $.strPad(parsedTransaction.account, 10, ' ') + formattingDelimiter;
    formattedOutput += $.strPad(parsedTransaction.currencyDivisor, 5, ' ') + formattingDelimiter;
    formattedOutput += $.strPad(parsedTransaction.notes, 1, ' ') + '\n';
  } );
  return formattedOutput;
}

function hasDate(dataString) {
  if(dataString.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) return true;
  return false;
}

function parseTransactions (transactionsData) {
  var parsedTransactions, parsedTransaction;
  parsedTransactions = [];
  transactionsData.split('\n').forEach( function(transactionLineData) {
    parsedTransaction = parseTransaction(transactionLineData);
    if(parsedTransaction) parsedTransactions.push(parsedTransaction);
  });
  return parsedTransactions;
}

function parseTransaction (rowData) {
  var splitData,
      transaction,
      foundDate,
      foundCurrencyDivisor;

  transaction = new Transaction();

  // empty
  if(rowData.trim()=='') return null;

  // date only row
  if(hasDate(rowData) && rowData.trim().split(/ /).length==1) {
    setCurrentDate(new MyDate(rowData));
    return null;
  }

  rowData = preProcessTransactionRow(rowData);

  // minimum row must have 3 elements: amount, category and account
  splitData = rowData.split(/ /);
  if(splitData.length>=3) {

    // reconciled processing
    if(splitData[0]=='x') {
      transaction.reconciled = true;
      splitData = removeFromArray(splitData[0], splitData);
    }
    // marking all transactions reconciled that are not 'chap' for now
    // this may also be an account setting later, like 'autoReconciled'
    if(rowData.indexOf('chap')==-1) transaction.reconciled = true;

    // date processing
    foundDate = rowData.match(/\d{1,2}\/\d{1,2}\/\d{4}/)
    if(foundDate==undefined) {
      transaction.date = getCurrentDate();
    } else {
      transaction.date = new MyDate(foundDate[0]);
      setCurrentDate(transaction.date);
      splitData = removeFromArray(foundDate, splitData);
    }

    // amount processing
    if(splitData[0].match(/-?\d+\.?\d{0,2}/)) {
      transaction.setAmount(splitData[0]);

      // check for currency divisor
      splitData.forEach( function(e) {
        if(e.match(/\/\d+/)) foundCurrencyDivisor = e;
      });
      if(foundCurrencyDivisor!=undefined) {
        transaction.currencyDivisor = parseInt(foundCurrencyDivisor.replace('/', ''));
        splitData = removeFromArray(foundCurrencyDivisor, splitData);
      }
      splitData = removeFromArray(splitData[0], splitData);
    }

    // category
    transaction.category = splitData[0];
    splitData = removeFromArray(transaction.category, splitData);

    // account
    transaction.account = splitData[0];

    splitData = removeFromArray(transaction.account, splitData);

    // notes are any items in array remaining
    transaction.notes = splitData.join(' ');

    // update calculations
    // using adjustedAmount to affect category and grand sum
    updateSum(categorySums, transaction.category, transaction.adjustedAmount());
    grandSum = grandSum+transaction.adjustedAmount();
    updateSum(accountSums, transaction.account, transaction.amount);

    return transaction;
  }

  errorOutput.push('Unprocessed row: ' + rowData);
  return null;
}

// this is so dont have to always enter currency divider....
// in future once we have account list perhaps we assign currency divider to account type and
// not transaction type
function preProcessTransactionRow(rowData) {
  return rowData.replace(/cashmx/, 'cashmx /10');
}

function removeFromArray(toRemove, arr) {
  var returnArr = [];
  arr.forEach( function(e) {
    if(!e.match('^' + toRemove + '$')) returnArr.push(e);
  });
  return returnArr;
}

function whatKindOfTransactionRow(rowData) {
  if(rowData.trim()=='') return 'empty';
  if(rowData.split(' ').length==1) return 'date only';
  if(rowData.match(/^-?\d+\.?\d{0,2}? /) && rowData.split(' ').length>=3) return 'transaction';
  errorOutput.push('Unprocessed row: ' + rowData);
  return 'unparseable';
}

function parseAmount (amountString) {
  // decimal missing, compensate
  if(amountString.indexOf('.') == -1) {
    amountString += '00';
  }
  return parseInt(amountString.replace(/\.|\$|,/g, ''));
}

function getSum(sumObject, sumName) {
  var currentAmount = sumObject[sumName];
  if(currentAmount!=undefined) return currentAmount;
  else return 0;
}

function updateSum(sumObject, sumName, amount) {
  var currentAmount = getSum(sumObject, sumName);
  if(currentAmount==undefined) currentAmount=0;
  sumObject[sumName] = (currentAmount + amount);
}

function getGrandSum(sumObject) {
  var grandSum = 0;
  Object.keys(sumObject).forEach( function(key) {
    if(key[0]!='@') grandSum += getSum(sumObject, key);
  });
  return grandSum;
}

initializeValues();
