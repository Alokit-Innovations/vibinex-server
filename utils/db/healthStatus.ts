import conn from ".";

export const saveHealthStatusToDB = async (healthStatus: string, ts: string, topicId: string) => {
	const healthStatusQuery = `
	UPDATE users
	SET health_status = $1
		health_ts = $2
	WHERE topic_name = $3;
	`;
	// TODO - convert ts into actual timestamp from string
	// const timestamp = new Date(ts).toISOString();
	const { rows } = await conn.query(healthStatusQuery, [healthStatus, ts, topicId]).catch(err => {
		console.error(`[getGitEmailAliasesFromDB] Error getting aliases for user ${topicId}:`, err);
		throw new Error("Error getting aliases from the database");
	})
} 