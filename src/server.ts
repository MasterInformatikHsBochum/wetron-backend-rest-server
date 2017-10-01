import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser'
import { GameManager } from './game-manager';

export class Server {
    private _app: express.Application;

    constructor() {
        this._app = express();
        this.config();
        this.routes();
        this.api();

        this._app.listen(3000);
    }

    private config() {
        //use logger middlware
        this._app.use(morgan("dev"));

        this._app.use(bodyParser.urlencoded({
            extended: true
        }));

        this._app.use(bodyParser.json());
    }

    private routes() {
        let router = express.Router();

        router.get('/games/', (req, res, next) => {
            GameManager.getGames()
            .then(function(gameIds) {
                res.json(gameIds);
            })
            .catch(function(error) {
                res.status(404).send(error);
            });
        })

        router.get('/games/:id', (req, res, next) => {
            const id = req.params.id;
            const name = `wetron-backend-game-server-${id}`;

            GameManager.getGameStatus(name)
            .then(function(status) {
                res.send(status);
            })
            .catch(function(error) {
                res.sendStatus(404).send(error);
            });
        })

        router.post('/games/', (req, res, next) => {
            try {
                const id = parseInt(req.body['id']);
                const maxPlayers = parseInt(req.body['maxPlayers']);

                GameManager.startGame(id, maxPlayers)
                .then(function(status) {
                    res.send(status);
                })
                .catch(function(error) {
                    res.sendStatus(404).send(error);
                });
            } catch (error) {
                res.sendStatus(404).send(error);
            }
        })

        this._app.use('/', router);
    }

    private api() {

    }
}
