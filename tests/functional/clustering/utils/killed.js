'use strict'; // eslint-disable-line

const Logger = require('werelogs').Logger;
const http = require('http');
const Clustering = require('../../../../lib/Clustering').default;
const Cluster = require('cluster');

const log = new Logger('S3', {
    level: 'trace',
    dump: 'warn',
});

const ErrorCodes = {
    noError: 0,
    WorkerNotRestarted: 1,
    WorkerNotExited: 2,
};
let result = ErrorCodes.noError;

const clusters = new Clustering(4, log);
clusters.start(current => {
    http.createServer(req => {
        if (req.url === '/crash') {
            throw new Error('Wanted crash');
        }
    }).listen(14000, () => {
        log.info('listening', {
            id: current.getIndex(),
        });
    });
}).onExit(current => {
    if (current.isMaster()) {
        return setTimeout(() => {
            if (result !== ErrorCodes.noError) {
                return process.exit(result);
            }
            current.getWorkers().forEach(worker => {
                if (worker) {
                    result = ErrorCodes.WorkerNotExited;
                }
            });
            return process.exit(result);
        }, 500);
    }
    log.info('exiting', {
        id: current.getIndex(),
    });
    return process.exit(0);
});

if (Cluster.isMaster) {
    let kill = true;
    const watchdog = setInterval(() => {
        if (kill) {
            kill = false;
            const req = http.get({
                path: '/crash',
                port: 14000,
            }, () => {});
            req.on('error', () => {});
            return undefined;
        }
        kill = true;
        return clusters.getWorkers().forEach((worker, i) => {
            if (!worker) {
                log.error('Worker not restarted', {
                    id: i,
                });
                result = ErrorCodes.WorkerNotRestarted;
                return undefined;
            }
            try {
                return process.kill(worker.process.pid, 0);
            } catch (e) {
                log.error('Worker not restarted', {
                    id: i,
                });
                result = ErrorCodes.WorkerNotRestarted;
                return undefined;
            }
        });
    }, 500);
    setTimeout(() => {
        clearInterval(watchdog);
        process.kill(process.pid, 'SIGINT');
    }, 5000);
}
