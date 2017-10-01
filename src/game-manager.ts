import * as Docker from 'dockerode';

export namespace GameManager {
    const docker = new Docker();

    export function getGames(): Promise<number[]> {
        let r: number[] = [];

        return new Promise((resolve, reject) => {
            docker.listContainers().then(containers => {
                containers.map(container => {
                    try {
                        if (container.Names.length > 0) {
                            if (container.Names[0].indexOf('wetron-backend-game-server') >= 0) {
                                const fields = container.Names[0].split('-');
                                const gameId: number = parseInt(fields[fields.length -1]);
    
                                r.push(gameId);
                            }
                        }
                    } catch(e) {}
                });
    
                resolve(r);
            }).catch(error => {
                reject(error);
            });
        });
    }
    
    export function startGame(gameId: number, maxPlayers: number): Promise<string> {
        return new Promise((resolve, reject) => {
            docker.createContainer({
                    Image: 'wetron-backend-game-server:master',
                    name: `wetron-backend-game-server-${gameId}`,
                    Tty: true,
                    Cmd: [`g=${gameId}`, `p=${maxPlayers}`],
                    // HostConfig: {
                    //     AutoRemove: true
                    // }
                }, (error, container) => {
                    if (error) {
                        reject(error);
                    } else {
                        container.start((error, data) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(JSON.stringify(
                                    {
                                        id: gameId
                                    }
                                ));
                            }
                        });
                    }
            });
        });
    }
    
    export function getGameStatus(name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const container = docker.getContainer(name);
    
            if (container) {
                container.exec({Cmd: ['cat', '/tmp/game-status.json'], AttachStdout: true}, function(error, exec) {
                    if (error) {
                        reject(error);
                    } else {
                        exec.start({hijack: true, stdin: true}, function(error, stream) {
                            if (error) {
                                reject(error);
                            } else {
                                const chunks = [];

                                stream.on('data', function (chunk) {
                                    chunks.push(chunk);
                                });

                                stream.on('end', function () {
                                    resolve(chunks.join().replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, ''));
                                });
                            }
                        });
                    }
                });
            } else {
                reject('No game found.');
            }
        });
    }
}
