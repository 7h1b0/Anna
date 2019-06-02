export default (received: unknown) => {
  if (typeof received !== 'number') {
    return false;
  }
  return [200, 201, 204].includes(received);
};
