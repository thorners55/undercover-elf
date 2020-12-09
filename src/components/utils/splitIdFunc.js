const splitId = (groupId) => {
  const split = groupId.split("_");
  const id = split[1];
  return id;
};

export { splitId };
