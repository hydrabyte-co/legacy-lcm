export async function decodeBase64(base64String: string) {
  let decodedString = undefined;
  try {
    const buff = new Buffer(base64String, 'base64');
    decodedString = buff.toString('ascii');
  } catch (error) {}

  return decodedString;
}

export function encodeBase64(rawString: string) {
  let encodedString = undefined;
  try {
    const buff = new Buffer(rawString);
    encodedString = buff.toString('base64');
  } catch (error) {}

  return encodedString;
}
