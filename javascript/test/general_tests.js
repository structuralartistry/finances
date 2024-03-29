var fixtureTransactionsData1 = '';
fixtureTransactionsData1 = '1/12/2012 12.98 dining cash\n';
fixtureTransactionsData1 += '1/12/2012 3.45 cafe cash\n';
fixtureTransactionsData1 += '1/11/2012 20 transit chap\n';
fixtureTransactionsData1 += '1/11/2012 34.52 groc chap\n';
fixtureTransactionsData1 += '12/10/2011 700 rent cash\n';

// reconciled date amount cat acc currdiv notes
describe('UI tests', function () {

  test('formatTransactionsOutput', function () {
    var formattedOutput, parsedTransactions, expectedOutput;
    parsedTransactions = parseTransactions(fixtureTransactionsData1);

    expectedOutput  = ' x|        DATE|    AMOUNT|  CATEGORY|   ACCOUNT| CURR|NOTES\n'
    expectedOutput += ' x|   1/12/2012|     12.98|    dining|      cash|    1| \n'
    expectedOutput += ' x|   1/12/2012|      3.45|      cafe|      cash|    1| \n'
    expectedOutput += '  |   1/11/2012|     20.00|   transit|      chap|    1| \n'
    expectedOutput += '  |   1/11/2012|     34.52|      groc|      chap|    1| \n'
    expectedOutput += ' x|  12/10/2011|    700.00|      rent|      cash|    1| \n'

    formattedOutput = formatTransactionsOutput(parsedTransactions);

    assert(formattedOutput, expectedOutput);
  });

  test('formatInDecimal', function () {
    assert(formatInDecimal('1000'), '10.00');
    assert(formatInDecimal('2345'), '23.45');
    assert(formatInDecimal('92345'), '923.45');
    assert(formatInDecimal('-1197'), '-11.97');
    assert(formatInDecimal(''), '0.00');
    assert(formatInDecimal('0'), '0.00');
    assert(formatInDecimal('-0'), '0.00');
  });
});

describe('hasDate', function () {
  test('no date', function () {
    assert(hasDate('1/1/2013'), true);
  });
  test('date', function () {
    assert(hasDate('blah'), false);
  });
});

