const SEPARATOR = '--';
const NUMBER = /^-?\d+(\.\d+)?$/;

const valueOf = (text) => {
  return NUMBER.test(text) ? Number(text) : text;
};

const nameOf = (option) => {
  return option.replace(/^-+/, '');
};

const isOption = (argument) => {
  return argument.startsWith('-') && argument.length > 1 && !NUMBER.test(argument);
};

const withoutSeparator = (scriptArguments) => {
  return scriptArguments[0] === SEPARATOR ? scriptArguments.slice(1) : scriptArguments;
};

const parseScriptArguments = (scriptArguments) => {
  const args = [];
  const given = withoutSeparator(scriptArguments);

  for (let index = 0; index < given.length; index++) {
    const argument = given[index];

    if (!isOption(argument)) {
      args.push(valueOf(argument));
      continue;
    }

    const assignment = argument.indexOf('=');

    if (assignment !== -1) {
      args[nameOf(argument.slice(0, assignment))] = valueOf(argument.slice(assignment + 1));
      continue;
    }

    const following = given[index + 1];

    if (following === undefined || isOption(following)) {
      args[nameOf(argument)] = true;
      continue;
    }

    args[nameOf(argument)] = valueOf(following);
    index++;
  }

  return args;
};

export { parseScriptArguments, withoutSeparator };
