 //加密模块
 var crypto=require("crypto");

 //常规md5 sha256加密 //默认MD5
 function encode(text,type="md5"){
     var jiami=crypto.createHash(type);
     jiami.update(text,"utf-8");
     return jiami.digest('hex');
 }

 //生成hmac
function encodeHMAC(key,text,type="sha256",codeType="base64"){
    var hmac = crypto.createHmac(type, key);
    hmac.update(text,"utf-8");
    return hmac.digest(codeType);
}

//AES加密
//aes-128-ecb加密 key 必须为16位私钥
function encodeAES(key,data,type="aes-128-ecb",codeType="base64",iv=""){
    var cipherChunks = [];
    var cipher = crypto.createCipheriv(type, key,iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, "utf8", codeType));
    cipherChunks.push(cipher.final(codeType));
    return cipherChunks.join('');
}
//AES解密
//aes-128-ecb加密 key 必须为16位私钥
function decodeAES(key,data,type="aes-128-ecb",codeType="base64",iv=""){
    var cipherChunks = [];
    var decipher = crypto.createDecipheriv(type, key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, codeType, "utf8"));
    cipherChunks.push(decipher.final("utf8"));
    return cipherChunks.join('');
}

 module.exports={
    encode:encode,
    encodeHMAC:encodeHMAC,
    encodeAES:encodeAES,
    decodeAES:decodeAES
 }