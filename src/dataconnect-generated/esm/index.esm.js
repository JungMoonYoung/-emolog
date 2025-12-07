import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'emolog',
  location: 'us-east4'
};

export const createEmotionLogEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEmotionLogEntry', inputVars);
}
createEmotionLogEntryRef.operationName = 'CreateEmotionLogEntry';

export function createEmotionLogEntry(dcOrVars, vars) {
  return executeMutation(createEmotionLogEntryRef(dcOrVars, vars));
}

export const getEmotionLogEntriesForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEmotionLogEntriesForUser', inputVars);
}
getEmotionLogEntriesForUserRef.operationName = 'GetEmotionLogEntriesForUser';

export function getEmotionLogEntriesForUser(dcOrVars, vars) {
  return executeQuery(getEmotionLogEntriesForUserRef(dcOrVars, vars));
}

export const addEmotionToLogEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddEmotionToLogEntry', inputVars);
}
addEmotionToLogEntryRef.operationName = 'AddEmotionToLogEntry';

export function addEmotionToLogEntry(dcOrVars, vars) {
  return executeMutation(addEmotionToLogEntryRef(dcOrVars, vars));
}

export const listAllEventTagsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllEventTags');
}
listAllEventTagsRef.operationName = 'ListAllEventTags';

export function listAllEventTags(dc) {
  return executeQuery(listAllEventTagsRef(dc));
}

