const ENV = require('../../config/env')
const URL = require("../url.js")
const REQ = require("../request.js")

//注册
exports.Register = (openid, name, avatar, sex, success, fail) => {
	let plantform="qq";
	// #ifdef MP-WEIXIN
	 plantform="wx"
	// #endif
	
	const url = ENV.app.host + URL.user.register;
	REQ.request(url, {
		openid,
		name,
		plantform,
		avatar,
		sex
	}).then(function(info) {
		if (success) {
			success(info)
		}
	}).catch(function(error) {
		console.log(error)
		uni.hideLoading();
		uni.showToast({
			title: error,
			icon: 'none'
		})
	});
}

exports.Login = (openid, success, fail) => {
	const url = ENV.app.host + URL.user.login;
	REQ.request(url, {
		openid
	}).then(function(info) {
		if (success) {
			success(info)
		}
	}).catch(function(error) {
		console.log(error)
		uni.hideLoading();
		uni.showToast({
			title: error,
			icon: 'none'
		})
	});
}

exports.MyInfo = (uid,success, fail) => {
	const url = ENV.app.host + URL.user.myinfo;
	REQ.request(url, {
		uid
	}).then(function(info) {
		if (success) {
			success(info)
		}
	}).catch(function(error) {
		console.log(error)
		uni.hideLoading();
		uni.showToast({
			title: error,
			icon: 'none'
		})
	});
}
