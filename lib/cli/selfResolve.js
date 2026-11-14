const PACKAGE_NAME = 'over-the-wire';

let packageEntry = null;

const initialize = (data) => {
  packageEntry = data.packageEntry;
};

const resolve = (specifier, context, nextResolve) => {
  if (specifier === PACKAGE_NAME && packageEntry !== null) {
    return { url: packageEntry, shortCircuit: true };
  }

  return nextResolve(specifier, context);
};

export { initialize, resolve };
