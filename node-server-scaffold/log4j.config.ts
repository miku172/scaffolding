import path from 'path';

// 日志根目录
let baseLogPath = path.resolve(__dirname, 'logs');

// 错误日志目录
let errorPath = '/error';
// 错误日志文件名
let errorFileName = 'error';
// 错误日志输出完整路径
let errorLogPath = baseLogPath + errorPath + '/' + errorFileName;

// 请求日志目录
let reqPath = '/request';
// 请求日志文件名
let reqFileName = 'request';
// 请求日志输出完整路径
let reqLogPath = baseLogPath + reqPath + '/' + reqFileName;

// 响应日志目录
let responsePath = '/response';
// 响应日志文件名
let responseFileName = 'response';
// 响应日志输出完整路径
let responseLogPath = baseLogPath + responsePath + '/' + responseFileName;

export default {
  // 日志格式等设置
  appenders:
    {
      console: {
        type: 'console'

      },
      errorLogger: {
        type: 'dateFile',
        filename: errorLogPath,
        pattern: '-yyyy-MM-dd-hh.log',
        alwaysIncludePattern: true,
        encoding: 'utf-8',
        maxLogSize: 1000,
        numBackups: 3,
        path: errorPath,
        layout: {
          type: 'basic'
        }
      },
      http: {
        type: 'dateFile',
        filename: reqLogPath,
        pattern: '-yyyy-MM-dd-hh.log',
        alwaysIncludePattern: true,
        encoding: 'utf-8',
        maxLogSize: 1000,
        numBackups: 3,
        path: reqPath,
        layout: {
          type: 'basic'// 'messagePassThrough'
        }
      },
      resLogger: {
        type: 'dateFile',
        filename: responseLogPath,
        pattern: '-yyyy-MM-dd-hh.log',
        alwaysIncludePattern: true,
        encoding: 'utf-8',
        maxLogSize: 1000,
        numBackups: 3,
        path: responsePath,
        layout: {
          type: 'basic'
        }
      }
    },
  // 供外部调用的名称和对应设置定义
  categories: {
    default: {
      appenders: ['console'], level: 'all'
    },
    resLogger: {
      appenders: ['resLogger'], level: 'info'
    },
    errorLogger: {
      appenders: ['errorLogger'], level: 'error'
    },
    http: {
      appenders: ['http'], level: 'info'
    }
  },
  baseLogPath,
  replaceConsole: true
};