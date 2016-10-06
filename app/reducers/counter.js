import update from 'react-addons-update';

export default function reducer(state = { count: 0 }, action) {
  const count = state.count;
  switch (action.type) {
    case 'INCREAMENT':
      return update(state, {
        count: { $set: count + 1 },
      });
    case 'DECREAMENT':
      return { ...state, count: count - 1 };
    default:
      return state;
  }
}
