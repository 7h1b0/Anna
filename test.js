const timestamp = new Date().getTime();
const object = { date: 1};
const newObject = Object.assign(object, { date: timestamp});
console.log(newObject);