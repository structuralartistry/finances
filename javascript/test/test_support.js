// test infastructure methods
function describe (description, testFunctionsWrapper) {
  log('---' + description + '---');
  testFunctionsWrapper.call();
  log('');
}

function test (description, testFunction) {
  log(description);
  testFunction.call();
}

function log (data) {
  // document.write(data + '<br>');
  console.log(data);
}

function assert (actual, expected) {
  //log(arguments.callee.caller.name);
  var success;
  success = (actual===expected);
  if(!success) {
    log('*** FAILURE***');
    log('Expected:');
    log(expected);
    log('But got:');
    log(actual);
  } else {
//        log('  .');
  }
}
