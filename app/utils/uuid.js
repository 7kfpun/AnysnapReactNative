function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random()*16|0;  // eslint-disable-line no-bitwise,space-infix-ops
    const v = c === 'x' ? r : (r&0x3|0x8);  // eslint-disable-line no-bitwise,no-mixed-operators,space-infix-ops
    return v.toString(16);
  });
}

export default uuid;
