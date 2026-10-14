'use strict';

import { inspect } from 'util';

export function logData(
  level: string,
  type: 'info' | 'warning' | 'alert',
  message: string,
  ...params: any
): void {
  if (process.env.LOGGER) {
    if (level === '' || level === '*' || level === process.env.LOGGER) {
      const pad2 = (n: number) => {
        return (n < 10 ? '0' : '') + n;
      };
      const now = new Date();
      const time =
        now.getFullYear().toString().substring(2, 4) +
        pad2(now.getMonth() + 1) +
        pad2(now.getDate()) +
        ' ' +
        pad2(now.getHours()) +
        pad2(now.getMinutes()) +
        pad2(now.getSeconds());
      let color = '\x1b[34m';
      switch (type) {
        case 'info': {
          color = '\x1b[34m';
          break;
        }
        case 'warning': {
          color = '\x1b[33m';
          break;
        }
        case 'alert': {
          color = '\x1b[31m';
          break;
        }
      }
      let fullMessage = `${color}[${time}] ${message}\x1b[0m`;
      if (params.length > 0 && params[0] !== null) {
        let paramsString = '';
        for (let i = 0; i < params.length; i++) {
          const p = params[i];
          if (typeof p === 'string' || typeof p === 'number') {
            paramsString += `${p}\n`;
          } else {
            paramsString += `${inspect(p, true, null)}\n`;
          }
        }
        if (process.env.LOGGER_INLINE) {
          paramsString = paramsString.replace(/\n/g, '\t');
          fullMessage += '\t';
        } else {
          fullMessage += '\n';
        }
        console.log(`${fullMessage}${paramsString}`);
      } else {
        console.log(fullMessage);
      }
    }
  }
}
export function logInfo(level: string, message: string, ...params: any): void {
  logData(level, 'info', message, ...params);
}
export function logWarning(
  level: string,
  message: string,
  ...params: any
): void {
  logData(level, 'warning', message, params);
}
export function logAlert(level: string, message: string, ...params: any): void {
  logData(level, 'alert', message, ...params);
}

export function logMessageQueueInfo(pattern: string, data: any): void {
  logInfo('*', `Event '${pattern}' with payload`, data);
}
export function logMessageQueueResult(
  pattern: string,
  startedAt: Date,
  result: any,
): void {
  logInfo(
    '*',
    `Event '${pattern}' start at '${startedAt.toLocaleString()}' and handle ${
      result ? '\x1b[32msuccessfully' : '\x1b[31mfailed'
    }\x1b[34m after ${
      (new Date().getTime() - startedAt.getTime()) / 1000
    } seconds`,
  );
}
