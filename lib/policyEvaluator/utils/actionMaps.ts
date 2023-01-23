const sharedActionMap = {
    bucketDelete: 's3:DeleteBucket',
    // the "s3:PutEncryptionConfiguration" action also governs DELETE
    bucketDeleteEncryption: 's3:PutEncryptionConfiguration',
    bucketDeletePolicy: 's3:DeleteBucketPolicy',
    bucketDeleteWebsite: 's3:DeleteBucketWebsite',
    bucketDeleteTagging: 's3:PutBucketTagging',
    bucketGet: 's3:ListBucket',
    bucketGetACL: 's3:GetBucketAcl',
    bucketGetCors: 's3:GetBucketCORS',
    bucketGetEncryption: 's3:GetEncryptionConfiguration',
    bucketGetLifecycle: 's3:GetLifecycleConfiguration',
    bucketGetLocation: 's3:GetBucketLocation',
    bucketGetNotification: 's3:GetBucketNotification',
    bucketGetObjectLock: 's3:GetBucketObjectLockConfiguration',
    bucketGetPolicy: 's3:GetBucketPolicy',
    bucketGetReplication: 's3:GetReplicationConfiguration',
    bucketGetVersioning: 's3:GetBucketVersioning',
    bucketGetWebsite: 's3:GetBucketWebsite',
    bucketGetTagging: 's3:GetBucketTagging',
    bucketHead: 's3:ListBucket',
    bucketPutACL: 's3:PutBucketAcl',
    bucketPutCors: 's3:PutBucketCORS',
    bucketPutEncryption: 's3:PutEncryptionConfiguration',
    bucketPutLifecycle: 's3:PutLifecycleConfiguration',
    bucketPutNotification: 's3:PutBucketNotification',
    bucketPutObjectLock: 's3:PutBucketObjectLockConfiguration',
    bucketPutPolicy: 's3:PutBucketPolicy',
    bucketPutReplication: 's3:PutReplicationConfiguration',
    bucketPutVersioning: 's3:PutBucketVersioning',
    bucketPutWebsite: 's3:PutBucketWebsite',
    bucketPutTagging: 's3:PutBucketTagging',
    bypassGovernanceRetention: 's3:BypassGovernanceRetention',
    listMultipartUploads: 's3:ListBucketMultipartUploads',
    listParts: 's3:ListMultipartUploadParts',
    metadataSearch: 's3:MetadataSearch',
    multipartDelete: 's3:AbortMultipartUpload',
    objectDelete: 's3:DeleteObject',
    objectDeleteTagging: 's3:DeleteObjectTagging',
    objectGet: 's3:GetObject',
    objectGetACL: 's3:GetObjectAcl',
    objectGetLegalHold: 's3:GetObjectLegalHold',
    objectGetRetention: 's3:GetObjectRetention',
    objectGetTagging: 's3:GetObjectTagging',
    objectHead: 's3:GetObject',
    objectPut: 's3:PutObject',
    objectPutACL: 's3:PutObjectAcl',
    objectPutLegalHold: 's3:PutObjectLegalHold',
    objectPutRetention: 's3:PutObjectRetention',
    objectPutTagging: 's3:PutObjectTagging',
    objectRestore: 's3:RestoreObject',
    objectPutVersion: 's3:PutObjectVersion',
};

// action map used for request context
const actionMapRQ = {
    bucketPut: 's3:CreateBucket',
    // for bucketDeleteCors need s3:PutBucketCORS permission
    // see http://docs.aws.amazon.com/AmazonS3/latest/API/
    // RESTBucketDELETEcors.html
    bucketDeleteCors: 's3:PutBucketCORS',
    bucketDeleteReplication: 's3:PutReplicationConfiguration',
    bucketDeleteLifecycle: 's3:PutLifecycleConfiguration',
    completeMultipartUpload: 's3:PutObject',
    initiateMultipartUpload: 's3:PutObject',
    objectDeleteVersion: 's3:DeleteObjectVersion',
    objectDeleteTaggingVersion: 's3:DeleteObjectVersionTagging',
    objectGetVersion: 's3:GetObjectVersion',
    objectGetACLVersion: 's3:GetObjectVersionAcl',
    objectGetTaggingVersion: 's3:GetObjectVersionTagging',
    objectPutACLVersion: 's3:PutObjectVersionAcl',
    objectPutPart: 's3:PutObject',
    objectPutTaggingVersion: 's3:PutObjectVersionTagging',
    serviceGet: 's3:ListAllMyBuckets',
    objectReplicate: 's3:ReplicateObject',
    objectGetRetentionVersion: 's3:GetObjectRetention',
    objectPutRetentionVersion: 's3:PutObjectRetention',
    objectGetLegalHoldVersion: 's3:GetObjectLegalHold',
    objectPutLegalHoldVersion: 's3:PutObjectLegalHold',
    listObjectVersions: 's3:ListBucketVersions',
    ...sharedActionMap,
};

// action map used for bucket policies
const actionMapBP = { ...sharedActionMap };

// action map for all relevant s3 actions
const actionMapS3 = {
    ...sharedActionMap,
    ...actionMapRQ,
    ...actionMapBP,
};

