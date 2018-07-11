export const addItem = (id, text) => {
	return {
		type: "ADD_ITEM",
		id, 
		text
	}
}