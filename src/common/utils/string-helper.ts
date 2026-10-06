const mapping = [
  {
    source: 'a',
    destination: 'a',
  },
  {
    source: 'á',
    destination: 'as',
  },
  {
    source: 'à',
    destination: 'af',
  },
  {
    source: 'ạ',
    destination: 'aj',
  },
  {
    source: 'ả',
    destination: 'ar',
  },
  {
    source: 'ã',
    destination: 'ax',
  },
  {
    source: 'â',
    destination: 'aa',
  },
  {
    source: 'ấ',
    destination: 'aas',
  },
  {
    source: 'ầ',
    destination: 'aaf',
  },
  {
    source: 'ậ',
    destination: 'aaj',
  },
  {
    source: 'ẩ',
    destination: 'aaf',
  },
  {
    source: 'ẫ',
    destination: 'aax',
  },
  {
    source: 'e',
    destination: 'e',
  },
  {
    source: 'é',
    destination: 'es',
  },
  {
    source: 'è',
    destination: 'ef',
  },
  {
    source: 'ẹ',
    destination: 'ej',
  },
  {
    source: 'ẻ',
    destination: 'er',
  },
  {
    source: 'ẽ',
    destination: 'ex',
  },
  {
    source: 'ê',
    destination: 'ee',
  },
  {
    source: 'ế',
    destination: 'ees',
  },
  {
    source: 'ề',
    destination: 'eef',
  },
  {
    source: 'ệ',
    destination: 'eej',
  },
  {
    source: 'ể',
    destination: 'eer',
  },
  {
    source: 'ễ',
    destination: 'eex',
  },
  {
    source: 'i',
    destination: 'i',
  },
  {
    source: 'í',
    destination: 'is',
  },
  {
    source: 'ì',
    destination: 'if',
  },
  {
    source: 'ị',
    destination: 'ij',
  },
  {
    source: 'ỉ',
    destination: 'ir',
  },
  {
    source: 'ĩ',
    destination: 'ix',
  },
  {
    source: 'o',
    destination: 'o',
  },
  {
    source: 'ó',
    destination: 'os',
  },
  {
    source: 'ò',
    destination: 'of',
  },
  {
    source: 'ọ',
    destination: 'oj',
  },
  {
    source: 'ỏ',
    destination: 'or',
  },
  {
    source: 'õ',
    destination: 'ox',
  },
  {
    source: 'ô',
    destination: 'oo',
  },
  {
    source: 'ố',
    destination: 'oos',
  },
  {
    source: 'ồ',
    destination: 'oof',
  },
  {
    source: 'ộ',
    destination: 'ooj',
  },
  {
    source: 'ổ',
    destination: 'oor',
  },
  {
    source: 'ỗ',
    destination: 'oox',
  },
  {
    source: 'ơ',
    destination: 'ow',
  },
  {
    source: 'ớ',
    destination: 'ows',
  },
  {
    source: 'ờ',
    destination: 'owf',
  },
  {
    source: 'ợ',
    destination: 'owj',
  },
  {
    source: 'ở',
    destination: 'owr',
  },
  {
    source: 'ỡ',
    destination: 'owx',
  },
  {
    source: 'u',
    destination: 'u',
  },
  {
    source: 'ú',
    destination: 'us',
  },
  {
    source: 'ù',
    destination: 'uf',
  },
  {
    source: 'ụ',
    destination: 'uj',
  },
  {
    source: 'ủ',
    destination: 'ur',
  },
  {
    source: 'ũ',
    destination: 'ux',
  },
  {
    source: 'ư',
    destination: 'uw',
  },
  {
    source: 'ứ',
    destination: 'uws',
  },
  {
    source: 'ừ',
    destination: 'uwf',
  },
  {
    source: 'ự',
    destination: 'uwj',
  },
  {
    source: 'ử',
    destination: 'uwr',
  },
  {
    source: 'ữ',
    destination: 'uwx',
  },
  {
    source: 'ă',
    destination: 'aw',
  },
  {
    source: 'ắ',
    destination: 'aws',
  },
  {
    source: 'ắ',
    destination: 'aws',
  },
  {
    source: 'ằ',
    destination: 'awf',
  },
  {
    source: 'ặ',
    destination: 'awj',
  },
  {
    source: 'ẵ',
    destination: 'awx',
  },
  {
    source: 'ý',
    destination: 'ys',
  },
  {
    source: 'ỳ',
    destination: 'yf',
  },
  {
    source: 'ỵ',
    destination: 'yj',
  },
  {
    source: 'ỹ',
    destination: 'yx',
  },
  {
    source: 'í',
    destination: 'is',
  },
  {
    source: 'ì',
    destination: 'if',
  },
  {
    source: 'ị',
    destination: 'ij',
  },
  {
    source: 'ĩ',
    destination: 'ix',
  },
  {
    source: 'đ',
    destination: 'dd',
  },
  {
    source: ' ',
    destination: '-',
  },
];

export function replaceRegexPatternFromString(
  input: string,
  regexPatternString: string,
  newString: string,
): string {
  const regexPattern = new RegExp(regexPatternString, 'g');
  if (input !== undefined) return input.replace(regexPattern, newString);
  else return '';
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const convertToNonUnicodeString = (input) => {
  let output = '';
  for (let i = 0; i < input.length; i++) {
    const c = input[i].toLowerCase();
    let newC = c.toLowerCase();
    mapping.forEach((m) => {
      if (c === m.source) {
        newC = m.destination;
      }
    });
    output += newC;
  }
  return output;
};

export function addLeadingZero(num: number | string, size: number) {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
}

export function sanitizeString(input: string): string {
  return input.replace(/[^a-zA-Z0-9_\-\.]/g, '');
}

export function isValidEntityCode(code: string): boolean {
  return /^[a-zA-Z0-9_\-\.]+$/.test(code); // Kiểm tra chuỗi có chỉ chứa ký tự hợp lệ không
}
