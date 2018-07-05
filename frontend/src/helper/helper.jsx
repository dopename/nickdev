

export function deleteAPICall(pk, title, model, token) {
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

export function updateAPICall(pk, data, model, completeFunction) {
	const url = "/api/update/" + model + "/" + pk + "/"

	fetch(url, {
		method:'put',
		headers: {
			Authorization: `JWT ${localStorage.getItem('token')}`,
			"Content-Type":"application/json",
		},
		body:JSON.stringify(data)
	})
	.then(response => {
		if (response.ok) {
			completeFunction();
		}
	})
}

export function createAPICall(data, model, token) {
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
