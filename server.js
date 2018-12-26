import 'babel-polyfill';
import express          from 'express'
import cors             from  'cors'
import bodyParser       from  'body-parser'
import path             from  'path'
import express_graphql  from  'express-graphql'
import mongoose         from 'mongoose'
import fs               from 'fs'
// Roote
import IndexRoute    from  './routes/index'
import IndexServices from './routes/services'
// GraphQl Schema
import schema     from  './schema/schema';
// Settings
import config from './settings/config'
import { errorType } from './settings/errors'
// permisson
import checkpermission from  './middlewar/check-permissions'


// create directory if not exists






// traitement of error 

const getErrorCode = errorName => {
	return errorType[errorName];
}

const ObjectId = mongoose.Types.ObjectId;
ObjectId.prototype.valueOf = function () {
	return this.toString();
};
// Create an express server and GraphQlendpoint
const app = express()

app.use(cors({origin : '*'}));
app.use(bodyParser.json({ 'type': '*/*',limit: '20mb' })); 
app.use(express.static(path.resolve('./public')));

mongoose.connect(config.mongodb.uri,
{ autoReconnect:true,
    poolSize: 20,
	socketTimeoutMS: 480000,
	keepAlive: 300000,
    keepAliveInitialDelay : 300000,
	connectTimeoutMS: 30000,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 1000,
	useNewUrlParser: true,
	useCreateIndex: true,
 }
);
const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully!');
});

app.use('/graphql',checkpermission, express_graphql({
   schema: schema,
   withCredentials: true,
   graphiql: true,
   formatError: (err) => {
	   let error = getErrorCode(err.message);
	    if(error){
            return ({ message: error.message, statusCode: error.statusCode})
        }else{
            console.log(err)
            return ({ message: "unknown error", statusCode: 501})
        }
	   
	   }
	   
   }

))

app.use('/services',IndexServices);
app.use('/',IndexRoute);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(4400, () => {
	console.log('Server Now Running On Port 4400!');

    let prepare_dir = config.styleImage;
    let root_path   = `./public/assets/image`;

    for(let item of prepare_dir){
        let super_dir = item.path;
        if (!fs.existsSync(`${root_path}/${super_dir}`)){
            fs.mkdirSync(`${root_path}/${super_dir}`);
        }
        for(let itm of item.data_path){
            let second_dir = itm.path;
            if (!fs.existsSync(`${root_path}/${super_dir}/${second_dir}`)){
                fs.mkdirSync(`${root_path}/${super_dir}/${second_dir}`);
            }
            for(let im of itm.data_path){
                let third_dir = `${root_path}/${super_dir}/${second_dir}/${im.path}`;
                if (!fs.existsSync(third_dir)){
                    fs.mkdirSync(third_dir);
                }
            }
        }
    }
    
})