// import * from "./actionTypes.js";

export const verifyToken = (token) => {
	return {
		type: "VERIFY_TOKEN",
		token,
	}
}

export const refreshToken = (token) => {
	return {
		type: "REFRESH_TOKEN",
		token,
	}
}

export const authToken = (username, password) => {
	return {
		type: "AUTH_TOKEN",
		data
	}
}