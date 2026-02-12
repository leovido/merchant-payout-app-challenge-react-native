/**
 * Jest mock for screen-security. Used so CI does not need to resolve the real
 * native module. Tests control the return value via setGetDeviceIdImpl() and
 * setIsBiometricAuthenticatedImpl().
 */
let getDeviceIdImpl = () => "";

function getDeviceId() {
	return getDeviceIdImpl();
}

function setGetDeviceIdImpl(fn) {
	getDeviceIdImpl = fn;
}

let isBiometricAuthenticatedImpl = () => Promise.resolve(true);

function isBiometricAuthenticated() {
	return isBiometricAuthenticatedImpl();
}

function setIsBiometricAuthenticatedImpl(fn) {
	isBiometricAuthenticatedImpl = fn;
}

function addScreenshotListener() {
	return { remove: () => {} };
}

module.exports = {
	addScreenshotListener,
	getDeviceId,
	isBiometricAuthenticated,
	setGetDeviceIdImpl,
	setIsBiometricAuthenticatedImpl,
};
