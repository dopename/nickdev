const initialState = {
	list_items: [{id:1, text:"this is number 1"}],
}

export default const test = (state = initialState, action) => {
	switch (action.type) {
		case "ADD_ITEM":
			var returnState = state
			var addData = {id:action.id, text:action.text}
			returnState.list_items = [...returnState.list_items, addData]
			return returnState
		default:
			return state;
	}
};