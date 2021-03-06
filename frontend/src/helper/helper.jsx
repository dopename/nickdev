

export function deleteAPICall(model, pk, title, token) {
	const url = "/api/destroy/" + model + "/" + pk + "/"

	var confirmed = window.confirm("Are you sure you want to delete the following objective: " + title +"?");

	if (confirmed) {
		return fetch(url, {
			method:"delete",
			headers: {
				Authorization: "JWT " + token,
			}
		})
	}
}

export function updateAPICall(model, pk, data, token, updateInURL) {
	var url = "/api/" + model + "/" + pk + "/"

	if (updateInURL) {
		url = "/api/update/" + model + "/" + pk + "/"
	}

	return fetch(url, {
		method:'put',
		headers: {
			Authorization: "JWT " + token,
			"Content-Type":"application/json",
		},
		body:JSON.stringify(data)
	})
}

export function createAPICall(model, data, token) {
	const url = "/api/" + model + "/"

	return fetch(url, {
		method:'post',
		headers: {
			"content-type":"application/json",
			Authorization: "JWT " + token,
		},
		body:JSON.stringify(data)
	})
}

export function fetchListAPICall(model, list, token) {
	const url = "https://www.nicksdevenv.com/api/" + model + "/"

	var queries = list.map((pk) => {
		return fetch(url + pk + '/', {
			headers: {
				Authorization: "JWT " + token,
				"Content-Type":"application/json",
			}
		})
		.then(response => response.json())
	})
	
	return queries
}
