const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'emolog',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createEmotionLogEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEmotionLogEntry', inputVars);
}
createEmotionLogEntryRef.operationName = 'CreateEmotionLogEntry';
exports.createEmotionLogEntryRef = createEmotionLogEntryRef;

exports.createEmotionLogEntry = function createEmotionLogEntry(dcOrVars, vars) {
  return executeMutation(createEmotionLogEntryRef(dcOrVars, vars));
};

const getEmotionLogEntriesForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEmotionLogEntriesForUser', inputVars);
}
getEmotionLogEntriesForUserRef.operationName = 'GetEmotionLogEntriesForUser';
exports.getEmotionLogEntriesForUserRef = getEmotionLogEntriesForUserRef;

exports.getEmotionLogEntriesForUser = function getEmotionLogEntriesForUser(dcOrVars, vars) {
  return executeQuery(getEmotionLogEntriesForUserRef(dcOrVars, vars));
};

const addEmotionToLogEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddEmotionToLogEntry', inputVars);
}
addEmotionToLogEntryRef.operationName = 'AddEmotionToLogEntry';
exports.addEmotionToLogEntryRef = addEmotionToLogEntryRef;

exports.addEmotionToLogEntry = function addEmotionToLogEntry(dcOrVars, vars) {
  return executeMutation(addEmotionToLogEntryRef(dcOrVars, vars));
};

const listAllEventTagsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllEventTags');
}
listAllEventTagsRef.operationName = 'ListAllEventTags';
exports.listAllEventTagsRef = listAllEventTagsRef;

exports.listAllEventTags = function listAllEventTags(dc) {
  return executeQuery(listAllEventTagsRef(dc));
};
