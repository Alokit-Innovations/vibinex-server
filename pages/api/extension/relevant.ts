import { NextApiRequest, NextApiResponse } from 'next'
import { getReviewData, getFileData, getHunkData } from '../../../utils/db/relevance'
import { getToken } from 'next-auth/jwt'
import { getUserEmails } from '../../../utils/db/users'

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getToken({req: req})
  let emails = new Set<String>();
  if (user && user.email) {
    emails = await getUserEmails(user.email);
  }
  return emails;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "OPTIONS") {
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Content-Type, Authorization");
    res.status(200).send("Ok");
    return;
  }
  console.info("Getting relevant info for ", req.body.repo_name);
  const user_emails = await getUser(req, res);
  const { type } = req.query;
  if ("repo_provider" in req.body && 
      "repo_owner" in req.body && 
      "repo_name" in req.body) {
      let formattedData;
      if (type === 'review') {
          let review_db = await getReviewData(req.body.repo_provider,
          req.body.repo_owner,
          req.body.repo_name,
          user_emails);
          formattedData = await formatReviewResponse(review_db);
      } else if (type === 'file') {
        if ("pr_number" in req.body) {
          let file_set = await getFileData(req.body.repo_provider,
          req.body.repo_owner,
          req.body.repo_name,
          req.body.pr_number,
          user_emails);
          formattedData = formatFileResponse(file_set);
        } else { res.status(400).send('Invalid request body'); return;}
      } else if (type === 'hunk') {
        if ("pr_number" in req.body) {
          let hunks_res = await getHunkData(req.body.repo_provider, 
          req.body.repo_owner, 
          req.body.repo_name, 
          req.body.pr_number,
          user_emails);
          formattedData = formatHunkResponse(hunks_res);
        } else { res.status(400).send('Invalid request body'); return;}
      } else {
          res.status(400).send('Invalid type parameter');
          return;
      }
      res.status(200).json(formattedData);
    } else {
      res.status(401).send('Invalid request body');
    }
}

const formatReviewResponse = async (query_res: Promise<{[key: string]: any}>[]) => {
  let prs = new Map();
  for (const promise of query_res) {
    const row = await promise;
	  const reviewId = row["review_id"].toString();
	  const blamevec = row["blamevec"];
	  const hunks = Array.isArray(blamevec) ? blamevec : [blamevec];
    if (hunks.length) {
      prs.set(reviewId, {"num_hunks_changed": hunks.length});
    }
  }
  const prsObj = {} as {[key: string]: any};
  prs.forEach((value, key) => {
    prsObj[key] = value;
  });
  return {"relevant": prsObj};
}

const formatFileResponse = (query_res: Set<String>) => {
  return {
    "files": Array.from(query_res)
  };
}

function formatHunkResponse(query_res: string) {
  return {
    "hunkinfo": query_res
  };
}

export default handler;