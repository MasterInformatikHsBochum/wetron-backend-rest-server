import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyparser from 'body-parser'

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

        this._app.use(bodyparser.urlencoded({
            extended: true
        }));
    }

    private routes() {
        let router = express.Router();

        router.get('/games/', (req, res, next) => {
            res.json([{
                'id': 1,
                'player-count': 2,
                'name': 'game1'
            },
            {
                'id': 2,
                'player-count': 4,
                'name': 'game2'
            }
            ]);
        })

        router.get('/games/:id', (req, res, next) => {
            let id = req.params.id;
            res.json({
                'id': id,
                'player-count': 2,
                'name': 'game' + id
            }, )
        })

        router.post('/games/', (req, res, next) => {
            console.log(req.body);
            res.send('POST request to homepage');            
        })

        this._app.use('/', router);
    }

    private api() {

    }
}