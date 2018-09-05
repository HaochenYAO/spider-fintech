import mongoose from 'mongoose';
import config from '../config';

export default function () {
  mongoose.connect(`mongodb://${config('mongo').host}:${config('mongo').port}/spider`, { useNewUrlParser: true });
  const mongo = mongoose.connection;

  mongo.on('error', console.error.bind(console, 'connection error:'));
  mongo.once('open', () => {
    console.log('connection success');
  });
}
