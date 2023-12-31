const async = require('async');
const BucketInfo = require('../../../../../lib/models/BucketInfo').default;
const assert = require('assert');

/**
    * Puts multpile versions of an object
    * @param {Object} metadata - metadata client
    * @param {String} bucketName - bucket name
    * @param {String} objName - object key
    * @param {Object} objVal - object metadata
    * @param {Object} params - versioning parameters
    * @param {number} versionNb - number of versions to put
    * @param {number} timestamp - used for last-modified
    * @param {Object} logger - a Logger instance
    * @param {Function} cb - callback
    * @returns {undefined}
*/
function putBulkObjectVersions(metadata, bucketName, objName, objVal, params, versionNb, timestamp, logger, cb) {
    let count = 0;
    const versionIds = [];
    return async.whilst(
        () => count < versionNb,
        cbIterator => {
            count++;
            const lastModified = new Date(timestamp + count).toISOString();
            const finalObjectVal = Object.assign(objVal, { 'last-modified': lastModified });
            return metadata.putObjectMD(bucketName, objName, finalObjectVal, params, logger, (err, data) => {
                versionIds.push(JSON.parse(data).versionId);
                return cbIterator(err, versionIds);
            });
        }, (err, expectedVersionIds) => {
            // The last version is removed since it represents the current version.
            const lastVersionId = expectedVersionIds.pop();
            // array is reversed to be alligned with the version order (latest to oldest).
            expectedVersionIds.reverse();
            return cb(err, { lastVersionId, expectedVersionIds });
        });
}

function makeBucketMD(bucketName) {
    return BucketInfo.fromObj({
        _name: bucketName,
        _owner: 'testowner',
        _ownerDisplayName: 'testdisplayname',
        _creationDate: new Date().toJSON(),
        _acl: {
            Canned: 'private',
            FULL_CONTROL: [],
            WRITE: [],
            WRITE_ACP: [],
            READ: [],
            READ_ACP: [],
        },
        _mdBucketModelVersion: 10,
        _transient: false,
        _deleted: false,
        _serverSideEncryption: null,
        _versioningConfiguration: null,
        _locationConstraint: 'us-east-1',
        _readLocationConstraint: null,
        _cors: null,
        _replicationConfiguration: null,
        _lifecycleConfiguration: null,
        _uid: '',
        _isNFS: null,
        ingestion: null,
    });
}

function assertContents(contents, expected) {
    assert.strictEqual(contents.length, expected.length);
    contents.forEach((c, i) => {
        assert.strictEqual(c.key, expected[i].key);
        assert.strictEqual(c.value.LastModified, expected[i].LastModified);
        assert.strictEqual(c.value.staleDate, expected[i].staleDate);
        assert.strictEqual(c.value.dataStoreName, expected[i].dataStoreName);
        if (expected[i].VersionId) {
            assert.strictEqual(c.value.VersionId, expected[i].VersionId);
        }
    });
}

/**
* Sets the "deleted" property to true
* @param {Object} collection - collection to be updated
* @param {string} key - object name
* @param {Function} cb - callback
* @return {undefined}
*/
function flagObjectForDeletion(collection, key, cb) {
    collection.updateMany(
        { 'value.key': key },
        { $set: { 'value.deleted': true } },
        { upsert: false })
        .then(() => cb())
        .catch(err => cb(err));
}

module.exports = {
    putBulkObjectVersions,
    makeBucketMD,
    assertContents,
    flagObjectForDeletion,
};
