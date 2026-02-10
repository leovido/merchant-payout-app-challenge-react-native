/**
 * Jest mock for screen-security. Used so CI does not need to resolve the real
 * native module. Tests control the return value via setGetDeviceIdImpl().
 */
let getDeviceIdImpl = () => "";

function getDeviceId() {
	return getDeviceIdImpl();
}

function setGetDeviceIdImpl(fn) {
	getDeviceIdImpl = fn;
}

function addScreenshotListener() {
	return { remove: () => {} };
}

module.exports = {
	addScreenshotListener,
	getDeviceId,
	setGetDeviceIdImpl,
};
