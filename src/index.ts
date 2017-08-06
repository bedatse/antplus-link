import * as config from 'config';
import * as PubSub from '@google-cloud/pubsub';
import * as Ant from 'ant-plus';

import { getGoogleCredentials } from './lib/credentials';

// Configurations
const pubsubApikey:string = config.get<string>(
  'google-credentials.api-keys.pubsub'
);
const pubsubTopicPrefix:string = config.get<string>('pubsub-topic-prefix');
const pubsubTopic:string = config.get<string>('pubsub-topic');

const pubsub = PubSub(getGoogleCredentials(pubsubApikey));

const topic = pubsub.topic(`${pubsubTopicPrefix}:${pubsubTopic}`);

const stick = new Ant.GarminStick2;
const scanner = new Ant.HeartRateScanner(stick);

function generateMsg(msg) {
  return {
    timestamp: new Date().toISOString(),
    message: msg,
  }
}

// Handle Ant+ scanner events
scanner.on('attached', function () { console.log('scanner attached'); });

scanner.on('detached', function () { console.log('scanner detached'); });

scanner.on('hbdata', function (data) {
  // console.log('scanner: ', data.DeviceID, data.ComputedHeartRate, data.Rssi);
  console.log({data});

  // topic.publish([generateMsg(data)])
  //   .then((res) => {
  //     console.log({ message: 'messageSent', response: res });
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });
});


// Handle ANT+ USB stick events
stick.on('startup', function () {
  console.log('scanner startup');
  console.log('Max channels:', stick.maxChannels);

  scanner.scan();
});

stick.on('shutdown', function () { console.log('shutdown'); });

if (!stick.open()) {
  console.log('Stick not found!');
} else {
  // setTimeout(function () { stick.close(); }, 60000);
}
