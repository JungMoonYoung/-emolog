import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddEmotionToLogEntryData {
  emotionLogEmotion_insert: EmotionLogEmotion_Key;
}

export interface AddEmotionToLogEntryVariables {
  emotionLogEntryId: UUIDString;
  emotionId: UUIDString;
  intensity: number;
}

export interface CreateEmotionLogEntryData {
  emotionLogEntry_insert: EmotionLogEntry_Key;
}

export interface CreateEmotionLogEntryVariables {
  userId: UUIDString;
  entryDate: DateString;
  notes?: string | null;
}

export interface EmotionLogEmotion_Key {
  emotionLogEntryId: UUIDString;
  emotionId: UUIDString;
  __typename?: 'EmotionLogEmotion_Key';
}

export interface EmotionLogEntry_Key {
  id: UUIDString;
  __typename?: 'EmotionLogEntry_Key';
}

export interface EmotionLogEventTag_Key {
  emotionLogEntryId: UUIDString;
  eventTagId: UUIDString;
  __typename?: 'EmotionLogEventTag_Key';
}

export interface Emotion_Key {
  id: UUIDString;
  __typename?: 'Emotion_Key';
}

export interface EventTag_Key {
  id: UUIDString;
  __typename?: 'EventTag_Key';
}

export interface GetEmotionLogEntriesForUserData {
  emotionLogEntries: ({
    id: UUIDString;
    entryDate: DateString;
    notes?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & EmotionLogEntry_Key)[];
}

export interface GetEmotionLogEntriesForUserVariables {
  userId: UUIDString;
}

export interface ListAllEventTagsData {
  eventTags: ({
    id: UUIDString;
    name: string;
    description?: string | null;
  } & EventTag_Key)[];
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateEmotionLogEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmotionLogEntryVariables): MutationRef<CreateEmotionLogEntryData, CreateEmotionLogEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEmotionLogEntryVariables): MutationRef<CreateEmotionLogEntryData, CreateEmotionLogEntryVariables>;
  operationName: string;
}
export const createEmotionLogEntryRef: CreateEmotionLogEntryRef;

export function createEmotionLogEntry(vars: CreateEmotionLogEntryVariables): MutationPromise<CreateEmotionLogEntryData, CreateEmotionLogEntryVariables>;
export function createEmotionLogEntry(dc: DataConnect, vars: CreateEmotionLogEntryVariables): MutationPromise<CreateEmotionLogEntryData, CreateEmotionLogEntryVariables>;

interface GetEmotionLogEntriesForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEmotionLogEntriesForUserVariables): QueryRef<GetEmotionLogEntriesForUserData, GetEmotionLogEntriesForUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetEmotionLogEntriesForUserVariables): QueryRef<GetEmotionLogEntriesForUserData, GetEmotionLogEntriesForUserVariables>;
  operationName: string;
}
export const getEmotionLogEntriesForUserRef: GetEmotionLogEntriesForUserRef;

export function getEmotionLogEntriesForUser(vars: GetEmotionLogEntriesForUserVariables): QueryPromise<GetEmotionLogEntriesForUserData, GetEmotionLogEntriesForUserVariables>;
export function getEmotionLogEntriesForUser(dc: DataConnect, vars: GetEmotionLogEntriesForUserVariables): QueryPromise<GetEmotionLogEntriesForUserData, GetEmotionLogEntriesForUserVariables>;

interface AddEmotionToLogEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddEmotionToLogEntryVariables): MutationRef<AddEmotionToLogEntryData, AddEmotionToLogEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddEmotionToLogEntryVariables): MutationRef<AddEmotionToLogEntryData, AddEmotionToLogEntryVariables>;
  operationName: string;
}
export const addEmotionToLogEntryRef: AddEmotionToLogEntryRef;

export function addEmotionToLogEntry(vars: AddEmotionToLogEntryVariables): MutationPromise<AddEmotionToLogEntryData, AddEmotionToLogEntryVariables>;
export function addEmotionToLogEntry(dc: DataConnect, vars: AddEmotionToLogEntryVariables): MutationPromise<AddEmotionToLogEntryData, AddEmotionToLogEntryVariables>;

interface ListAllEventTagsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllEventTagsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllEventTagsData, undefined>;
  operationName: string;
}
export const listAllEventTagsRef: ListAllEventTagsRef;

export function listAllEventTags(): QueryPromise<ListAllEventTagsData, undefined>;
export function listAllEventTags(dc: DataConnect): QueryPromise<ListAllEventTagsData, undefined>;

