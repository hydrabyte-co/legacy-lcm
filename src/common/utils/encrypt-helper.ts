import * as crypto from 'crypto';

export async function decodeBase64(base64String: string) {
  let decodedString = undefined;
  try {
    const buff = Buffer.from(base64String, 'base64');
    decodedString = buff.toString('ascii');
  } catch (error) {}

  return decodedString;
}

export function encodeBase64(rawString: string) {
  let encodedString = undefined;
  try {
    const buff = Buffer.from(rawString);
    encodedString = buff.toString('base64');
  } catch (error) {}

  return encodedString;
}

export function createHmacSha256(data: string, secretKey: string): string {
  // Tạo đối tượng HMAC với thuật toán SHA256 và khóa bí mật
  const hmac = crypto.createHmac('sha256', secretKey);

  // Thêm dữ liệu cần mã hóa
  hmac.update(data);

  // Tạo chữ ký dưới dạng hex (có thể đổi sang base64 nếu cần)
  const signature = hmac.digest('hex');

  return signature;
}
