const errors = require('../../../errors').default;
const { createLogger, logHelper } = require('./utils');
const http = require('http');

class MotionClient {
    constructor(config) {
        const { host, path, port } = config.endpoint;

        this.clientType = 'motion';
        this._bucketMatch = config.bucketMatch;
        this._dataStoreName = config.dataStoreName;
        this._host = host;
        this._path = path;
        this._port = port;
    }

    setup(cb) {
        return cb();
    }

    toObjectGetInfo(objectKey, bucketName) {
        return {
            key: objectKey,
            dataStoreName: this._dataStoreName,
        };
    }

    put(stream, size, keyContext, reqUids, callback) {
        const log = createLogger(reqUids);

        // Make http request to motion
        const reqParams = {
            hostname: this._host,
            port: this._port,
            path: this._path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        };
        console.log(reqParams);
        const request = http.request(reqParams, response => {
            response.once('readable', () => {
                const rawBody = response.read();
                const body = (rawBody === null ? '' : rawBody.toString());
                log.debug('motion response body', { body });

                let fields;
                try {
                    fields = JSON.parse(body);
                } catch (err) {
                    log.error('error parsing response from motion', {
                        error: err,
                        method: 'put',
                    });
                    console.log("error parsing response from motion", err);
                    callback(err);
                }

                // expects 201
                if (response.statusCode !== 201) {
                    let error = fields.error;
                    if (!error) {
                        log.error('error from motion response: expected "error" property on response body', {
                            fields: fields,
                            method: 'put',
                        });
                        error = new Error(body);
                    }
                    console.log('error from motion response: expected "error" property on response body', error);
                    return callback(error);
                }

                // expects id property on response body
                let dataId = fields.id;
                if (!dataId) {
                    log.error('error from motion response: expected "id" property on response body', {
                        fields: fields,
                        method: 'put',
                    });
                    error = new Error(body);
                    console.log('error from motion response: expected "id" property on response body', error);
                    return callback(error);
                }
                return callback(null, dataId);
            });
        }).on('finish', () => {
            log.debug('finished sending PUT data to motion', {
                method: 'put',
                contentLength: size,
            });
        }).on('error', err => {
            console.log('error on request to motion', err);
            callback(err);
        });

        // pipe input to request stream
        stream.pipe(request);
        stream.on('error', err => {
            log.error('error from motion data backend', {
                error: err,
                method: 'put',
            });
            console.log('error from motion data backend', err);
            request.end();
        });
    }

    get(objectGetInfo, range, reqUids, callback) {
        const log = createLogger(reqUids);

        // Make http request to motion
        const reqParams = {
            hostname: this._host,
            port: this._port,
            path: this._path + `/${objectGetInfo.key}`,
            method: 'GET',
            agent: this._httpAgent
        };
        console.log(reqParams);
        const request = http.request(reqParams, response => {
            response.once('readable', () => {
                if (response.statusCode !== 200) {
                    const rawBody = response.read();
                    const body = (rawBody === null ? '' : rawBody.toString());
                    console.log(body);
                    let error = fields.error;
                    if (!error) {
                        log.error('error from motion response: expected "error" property on response body', {
                            fields: fields,
                            method: 'get',
                        });
                        error = new Error(body);
                    }
                    return callback(error);
                }
                return callback(null, response);
            });
        }).on('error', callback);

        request.end();
    }

    delete(objectGetInfo, reqUids, callback) {
        const log = createLogger(reqUids);
        logHelper(log, 'error', 'Not implemented', errors.NotImplemented,
            this._dataStoreName, this.clientType);
        return callback(errors.NotImplemented);
    }

    // TODO: Implement a healthcheck
    healthcheck(location, callback) {
        const fsResp = {};
        return callback(null, fsResp);
    }

}

module.exports = MotionClient;
