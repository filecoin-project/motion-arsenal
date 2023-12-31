import errors from '../errors'

const validServices = {
    aws: ['s3', 'iam', 'sts', 'ring'],
    scality: ['utapi', 'sso'],
};

export default class ARN {
    _partition: string;
    _service: string;
    _region: string | null;
    _accountId?: string | null;
    _resource: string;

    /**
     *
     * Create an ARN object from its individual components
     *
     * @constructor
     * @param partition - ARN partition (e.g. 'aws')
     * @param service - service name in partition (e.g. 's3')
     * @param [region] - AWS region
     * @param [accountId] - AWS 12-digit account ID
     * @param resource - AWS resource path (e.g. 'foo/bar')
     */
    constructor(
        partition: string,
        service: string,
        region: string | undefined | null,
        accountId: string | undefined | null,
        resource: string,
    ) {
        this._partition = partition;
        this._service = service;
        this._region = region || null;
        this._accountId = accountId || null;
        this._resource = resource;
    }

    static createFromString(arnStr: string) {
        const [arn, partition, service, region, accountId,
            resourceType, resource] = arnStr.split(':');

        if (arn !== 'arn') {
            return { error: errors.InvalidArgument.customizeDescription(
                'bad ARN: must start with "arn:"') };
        }
        if (!partition) {
            return { error: errors.InvalidArgument.customizeDescription(
                'bad ARN: must include a partition name, like "aws" in ' +
                    '"arn:aws:..."') };
        }
        if (!service) {
            return { error: errors.InvalidArgument.customizeDescription(
                'bad ARN: must include a service name, like "s3" in ' +
                    '"arn:aws:s3:..."') };
        }
        if (validServices[partition] === undefined) {
            return { error: errors.InvalidArgument.customizeDescription(
                `bad ARN: unknown partition "${partition}", should be a ` +
                    'valid partition name like "aws" in "arn:aws:..."') };
        }
        if (!validServices[partition].includes(service)) {
            return { error: errors.InvalidArgument.customizeDescription(
                `bad ARN: unsupported ${partition} service "${service}"`) };
        }
        if (accountId && !/^([0-9]{12}|[*])$/.test(accountId)) {
            return { error: errors.InvalidArgument.customizeDescription(
                `bad ARN: bad account ID "${accountId}": ` +
                    'must be a 12-digit number or "*"') };
        }
        const fullResource = (resource !== undefined ?
            `${resourceType}:${resource}` : resourceType);
        return new ARN(partition, service, region, accountId, fullResource);
    }

    getPartition() {
        return this._partition;
    }
    getService() {
        return this._service;
    }
    getRegion() {
        return this._region;
    }
    getAccountId() {
        return this._accountId;
    }
    getResource() {
        return this._resource;
    }

    isIAMAccount() {
        return this.getService() === 'iam'
            && this.getAccountId() !== null
            && this.getAccountId() !== '*'
            && this.getResource() === 'root';
    }
    isIAMUser() {
        return this.getService() === 'iam'
            && this.getAccountId() !== null
            && this.getAccountId() !== '*'
            && this.getResource().startsWith('user/');
    }
    isIAMRole() {
        return this.getService() === 'iam'
            && this.getAccountId() !== null
            && this.getResource().startsWith('role');
    }

    toString() {
        return ['arn', this.getPartition(), this.getService(),
            this.getRegion(), this.getAccountId(), this.getResource()]
            .join(':');
    }
}
