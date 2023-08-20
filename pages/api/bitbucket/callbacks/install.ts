import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const topicName = 'rtapish-fromserver';
  const data = {
    'repository_provider': 'bitbucket',
    'installation_code': req.query.code};
  const msgtype = 'install_callback';
  console.log("Publishing message: {}", data);
  try {
    await publishMessage(topicName, data, msgtype);
  } catch (error) {
    console.error('Error publishing message:', error);
    res.status(500).json({ error: '<failure>Failed to publish message. Data must be in the form of a Buffer.</failure>' });
  }
  res.redirect('/u');
}