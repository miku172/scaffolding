import log4js from 'log4js';
import log4jConfig from './log4j.config';

// 加载配置文件
log4js.configure(log4jConfig);
interface LogUtilsType{
    logError?: Function;
    reqLog?: Function;
    logResponse?: Function;
    logInfo?: Function;
}
var logUtil:LogUtilsType = {};
// 调用预先定义的日志名称
var resLogger = log4js.getLogger('resLogger');
var reqLogger = log4js.getLogger('http');
var errorLogger = log4js.getLogger('errorLogger');
var consoleLogger = log4js.getLogger();

// 封装错误日志
logUtil.logError = function (ctx: { request: any; }, error: { name: string; message: string; stack: string; }, resTime: any) {
  if (ctx && error) {
    errorLogger.error(formatError(ctx, error, resTime));
  }
};

// 封装请求日志
logUtil.reqLog = function (ctx: { method: any; originalUrl: string; ip: string; query: any; body: any; }, resTime: string) {
  if (ctx) {
    reqLogger.info(formatReqLog(ctx, resTime));
  }
};
// 封装响应日志
logUtil.logResponse = function (ctx: { request: any; status: string; body: any; }, resTime: any) {
  if (ctx) {
    resLogger.info(formatRes(ctx, resTime));
  }
};

logUtil.logInfo = function (info: any) {
  if (info) {
    consoleLogger.info(formatInfo(info));
  }
};

var formatInfo = function (info: any) {
  let logText = '';
  // 响应日志开始
  logText += '\r\n***************info log start ***************\r\n';
  // 响应内容
  logText += 'info detail: ' + JSON.stringify(info) + '\b';
  // 响应日志结束
  logText += '\r\n*************** info log end ***************\r\n';
  return logText;
};

// 格式化响应日志
var formatRes = function (ctx: { request: any; status: string; body: any; }, resTime: any) {
  let logText = '';
  // 响应日志开始
  logText += '\r\n*************** response log start ***************\r\n';
  // 添加请求日志
  logText += formatReqLog(ctx.request, resTime);
  // 响应状态码
  logText += '\r\nresponse status: ' + ctx.status + '\b';
  // 响应内容
  logText += 'response body: ' + JSON.stringify(ctx.body);
  // 响应日志结束
  logText += '\r\n*************** response log end ***************\r\n';
  return logText;
};

// 格式化错误日志
var formatError = function (ctx: { request: any; }, err: { name: string; message: string; stack: string; }, resTime: any) {
    let logText = '';
  // 错误信息开始
  logText += '\r\n*************** error log start ***************\r\n';
  // 添加请求日志
  logText += formatReqLog(ctx.request, resTime);
  // 错误名称
  logText += 'err name: ' + err.name + '\b';
  // 错误信息
  logText += 'err message: ' + err.message + '\b';
  // 错误详情
  logText += 'err stack: ' + err.stack + '\b';
  // 错误信息结束
  logText += '\r\n*************** error log end ***************\r\n';
  return logText;
};

// 格式化请求日志
var formatReqLog = function (req: { method: any; originalUrl: string; ip: string; query: any; body: any; }, resTime: string) {
  var logText = '';
  var method = req.method;
  // 访问方法
  logText += 'request method: ' + method + '\b';
  // 请求原始地址
  logText += 'request originalUrl:  ' + req.originalUrl + '\b';
  // 客户端ip
  logText += 'request client ip:  ' + req.ip + '\b';
  // 请求参数
  if (method === 'GET') {
    logText += 'request query:  ' + JSON.stringify(req.query) + '\b';
  } else {
    logText += 'request body: '+ JSON.stringify(req.body) + '\b';
  }
  // 服务器响应时间
  logText += 'response time: ' + resTime + '\b';
  return logText;
};

export default () => {
  return async (ctx: { logger: { reqLog?: any; }; }, next: () => any) => {
    ctx.logger = logUtil;
    ctx.logger.reqLog(ctx, 0);
    await next();
  };
};