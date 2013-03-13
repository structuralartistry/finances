var fixtureTransactionsData1 = '';
fixtureTransactionsData1 = '1/12/2012 12.98 dining cash\n';
fixtureTransactionsData1 += '1/12/2012 3.45 cafe cash\n';
fixtureTransactionsData1 += '1/11/2012 20 transit chap\n';
fixtureTransactionsData1 += '1/11/2012 34.52 groc chap\n';
fixtureTransactionsData1 += '12/10/2011 700 rent cash\n';

//describe('UI tests', function () {
//  test('processDataInput', function () {
//    var formattedOutput, parsedTransactions, expectedOutput;
//    parsedTransactions = parseTransactions(fixtureTransactionsData1);
//
//    expectedOutput  = '        DATE |     AMOUNT |   CATEGORY |    ACCOUNT | \n'
//    expectedOutput += '   1/12/2012 |      12.98 |     dining |       cash | \n'
//    expectedOutput += '   1/12/2012 |       3.45 |       cafe |       cash | \n'
//    expectedOutput += '   1/11/2012 |      20.00 |    transit |       chap | \n'
//    expectedOutput += '   1/11/2012 |      34.52 |       groc |       chap | \n'
//    expectedOutput += '  12/10/2011 |     700.00 |       rent |       cash | \n'
//
//    formattedOutput = formatTransactionsOutput(parsedTransactions);
//
//    assert(formattedOutput, expectedOutput);
//  });
//
//  test('formatTransactionsOutput', function () {
//    var formattedOutput, parsedTransactions, expectedOutput;
//    parsedTransactions = parseTransactions(fixtureTransactionsData1);
//
//    expectedOutput  = '        DATE |     AMOUNT |   CATEGORY |    ACCOUNT | \n'
//    expectedOutput += '   1/12/2012 |      12.98 |     dining |       cash | \n'
//    expectedOutput += '   1/12/2012 |       3.45 |       cafe |       cash | \n'
//    expectedOutput += '   1/11/2012 |      20.00 |    transit |       chap | \n'
//    expectedOutput += '   1/11/2012 |      34.52 |       groc |       chap | \n'
//    expectedOutput += '  12/10/2011 |     700.00 |       rent |       cash | \n'
//
//    formattedOutput = formatTransactionsOutput(parsedTransactions);
//
//    assert(formattedOutput, expectedOutput);
//  });
//
//  test('formatInDecimal', function () {
//    assert(formatInDecimal('1000'), '10.00');
//    assert(formatInDecimal('2345'), '23.45');
//    assert(formatInDecimal('92345'), '923.45');
//    assert(formatInDecimal('-1197'), '-11.97');
//    assert(formatInDecimal(''), '0.00');
//    assert(formatInDecimal('0'), '0.00');
////    assert(formatInDecimal('-0'), '0.00');
//  });
//});

//describe('whatIsThisRow', function () {
//
//  test('date only', function () {
//    assert(whatIsThisRow('1/1/2013'), 'date only');
//  });
//
//  test('transaction row with no date', function () {
//    assert(whatIsThisRow('-200 xfer chap'), 'transaction row with no date');
//
//  });
//
//  test('transaction row with date', function () {
//    assert(whatIsThisRow('6/2/2001 -200 xfer chap'), 'transaction row with date');
//  });
//
//  test('empty row', function () {
//    assert(whatIsThisRow(''), 'empty row');
//  });
//
//  test('not detected', function () {
//    assert(whatIsThisRow('blah'), 'dont know');
//    assert(errorOutput[0], 'Unprocessed row: blah');
//  });
//
//});

//describe('normalizeTransactionRow', function () {
//
//  test('row with date', function () {
//    assert(normalizeTransactionRow('6/2/2001 -200 xfer chap'), '6/2/2001 -200 xfer chap');
//  });
//
//  test('row with no date', function () {
//    currentDate = new MyDate('6/2/1972');
//    assert(normalizeTransactionRow('-200 xfer chap'), '6/2/1972 -200 xfer chap');
//  });
//
//  test('with padding', function () {
//    assert(normalizeTransactionRow('  1/7/2012 -16.00 din cash  '), '1/7/2012 -16.00 din cash');
//  });
//
//
//});

describe('hasDate', function () {
  test('no date', function () {
    assert(hasDate('1/1/2013'), true);
  });
  test('date', function () {
    assert(hasDate('blah'), false);
  });
});

