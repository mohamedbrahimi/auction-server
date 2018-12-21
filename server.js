import 'babel-polyfill';
import express          from 'express'
import cors             from  'cors'
import bodyParser       from  'body-parser'
import path             from  'path'
import express_graphql  from  'express-graphql'
import mongoose         from 'mongoose'
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
	   try{
		return ({ message: error.message, statusCode: error.statusCode})
	   }catch(e){
          return err
	   }
	   
   }

}))

app.use('/services',IndexServices);
app.use('/',IndexRoute);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(4400, () => console.log('Server Now Running On Port 4400!'))