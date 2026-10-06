export function findByPathOfObject(
  object: object,
  path: string,
  defaultValue: any,
) {
  return path.split('.').reduce((o: any, p: string) => {
    return o ? o[p] : defaultValue;
  }, object);
}

export function setObjectPropertyByPath(object: any, path: string, value: any) {
  const parts = path.split('.');
  const limit = parts.length - 1;
  for (let i = 0; i < limit; ++i) {
    const key = parts[i];
    object = object[key] ?? (object[key] = {});
  }
  const key = parts[limit];
  object[key] = value;
}

export function handleStringValueWithPathOfObject(
  object: object,
  value: string,
  defaultValue?: any,
) {
  const pathValueRegex = /{{[a-zA-Z0-9_.]+}}/g;
  const matchedPaths = value.match(pathValueRegex);
  let handledValue = '' + value;
  if (matchedPaths) {
    matchedPaths.forEach((matchedPath) => {
      const path = matchedPath.replace('{{', '').replace('}}', '');
      let findValue = findByPathOfObject(object, path, matchedPath);
      if (findValue === undefined) {
        findValue = '';
      }
      handledValue = handledValue.replace(matchedPath, findValue);
    });
  }
  if (handledValue === '') {
    if (defaultValue) {
      handledValue = defaultValue;
    }
  }
  return handledValue;
}

export function plainToType(
  sourceObject: any,
  DestinationType,
  options: { safeConvert: boolean } = { safeConvert: false },
): any {
  const targetObject = new DestinationType();
  for (const key in targetObject) {
    if (targetObject[key] !== undefined) {
      if (sourceObject[key] !== undefined) {
        targetObject[key] = sourceObject[key];
      } else {
        if (options.safeConvert) {
          delete targetObject[key];
        }
      }
    }
  }
  return targetObject;
}
export function getTypeOf(v: any) {
  let type: any = typeof v;

  if (type === 'object') {
    if (Array.isArray(v)) {
      type = 'array';
    }
    if (typeof v.getMonth === 'function') {
      type = 'datetime';
    }
  }

  return type;
}

export function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function convertToNumber(input: any, defaultValue: number) {
  let output = defaultValue;
  try {
    output = parseInt(input);
  } catch (error) {}
  return output;
}
