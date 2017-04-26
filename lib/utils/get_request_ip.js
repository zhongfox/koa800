'use strict';

function getRequestIp(ctx) {
  let nginx_ip = ctx.headers['x-forwarded-for'];
  let remote_ip = ctx.ip;
  return getSplitFirstIp(nginx_ip, ',') || getSplitLastIp(remote_ip, ':');
}

function getSplitLastIp(ip_value, spilt_value) {
  if(ip_value) {
    let split_values = ip_value.split(spilt_value);
    let last_ip = split_values[split_values.length - 1];
    if(last_ip) {
      return last_ip.trim();
    }
  }
}

function getSplitFirstIp(ip_value, spilt_value) {
  if(ip_value) {
    let split_values = ip_value.split(spilt_value);
    let first_ip = split_values[0];
    if(first_ip) {
      return first_ip.trim();
    }
  }
}

module.exports = getRequestIp;
