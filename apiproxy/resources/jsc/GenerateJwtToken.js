var jwtSecret = 'aaaa';

function base64UrlEncode(source) {
	// Encode in classical base64
	var encodedSource = CryptoJS.enc.Base64.stringify(source);

	// Remove padding equal characters
	encodedSource = encodedSource.replace(/=+$/, '');

	// Replace characters according to base64url specifications
	encodedSource = encodedSource.replace(/\+/g, '-');
	encodedSource = encodedSource.replace(/\//g, '_');

	return encodedSource;
}

var jwtHeader = {
	alg: 'HS256',
	typ: 'JWT'
};

var jwtPayload = {
	jti: Math.floor((Math.random() * 1000000) + 1).toString(),
	aud: 'espacenet',
	sub: context.getVariable('request.header.X-Forwarded-For'),
	iat: Math.floor(Date.now() / 1000),
	exp: Math.floor(Date.now() / 1000) + (10*60),
	decisionExp: Math.floor(Date.now() / 1000) + (10*60),
};

var jwtHeaderUtf8 = CryptoJS.enc.Utf8.parse(JSON.stringify(jwtHeader));
var encodedHeader = base64UrlEncode(jwtHeaderUtf8);

var jwtPayloadUtf8 = CryptoJS.enc.Utf8.parse(JSON.stringify(jwtPayload));
var encodedPayload = base64UrlEncode(jwtPayloadUtf8);

var encodedHeaderAndPayload = encodedHeader + '.' + encodedPayload;

var jwtSignature = CryptoJS.HmacSHA256(encodedHeaderAndPayload, jwtSecret);
var encodedSignature = base64UrlEncode(jwtSignature);

var jwtToken = encodedHeaderAndPayload + '.' + encodedSignature;

context.setVariable('response.header.x-jwtToken', jwtToken);