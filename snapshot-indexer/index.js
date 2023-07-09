const { default: axios } = require("axios");
const fs = require("fs");

const SNAPSHOT_URL = "https://hub.snapshot.org/graphql";

const USER_SCHEMA = `query {
    users(first: 10, where: { id_in: [< >] }) {
      id
      name
      about
      avatar
    }
  }`;

async function getAllSpaces() {
	function schema(offset) {
		const GET_SPACES_SCHEMA = `
            query Spaces {
              spaces(
                first: 1000,
                skip: ${offset},
                orderBy: "created",
                orderDirection: asc
              ) {
                id
                name
                about
                network
                symbol
                strategies {
                  name
                  params
                }
              }
            }`;
		return GET_SPACES_SCHEMA;
	}

	const spaces = [];

	for (let i = 0; ; i++) {
		try {
			const data = await axios.post(SNAPSHOT_URL, {
				query: schema(1000 * i),
				variables: null,
			});

			if (data.data.data.spaces.length === 0) break;
			spaces.splice(spaces.length, 0, ...data.data.data.spaces);
		} catch (e) {
			throw e;
		}
	}

	return spaces;
}

async function getProposals() {
	const PROPOSAL_SCHEMA = `query Proposals {
    proposals (
      first: 1000,
      skip: 0,
      where: {
        space_in: ["starknet.eth"],
      },
      orderBy: "created",
      orderDirection: desc
    ) {
      id
    }
  }`;

	let proposals = [];

	try {
		const data = await axios.post(SNAPSHOT_URL, {
			query: PROPOSAL_SCHEMA,
			variables: null,
		});
		proposals = data.data.data.proposals;
	} catch (e) {
		throw e;
	}

	return proposals;
}

async function getVoters(proposal) {
	function schema(proposal_id) {
		const VOTES_SCHEMA = `query Votes {
        votes (
          first: 1000
          skip: 0
          where: {
            proposal: "${proposal_id}"
          }
          orderBy: "created",
          orderDirection: desc
        ) {
          voter
        }
      }
      `;
		return VOTES_SCHEMA;
	}

	const users = [];

	for (let i = 0; i < proposal.length; i++) {
		try {
			const data = await axios.post(SNAPSHOT_URL, {
				query: schema(proposal[i].id),
				variables: null,
			});
			data.data.data.votes.forEach((vote) => {
				if (users.includes(vote.voter)) return;
				users.push(vote.voter);
			});
		} catch (e) {
			throw e;
		}
	}

	return users;
}

async function getUserFollows(user) {
	function schema(user_id) {
		const USER_FOLLOWS_SCHEMA = `query {
            follows(
            first: 1000,
            where: {
                follower: "${user_id}"
            }
            ) {
            space {
                id
            }
            }
        }`;

		return USER_FOLLOWS_SCHEMA;
	}

	let data = [];

	for (let i = 0; i < user.length; i++) {
		try {
			let user_id = user[i].id;
			let follows = [];

			const res = await axios.post(SNAPSHOT_URL, {
				query: schema(user_id),
				variables: null,
			});

			res.data.data.follows.forEach((follow) => {
				follows.push(follow.space.id);
			});

			data.push({
				delegate: {
					id: user[i].id,
				},
				follows,
			});
		} catch (e) {
			throw e;
		}
	}

	return data;
}

async function getUserVotes(user) {
	function schema(user_id) {
		const SCHEMA = `query Votes {
            votes (
              first: 1000
              skip: 0
              where: {
                voter: "${user_id}" 
              }
              orderBy: "created",
              orderDirection: desc
            ) {
              created
              proposal {
                id
                title
              }
              space {
                id
              }
            }
          }`;

		return SCHEMA;
	}

	let data = [];

	for (let i = 0; i < user.length; i++) {
		try {
			let user_id = user[i].id;
			let votes = [];

			const res = await axios.post(SNAPSHOT_URL, {
				query: schema(user_id),
				variables: null,
			});

			res.data.data.votes.forEach((vote) => {
				votes.push(vote);
			});

			data.push({
				delegate: {
					id: user_id,
				},
				votes,
			});
		} catch (e) {
			throw e;
		}
	}

	return data;
}
async function getUserProfile(user) {
	function schema(user_id) {
		const SCHEMA = `query {
            users(first: 1, where: { id: "${user_id}" }) {
              name
              about
              avatar
            }
          }
          `;

		return SCHEMA;
	}

	let data = [];

	for (let i = 0; i < user.length; i++) {
		try {
			let user_id = user[i].id;

			const res = await axios.post(SNAPSHOT_URL, {
				query: schema(user_id),
				variables: null,
			});

			data.push({
				delegate: {
					id: user_id,
				},
				profile: res.data.data.users[0] || { name: "", about: "", avatar: "" },
			});
		} catch (e) {
			throw e;
		}
	}

	return data;
}

async function start() {
	// get all proposals from starknet.eth space
	// const proposals = await getProposals();
	// fs.writeFileSync(
	// 	"proposals.json",
	// 	JSON.stringify({
	// 		space: { id: "starknet.eth" },
	// 		proposals,
	// 	})
	// );
	//
	// fetch all voters from the proposals
	// const proposals = fs.readFileSync("proposals.json", "utf-8");
	// const voters = await getVoters(JSON.parse(proposals).proposals);
	// fs.writeFileSync(
	// 	"voters.json",
	// 	JSON.stringify({
	// 		space: { id: "starknet.eth" },
	// 		delegates: voters.map((voter) => {
	// 			return {
	// 				id: voter,
	// 			};
	// 		}),
	// 	})
	// );
	//
	// // fetch all spaces the user follows
	// const delegates = JSON.parse(fs.readFileSync("delegates.json", "utf-8"));
	// const delegate_follows = await getUserFollows(delegates.delegates.slice(99, 130));
	// fs.writeFileSync("delegates_follows.json", JSON.stringify(delegate_follows));
	//
	// // fetch all votes the user has made
	// const delegates = JSON.parse(fs.readFileSync("starknet_delegates.json", "utf-8"));
	// const delegates_votes = await getUserVotes(delegates.delegates.slice(100, 130));
	// fs.writeFileSync("delegates_votes1.json", JSON.stringify(delegates_votes));
	//
	// const delegates = JSON.parse(fs.readFileSync("delegates.json", "utf-8"));
	// const delegates_profile = await getUserProfile(delegates.delegates.slice(100, 130));
	// fs.writeFileSync("delegates_profile1.json", JSON.stringify(delegates_profile));
}

start();