//describe('parseTransactions', function () {
//
//  test('simple data', function () {
//    result = parseTransactions(fixtureTransactionsData1);
//    assert(result.length, 5);
//    assert(result[0][1], 1298);
//    assert(result[4][1], 70000);
//  });
//
//  test('complex data', function () {
//    var data = '';
//    data += '1/17/2013\n';
//    data += '-200 xfer chap\n';
//    data += '200 xfer cash\n';
//    data += '-80 growth cash\n';
//    data += '-10 transit cash\n';
//    data += '\n';
//    data += '1/16/2013 3 cafe cash\n';
//    data += '\n';
//    data += '1/15/2013\n';
//    data += '-4.00 groc cash\n';
//    data += '\n';
//    data += '12/14/2012 26.28 groc cash\n';
//
//    result = parseTransactions(data);
//    assert(result.length, 7);
//    assert(formatDateString(result[0][0]), '1/17/2013');
//    assert(formatDateString(result[1][0]), '1/17/2013');
//    assert(formatDateString(result[2][0]), '1/17/2013');
//    assert(formatDateString(result[3][0]), '1/17/2013');
//    assert(formatDateString(result[4][0]), '1/16/2013');
//    assert(formatDateString(result[5][0]), '1/15/2013');
//    assert(formatDateString(result[6][0]), '12/14/2012');
//  });
//
//  describe('sums', function () {
//
//    var data = '';
//    data += '-10 dining cash\n'
//    data += '-12.97 groceries cash\n'
//    data += '-232.81 travel chap\n'
//    data += '10000 income chap\n'
//    data += '-1000 transfer chap\n'
//    data += '1000 transfer cash\n'
//    data += '-87.63 groceries chap\n'
//
//    test('getSum', function () {
//      sumObject = {}
//      assert(getSum('category_a'), 0);
//      sumObject['category_a']=1234;
//      assert(getSum(sumObject, 'category_a'), 1234);
//    });
//
//    test('updateSum', function () {
//      sumObject = {}
//      assert(sumObject['somecat'], undefined);
//      updateSum(sumObject, 'somecat', 5432);
//      assert(sumObject['somecat'], 5432);
//      updateSum(sumObject, 'somecat', 12);
//      assert(sumObject['somecat'], 5444);
//    });
//
//    test('categorySums', function () {
//      categorySums = {}
//      parseTransactions(data);
//      assert(categorySums['dining'], -1000);
//      assert(categorySums['groceries'], -10060);
//      assert(categorySums['travel'], -23281);
//      assert(categorySums['income'], 1000000);
//      assert(categorySums['transfer'], 0);
//    });
//
//    test('accountSums', function () {
//      accountSums = {}
//      parseTransactions(data);
//      assert(accountSums['cash'], 97703);
//      assert(accountSums['chap'], 867956);
//    });
//
//    test('grandSum', function () {
//      grandSum = 0;
//      parseTransactions(data);
//      assert(grandSum, 965659);
//    });
//
//    test('mexican peso conversion', function () {
//      grandSum = 0;
//      accountSums = {};
//      categorySums = {};
//
//      data = '';
//      data += '-50 dining cashmx\n'
//      data += '-5 groceries cash\n'
//      data += '1000 xfer cashmx\n'
//
//      parseTransactions(data);
//
//      // cashmx is divided by 10
//      assert(grandSum, 9000);
//      assert(categorySums['dining'], -500);
//      assert(categorySums['groceries'], -500);
//      assert(categorySums['xfer'], 10000);
//
//      // but not for account
//      assert(accountSums['cashmx'], 95000);
//    });
//
//  });
//
//});

test('formatDateString', function () {
  var dateStrings;
  dateStrings = ['1/1/2013', '6/2/1972', '12/24/1969']
  dateStrings.forEach( function (dateString) {
    assert(formatDateString(new MyDate(dateString)), dateString);
  });
});

describe('parseTransaction', function () {

  describe('parseable formats', function () {

    test('date only', function () {
      currentDate = undefined;

      assert(parseTransaction('5/23/2012'), null);

      // sets the current date
      assert(getCurrentDate().toString(), new MyDate('5/23/2012').toString());
    });

    test('empty', function () {
      assert(parseTransaction(''), null);

      assert(errorOutput.length, 0);
    });

    test('unparsable', function () {
      var unprocessableRow = 'xoxoxox';
      assert(parseTransaction(unprocessableRow), null);

      assert(errorOutput.length, 1);
      assert(errorOutput[0], 'Unprocessed row: ' + unprocessableRow);
    });

    test('minimum row with amount, cagetory and account', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('-19.87 groc cash');

      assert(parsedTransaction.date, getCurrentDate());
      assert(parsedTransaction.amount, -198700);
      assert(parsedTransaction.category, 'groc');
      assert(parsedTransaction.account, 'cash');
    });

    test('minumum row with date', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('12/31/1999 -19.87 groc cash');

      // sets current date as the transaction date
      assert(getCurrentDate().toString(), new MyDate('12/31/1999').toString());

      assert(formatDateString(parsedTransaction.date), '12/31/1999');
      assert(parsedTransaction.amount, -198700);
      assert(parsedTransaction.category, 'groc');
      assert(parsedTransaction.account, 'cash');
    });

//    test('transaction', function () {
//      // must have an amount, a category and an account
//      assert(whatKindOfTransactionRow('-200.99 homex chap'), 'transaction');
//      assert(whatKindOfTransactionRow('1/1/2013 -200.99 homex chap'), 'transaction');
//      assert(whatKindOfTransactionRow('x 1/1/2013 -200.99 homex chap'), 'transaction');
//      assert(whatKindOfTransactionRow('-200.99 homex chap some notes are here'), 'transaction');
//      assert(whatKindOfTransactionRow('-200.99 homex chap /10'), 'transaction');
//      assert(whatKindOfTransactionRow('x 1/1/2013 -200.99 homex chap /10 some notes are here'), 'transaction');
//    });
//

  });


//  test('debit transaction', function () {
//    var parsedTransaction;
//    parsedTransaction = parseTransaction('1/7/2012 -16.00 din cash');
//    assert(parsedTransaction[0].toString(), new MyDate('1/7/2012').toString());
//    assert(parsedTransaction[1], -1600);
//    assert(parsedTransaction[2], 'din');
//    assert(parsedTransaction[3], 'cash');
//  });

});

test('setCurrentDate', function () {
  currentDate = undefined;
  date = new MyDate('9/11/2001');
  setCurrentDate(date)
  assert(currentDate.toString(), date.toString());
});

test('parseAmount', function () {
  // adds assumed decimals
  assert(parseAmount('12'), 1200);
  assert(parseAmount('1234'), 123400);

  assert(parseAmount('12.00'), 1200);

  // removes commas, periods $ sign, etc
  assert(parseAmount('12.34'), 1234);
  assert(parseAmount('1,234'), 123400);
  assert(parseAmount('1,234.99'), 123499);
  assert(parseAmount('$12.34'), 1234);
});

