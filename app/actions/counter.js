const increaseActionType = 'INCREAMENT';
const decreaseActionType = 'DECREAMENT';

export const increaseAction = () => {
  return {
    type: increaseActionType,
  };
};

export const decreaseAction = () => {
  return {
    type: decreaseActionType,
  };
};

export const fetchData = (forUrl) => {
  return function (dispatch, getState) {
    try {
      return fetch(forUrl);  // eslint-disable-line no-undef
    } catch (error) {
      throw error;
    }
  };
};