describe('parseTransactions', function () {

  test('simple data', function () {
    result = parseTransactions(fixtureTransactionsData1);
    assert(result.length, 5);
    assert(result[0].amount, 1298);
    assert(result[4].amount, 70000);
  });

  test('complex data', function () {
    var data = '';
    data += '1/17/2013\n';
    data += '-200 xfer chap\n';
    data += '200 xfer cash\n';
    data += '-80 growth cash\n';
    data += '-10 transit cash\n';
    data += '\n';
    data += '1/16/2013 3 cafe cash\n';
    data += '\n';
    data += '1/15/2013\n';
    data += '-4.00 groc cash\n';
    data += '\n';
    data += '12/14/2012 26.28 groc cash\n';

    result = parseTransactions(data);
    assert(result.length, 7);
    assert(formatDateString(result[0].date), '1/17/2013');
    assert(formatDateString(result[1].date), '1/17/2013');
    assert(formatDateString(result[2].date), '1/17/2013');
    assert(formatDateString(result[3].date), '1/17/2013');
    assert(formatDateString(result[4].date), '1/16/2013');
    assert(formatDateString(result[5].date), '1/15/2013');
    assert(formatDateString(result[6].date), '12/14/2012');
  });

  describe('sums', function () {

    var data = '';
    data += '-10 dining cash\n'
    data += '-12.97 groceries cash\n'
    data += '-232.81 travel chap\n'
    data += '10000 income chap\n'
    data += '-1000 transfer chap\n'
    data += '1000 transfer cash\n'
    data += '-87.63 groceries chap\n'

    test('getSum', function () {
      sumObject = {}
      assert(getSum('category_a'), 0);
      sumObject['category_a']=1234;
      assert(getSum(sumObject, 'category_a'), 1234);
    });

    test('updateSum', function () {
      sumObject = {}
      assert(sumObject['somecat'], undefined);
      updateSum(sumObject, 'somecat', 5432);
      assert(sumObject['somecat'], 5432);
      updateSum(sumObject, 'somecat', 12);
      assert(sumObject['somecat'], 5444);
    });

    test('categorySums', function () {
      categorySums = {}
      parseTransactions(data);
      assert(categorySums['dining'], -1000);
      assert(categorySums['groceries'], -10060);
      assert(categorySums['travel'], -23281);
      assert(categorySums['income'], 1000000);
      assert(categorySums['transfer'], 0);
    });

    test('accountSums', function () {
      accountSums = {}
      parseTransactions(data);
      assert(accountSums['cash'], 97703);
      assert(accountSums['chap'], 867956);
    });

    test('grandSum', function () {
      grandSum = 0;
      parseTransactions(data);
      assert(grandSum, 965659);
    });

    test('mexican peso conversion', function () {
      grandSum = 0;
      accountSums = {};
      categorySums = {};

      data = '';
      data += '-50 dining cashmx\n'
      data += '-5 groceries cash\n'
      data += '10000 xfer cashmx\n'

      parseTransactions(data);

      // cashmx is divided by 10
      assert(grandSum, 99000);
      assert(categorySums['dining'], -500);
      assert(categorySums['groceries'], -500);
      assert(categorySums['xfer'], 100000);

      // but not for account
      assert(accountSums['cashmx'], 995000);
    });

  });

});

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

    describe('must have amount, category and account', function () {

      test('no amount', function () {
        initializeValues();
        row = 'groc chap';
        assert(parseTransaction(row), null);

        assert(errorOutput.length, 1);
        assert(errorOutput[0], 'Unprocessed row: ' + row);
      });

      test('no category', function () {
        initializeValues();
        row = '-12';
        assert(parseTransaction(row), null);

        assert(errorOutput.length, 1);
        assert(errorOutput[0], 'Unprocessed row: ' + row);
      });

      test('no account', function () {
        initializeValues();
        row = '-12 groc';
        assert(parseTransaction(row), null);

        assert(errorOutput.length, 1);
        assert(errorOutput[0], 'Unprocessed row: ' + row);
      });

    });

    test('minimum row with amount, cagetory and account', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('-19.87 groc cash');

      assert(parsedTransaction.date, getCurrentDate());
      assert(parsedTransaction.amount, -1987);
      assert(parsedTransaction.category, 'groc');
      assert(parsedTransaction.account, 'cash');
      assert(parsedTransaction.currencyDivisor, 1);
    });

    test('with decimal amount', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('-19.87 groc cash');

      assert(parsedTransaction.amount, -1987);
    });

    test('with non-decimal amount', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('-19 groc cash');

      assert(parsedTransaction.amount, -1900);
    });

    test('with positive amount', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('-19 groc cash');

      assert(parsedTransaction.amount, -1900);
    });

    test('with negative amount', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('19 groc cash');

      assert(parsedTransaction.amount, 1900);
    });

    test('with date', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('12/31/1999 -19.87 groc cash');

      // sets current date as the transaction date
      assert(getCurrentDate().toString(), new MyDate('12/31/1999').toString());

      assert(formatDateString(parsedTransaction.date), '12/31/1999');
      assert(parsedTransaction.amount, -1987);
      assert(parsedTransaction.category, 'groc');
      assert(parsedTransaction.account, 'cash');
    });

    test('with reconciled', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('x -19.87 groc cash');

      assert(parsedTransaction.date, getCurrentDate());
      assert(parsedTransaction.reconciled, true);
      assert(parsedTransaction.amount, -1987);
      assert(parsedTransaction.category, 'groc');
      assert(parsedTransaction.account, 'cash');
    });

    test('with not reconciled', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('-19.87 groc chap');

      assert(parsedTransaction.date, getCurrentDate());
      assert(parsedTransaction.reconciled, false);
      assert(parsedTransaction.amount, -1987);
      assert(parsedTransaction.category, 'groc');
      assert(parsedTransaction.account, 'chap');
    });

    test('with reconciled and date', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('x 12/31/1999 -19.87 groc cash');

      assert(formatDateString(parsedTransaction.date), '12/31/1999');
      assert(parsedTransaction.reconciled, true);
      assert(parsedTransaction.amount, -1987);
      assert(parsedTransaction.category, 'groc');
      assert(parsedTransaction.account, 'cash');
    });

    test('with currency divisor', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('-120.00 groc chap /10');

      assert(parsedTransaction.date, getCurrentDate());
      assert(parsedTransaction.reconciled, false);
      assert(parsedTransaction.adjustedAmount(), -1200);
      assert(parsedTransaction.category, 'groc');
      assert(parsedTransaction.account, 'chap');
      assert(parsedTransaction.currencyDivisor, 10);
    });

    test('with notes', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('-120.00 groc chap my notes are here');

      assert(parsedTransaction.date, getCurrentDate());
      assert(parsedTransaction.reconciled, false);
      assert(parsedTransaction.amount, -12000);
      assert(parsedTransaction.category, 'groc');
      assert(parsedTransaction.account, 'chap');
      assert(parsedTransaction.currencyDivisor, 1);
      assert(parsedTransaction.notes, 'my notes are here');
    });

    test('failing to get account with reconciled (bug)', function () {
      var parsedTransaction;

      parsedTransaction = parseTransaction('x -9132.75 @xfer chap');

      assert(parsedTransaction.date, getCurrentDate());
      assert(parsedTransaction.reconciled, true);
      assert(parsedTransaction.amount, -913275);
      assert(parsedTransaction.category, '@xfer');
      assert(parsedTransaction.account, 'chap');
      assert(parsedTransaction.currencyDivisor, 1);
      assert(parsedTransaction.notes, '');

    });

  });

});

describe('removeFromArray', function () {

  test('simple removal', function () {
    arr = ['a', 'b', 'c'];
    assert(removeFromArray('b', arr).toString(), ['a', 'c'].toString());
  });

  test('must fully match element', function () {
    arr = ['x', '@xfer', 'chap'];
    assert(removeFromArray('x', arr).toString(), ['@xfer', 'chap'].toString());
  });

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

