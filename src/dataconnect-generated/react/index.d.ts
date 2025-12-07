import { CreateEmotionLogEntryData, CreateEmotionLogEntryVariables, GetEmotionLogEntriesForUserData, GetEmotionLogEntriesForUserVariables, AddEmotionToLogEntryData, AddEmotionToLogEntryVariables, ListAllEventTagsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateEmotionLogEntry(options?: useDataConnectMutationOptions<CreateEmotionLogEntryData, FirebaseError, CreateEmotionLogEntryVariables>): UseDataConnectMutationResult<CreateEmotionLogEntryData, CreateEmotionLogEntryVariables>;
export function useCreateEmotionLogEntry(dc: DataConnect, options?: useDataConnectMutationOptions<CreateEmotionLogEntryData, FirebaseError, CreateEmotionLogEntryVariables>): UseDataConnectMutationResult<CreateEmotionLogEntryData, CreateEmotionLogEntryVariables>;

export function useGetEmotionLogEntriesForUser(vars: GetEmotionLogEntriesForUserVariables, options?: useDataConnectQueryOptions<GetEmotionLogEntriesForUserData>): UseDataConnectQueryResult<GetEmotionLogEntriesForUserData, GetEmotionLogEntriesForUserVariables>;
export function useGetEmotionLogEntriesForUser(dc: DataConnect, vars: GetEmotionLogEntriesForUserVariables, options?: useDataConnectQueryOptions<GetEmotionLogEntriesForUserData>): UseDataConnectQueryResult<GetEmotionLogEntriesForUserData, GetEmotionLogEntriesForUserVariables>;

export function useAddEmotionToLogEntry(options?: useDataConnectMutationOptions<AddEmotionToLogEntryData, FirebaseError, AddEmotionToLogEntryVariables>): UseDataConnectMutationResult<AddEmotionToLogEntryData, AddEmotionToLogEntryVariables>;
export function useAddEmotionToLogEntry(dc: DataConnect, options?: useDataConnectMutationOptions<AddEmotionToLogEntryData, FirebaseError, AddEmotionToLogEntryVariables>): UseDataConnectMutationResult<AddEmotionToLogEntryData, AddEmotionToLogEntryVariables>;

export function useListAllEventTags(options?: useDataConnectQueryOptions<ListAllEventTagsData>): UseDataConnectQueryResult<ListAllEventTagsData, undefined>;
export function useListAllEventTags(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllEventTagsData>): UseDataConnectQueryResult<ListAllEventTagsData, undefined>;
