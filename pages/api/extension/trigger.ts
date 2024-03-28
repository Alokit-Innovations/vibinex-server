import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getRepoConfigByUserAndRepo } from '../../../utils/db/repos';
import { DbUser, getUserByAlias } from '../../../utils/db/users';

export default async function triggeHandler(req: NextApiRequest, res: NextApiResponse) {
	// For cors prefetch options request
	if (req.method == "OPTIONS") {
		res.status(200).send("Ok");
		return;
	}
	// For normal requests
	console.info("[extension/triggeHandler] Getting setup repos info for ", req.body.url);

	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
		return;
	}
    const user = await getToken({ req: req }).catch((err) => {
		console.error("[extension/triggeHandler] Error getting user token", err);
		return null;
	});
    if (!user?.email) {
        console.error("[extension/triggeHandler] Error getting user");
        res.status(401).json({ error: 'Unauthenticated', message: 'Incorrect auth token in request' });
		return;
	}
	const { url } = req.body;
	if (!url) {
        console.error("[extension/triggeHandler] Error parsing url");
		res.status(400).json({ error: 'Bad Request', message: 'url is required in the request body' });
		return;
	}
    
	try {
		await triggerDPU(url, user.email);	
	} catch (error) {
		console.error('[extension/triggeHandler] Error triggering dpu for: ' + user.id + ' and pr: ' + url, error);
		res.status(500).json({ error: 'Internal Server Error', message: 'An error occurred while triggering dpu' });
		return;
	}
    res.status(200).json({message: "DPU triggered!"});
}
async function triggerDPU(url: string, userEmail: string) {
    // parse url for repo name, owner, pr, provider
    const {repoProvider, repoOwner, repoName, prNumber} = parseURL(url);
    // get user id
    const users: DbUser[] | undefined = await getUserByAlias(userEmail).catch((err) => {
		console.error(`[triggerDPU] Unable to get user for alias ${userEmail}, error = ${err}`);
		throw new Error("Unable to get user from db");
	});
	if (!users || users?.length == 0) {
		console.error(`[triggerDPU] Unable to find user for alias ${userEmail}`);
		throw new Error("User not found in db");
	}
	const userId = users[0].id;
	if (!userId) {
		console.error(`[triggerDPU] Unable to find user id for user ${JSON.stringify(users[0])}`);
		throw new Error("User ID not found in db user");
	}
    // get repo config
    const repoConfig = await getRepoConfigByUserAndRepo(repoProvider, repoName, repoOwner, userId);
    // prepare body
    
    // get topic id
    // publish
    throw new Error('Function not implemented.');
}

function parseURL(url: string) {
    // Regular expression to match the GitHub pull request URL pattern
    const regex = /^https:\/\/github.com\/([^/]+)\/([^/]+)\/pull\/(\d+)$/;
    ///
    //     ^: This anchors the match to the beginning of the string. It ensures that the pattern starts matching from the very beginning of the URL.
    // https:\/\/github.com\/: This part of the regex is a literal match for the protocol (https://) and the domain (github.com/). 
    //Since some characters, like /, have special meanings in regex, they need to be escaped with a backslash (\) to be treated literally.
    // ([^/]+): This is a capturing group ((...)). [^/] is a character set that matches any character except /, and + means one or more occurrences of the preceding character set. 
    //So ([^/]+) matches and captures one or more characters that are not /. This group is capturing the repository owner.
    // \/: This matches the forward slash (/) after the repository owner. Again, it's escaped with a backslash to be treated as a literal character.
    // ([^/]+): Similar to the previous group, this captures one or more characters that are not /. This group captures the repository name.
    // \/pull\/: This matches the literal string /pull/. It indicates the beginning of the pull request number in the URL.
    // (\d+): This captures one or more digits (\d+). This group captures the pull request number.
    // $: This anchors the match to the end of the string. It ensures that the entire URL matches the pattern, and there are no extra characters at the end.
    
    // Match the URL with the regex
    const match = regex.exec(url);
    
    // Check if the URL matches the expected pattern
    if (!match) {
        throw new Error("Invalid GitHub pull request URL");
    }
    
    // Extract the matched groups
    const [_, repoOwner, repoName, prNumber] = match;
    
    // Extract the repo provider from the URL
    const repoProvider = "github";
    
    // Return the extracted information as an object
    return {
        repoProvider,
        repoOwner,
        repoName,
        prNumber: prNumber.toString()
    };
}


