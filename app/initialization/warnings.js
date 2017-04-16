if (__DEV__) {
  // some warnings we don't want to show up as yellow boxes because they aren't helpful or
  // actionable. This is a list of prefixes to warning messages that we are disabling.
  console.ignoredYellowBox = [
    'SocketProtocolError',
    'TimeoutError: Event response for \'login\' timed out',
    'Unable to symbolicate stack trace: The stack is null',
    'Calling of `[-RCTUIManager setFrame:forView:]` which is deprecated',
  ];
}
