import * from "../actions/actionTypes";


const initialState = {
	user: {
		token: "",
		username: "",
		pk: "",
	}
	mobile: null,
	sideNav: null,
	activeList: null,
	activeProject: null

};

const home = (state = initialState, action) => {
	switch (action.type) {
		case "VERIFY_TOKEN":
			let userData = verifyToken(action.token);
			return {...state, user: userData};
		case "REFRESH_TOKEN":
			let userData = refreshToken(action.token);
			return {...state, user: userData};
		default:
			return state;
	}
};

function verifyToken(token) {
	fetch('https://www.nicksdevenv.com/token-verify/', {
		method:'post',
		headers: {
			"content-type":"application/json",
			Authorization:"JWT " + token
		},
		body: JSON.stringify({token:token})
	})
	.then(response => {
		if (response.ok) {
			return response.json()
		}
	})
}

function refreshToken(token) {
	fetch('https://www.nicksdevenv.com/token-refresh/', {
		method:'post',
		headers: {
			"content-type":"application/json",
			Authorization:"JWT " + token
		},
		body: JSON.stringify({token:token})
	})
	.then(response => {
		if (response.ok) {
			return response.json()
		}
	})
}

export default home;