export const initialState = { items: [] };

// let id = 0;

export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: action.id,
            title: action.title,
            desp: action.desp,
            dateTime: action.dateTime,
            done: false,
          },
        ],
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    // case "TOGGLE_DONE":
    //   return {
    //     ...state,
    //     items: state.items.map((item) =>
    //       item.id === action.payload ? { ...item, done: !item.done } : item,
    //     ),
    //   };

    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload ? { ...item, title: action.title, desp: action.desp } : item,
        ),
      };

    default:
      return state;
  }
};
