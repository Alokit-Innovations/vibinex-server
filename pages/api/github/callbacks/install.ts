import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';

const installHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const topicName = process.env.TOPIC_NAME;
	if (!topicName) {
		console.error('TOPIC_NAME not set');
		res.status(400).json({ error: 'Bad Request' });
		return;
	}
	if (!req.query.code) {
		console.error('Installation code not provided');
		res.status(400).json({ error: 'Bad Request' });
		return;
	}
	const data = {
		'repository_provider': 'github',
		'installation_code': req.query.code
	};
	const msgType = 'install_callback';
	console.info("Recieved installation code for github, published to ", topicName);
	const result: string | null = await publishMessage(topicName, data, msgType)
	.catch((error) => {
		console.error('[install_callback] Failed to publish message:', error);
		return null;
	});
	if (result == null) {
		res.status(500).json({ error: 'Internal Server Error' });
		return;
	}
	res.redirect('/u');
}

export default installHandler;