const actionMonitoringMapS3 = {
    bucketDelete: 'DeleteBucket',
    bucketDeleteCors: 'DeleteBucketCors',
    bucketDeleteEncryption: 'DeleteBucketEncryption',
    bucketDeleteLifecycle: 'DeleteBucketLifecycle',
    bucketDeletePolicy: 'DeleteBucketPolicy',
    bucketDeleteReplication: 'DeleteBucketReplication',
    bucketDeleteWebsite: 'DeleteBucketWebsite',
    bucketDeleteTagging: 'DeleteBucketTagging',
    bucketGet: 'ListObjects',
    bucketGetACL: 'GetBucketAcl',
    bucketGetCors: 'GetBucketCors',
    bucketGetLifecycle: 'GetBucketLifecycleConfiguration',
    bucketGetLocation: 'GetBucketLocation',
    bucketGetNotification: 'GetBucketNotification',
    bucketGetObjectLock: 'GetObjectLockConfiguration',
    bucketGetPolicy: 'GetBucketPolicy',
    bucketGetReplication: 'GetBucketReplication',
    bucketGetVersioning: 'GetBucketVersioning',
    bucketGetEncryption: 'GetBucketEncryption',
    bucketGetWebsite: 'GetBucketWebsite',
    bucketGetTagging: 'GetBucketTagging',
    bucketHead: 'HeadBucket',
    bucketPut: 'CreateBucket',
    bucketPutACL: 'PutBucketAcl',
    bucketPutCors: 'PutBucketCors',
    bucketPutLifecycle: 'PutBucketLifecycleConfiguration',
    bucketPutNotification: 'PutBucketNotification',
    bucketPutObjectLock: 'PutObjectLockConfiguration',
    bucketPutPolicy: 'PutBucketPolicy',
    bucketPutReplication: 'PutBucketReplication',
    bucketPutVersioning: 'PutBucketVersioning',
    bucketPutEncryption: 'PutBucketEncryption',
    bucketPutWebsite: 'PutBucketWebsite',
    bucketPutTagging: 'PutBucketTagging',
    completeMultipartUpload: 'CompleteMultipartUpload',
    initiateMultipartUpload: 'CreateMultipartUpload',
    listMultipartUploads: 'ListMultipartUploads',
    listParts: 'ListParts',
    metadataSearch: 'MetadataSearch',
    multiObjectDelete: 'DeleteObjects',
    multipartDelete: 'AbortMultipartUpload',
    objectCopy: 'CopyObject',
    objectDelete: 'DeleteObject',
    objectDeleteTagging: 'DeleteObjectTagging',
    objectGet: 'GetObject',
    objectGetACL: 'GetObjectAcl',
    objectGetLegalHold: 'GetObjectLegalHold',
    objectGetRetention: 'GetObjectRetention',
    objectGetTagging: 'GetObjectTagging',
    objectHead: 'HeadObject',
    objectPut: 'PutObject',
    objectPutACL: 'PutObjectAcl',
    objectPutCopyPart: 'UploadPartCopy',
    objectPutLegalHold: 'PutObjectLegalHold',
    objectPutPart: 'UploadPart',
    objectPutRetention: 'PutObjectRetention',
    objectPutTagging: 'PutObjectTagging',
    objectRestore: 'RestoreObject',
    serviceGet: 'ListBuckets',
};

const actionMapIAM = {
    attachGroupPolicy: 'iam:AttachGroupPolicy',
    attachUserPolicy: 'iam:AttachUserPolicy',
    createAccessKey: 'iam:CreateAccessKey',
    createGroup: 'iam:CreateGroup',
    createPolicy: 'iam:CreatePolicy',
    createPolicyVersion: 'iam:CreatePolicyVersion',
    createUser: 'iam:CreateUser',
    deleteAccessKey: 'iam:DeleteAccessKey',
    deleteGroup: 'iam:DeleteGroup',
    deleteGroupPolicy: 'iam:DeleteGroupPolicy',
    deletePolicy: 'iam:DeletePolicy',
    deletePolicyVersion: 'iam:DeletePolicyVersion',
    deleteUser: 'iam:DeleteUser',
    detachGroupPolicy: 'iam:DetachGroupPolicy',
    detachUserPolicy: 'iam:DetachUserPolicy',
    getGroup: 'iam:GetGroup',
    getGroupPolicy: 'iam:GetGroupPolicy',
    getPolicy: 'iam:GetPolicy',
    getPolicyVersion: 'iam:GetPolicyVersion',
    getUser: 'iam:GetUser',
    listAccessKeys: 'iam:ListAccessKeys',
    listEntitiesForPolicy: 'iam:ListEntitiesForPolicy',
    listGroupPolicies: 'iam:ListGroupPolicies',
    listGroups: 'iam:ListGroups',
    listGroupsForUser: 'iam:ListGroupsForUser',
    listPolicies: 'iam:ListPolicies',
    listPolicyVersions: 'iam:ListPolicyVersions',
    listUsers: 'iam:ListUsers',
    putGroupPolicy: 'iam:PutGroupPolicy',
    removeUserFromGroup: 'iam:RemoveUserFromGroup',
    updateAccessKey: 'iam:UpdateAccessKey',
    updateGroup: 'iam:UpdateGroup',
    updateRole: 'iam:UpdateRole',
    updateUser: 'iam:UpdateUser',
    getAccessKeyLastUsed: 'iam:GetAccessKeyLastUsed',
    generateCredentialReport: 'iam:GenerateCredentialReport',
    getCredentialReport: 'iam:GetCredentialReport',
    tagUser: 'iam:TagUser',
    unTagUser: 'iam:UntagUser',
    listUserTags: 'iam:ListUserTags',
};

const actionMapSSO = {
    SsoAuthorize: 'sso:Authorize',
};

const actionMapSTS = {
    assumeRole: 'sts:AssumeRole',
};

const actionMapMetadata = {
    admin: 'metadata:admin',
    default: 'metadata:bucketd',
};

export {
    actionMapRQ,
    actionMapBP,
    actionMapS3,
    actionMonitoringMapS3,
    actionMapIAM,
    actionMapSSO,
    actionMapSTS,
    actionMapMetadata,
};
