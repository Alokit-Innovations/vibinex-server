import { NextApiRequest, NextApiResponse } from 'next';
import { saveTopicNameInUsersTable, createTopicName } from '../../../utils/db/relevance';
import { createTopicNameInGcloud } from '../../../utils/pubsub/pubsubClient';
import { DbUser, getUserById } from '../../../utils/db/users';

const pubsubHandler = async (req: NextApiRequest, res: NextApiResponse) => { // To be removed, only used for testing the functions
	console.info("[pubsubHandler] pub sub setup info in db...");
	const jsonBody = req.body;
	if (!jsonBody.userId) {
		console.error("[pubsubHandler] Invalid request body");
		res.status(400).json({ "error": "Invalid request body" });
		return;
	}
	const userData: DbUser = await getUserById(jsonBody.userId);
	if (!userData) {
		console.error(`[pubsubHandler] cannot get userData`);
		res.status(500).json({ "error": "Internal server error" });
		return;
	}
	if (!userData.topic_name) {
		const generatedTopic = await createTopicName(jsonBody.userId);
		if (!generatedTopic) {
			console.error(`[pubsubHandler] error in creating topic name`);
			res.status(500).json({ "error": "Internal server error" });
			return;
		}
		const gcloudTopic = await createTopicNameInGcloud(generatedTopic)
		if (!gcloudTopic) {
			console.error(`[pubsubHandler] error in creating topic in google cloud`);
			res.status(500).json({ "error": "Internal server error" });
			return;
		}
		await saveTopicNameInUsersTable(jsonBody.userId, generatedTopic)
			.then(() => {
				console.info("[pubsubHandler] Topic saved in db");
				res.status(200).json({ "installId": generatedTopic });
			})
			.catch((error) => {
				console.error("[pubsubHandler] Unable to save topic name in db, ", error);
				res.status(500).json({ "error": "Internal server error" });
			})
		return;
	}
	const topicName = userData.topic_name;
	console.info("[pubsubHandler] topic name created successfully and saved in db: ", topicName);
	res.status(200).json({ "installId": topicName });
	return;
}

export default pubsubHandler;
