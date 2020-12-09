const splitId = (groupId) => {
  const split = groupId.split("_");
  const id = split[1];
  return id;
};

const isAlreadyMember = (groupId) => {
  let alreadyMember = false;
  const groups = JSON.parse(localStorage.undercoverElfGroups);
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].groupId === `group_${groupId}`) {
      alreadyMember = true;
      return alreadyMember;
    } else continue;
  }
};

export { splitId, isAlreadyMember };
