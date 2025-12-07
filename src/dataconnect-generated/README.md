# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetEmotionLogEntriesForUser*](#getemotionlogentriesforuser)
  - [*ListAllEventTags*](#listalleventtags)
- [**Mutations**](#mutations)
  - [*CreateEmotionLogEntry*](#createemotionlogentry)
  - [*AddEmotionToLogEntry*](#addemotiontologentry)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetEmotionLogEntriesForUser
You can execute the `GetEmotionLogEntriesForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getEmotionLogEntriesForUser(vars: GetEmotionLogEntriesForUserVariables): QueryPromise<GetEmotionLogEntriesForUserData, GetEmotionLogEntriesForUserVariables>;

interface GetEmotionLogEntriesForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEmotionLogEntriesForUserVariables): QueryRef<GetEmotionLogEntriesForUserData, GetEmotionLogEntriesForUserVariables>;
}
export const getEmotionLogEntriesForUserRef: GetEmotionLogEntriesForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEmotionLogEntriesForUser(dc: DataConnect, vars: GetEmotionLogEntriesForUserVariables): QueryPromise<GetEmotionLogEntriesForUserData, GetEmotionLogEntriesForUserVariables>;

interface GetEmotionLogEntriesForUserRef {
  ...
  (dc: DataConnect, vars: GetEmotionLogEntriesForUserVariables): QueryRef<GetEmotionLogEntriesForUserData, GetEmotionLogEntriesForUserVariables>;
}
export const getEmotionLogEntriesForUserRef: GetEmotionLogEntriesForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEmotionLogEntriesForUserRef:
```typescript
const name = getEmotionLogEntriesForUserRef.operationName;
console.log(name);
```

### Variables
The `GetEmotionLogEntriesForUser` query requires an argument of type `GetEmotionLogEntriesForUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEmotionLogEntriesForUserVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `GetEmotionLogEntriesForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEmotionLogEntriesForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetEmotionLogEntriesForUserData {
  emotionLogEntries: ({
    id: UUIDString;
    entryDate: DateString;
    notes?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & EmotionLogEntry_Key)[];
}
```
### Using `GetEmotionLogEntriesForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEmotionLogEntriesForUser, GetEmotionLogEntriesForUserVariables } from '@dataconnect/generated';

// The `GetEmotionLogEntriesForUser` query requires an argument of type `GetEmotionLogEntriesForUserVariables`:
const getEmotionLogEntriesForUserVars: GetEmotionLogEntriesForUserVariables = {
  userId: ..., 
};

// Call the `getEmotionLogEntriesForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEmotionLogEntriesForUser(getEmotionLogEntriesForUserVars);
// Variables can be defined inline as well.
const { data } = await getEmotionLogEntriesForUser({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEmotionLogEntriesForUser(dataConnect, getEmotionLogEntriesForUserVars);

console.log(data.emotionLogEntries);

// Or, you can use the `Promise` API.
getEmotionLogEntriesForUser(getEmotionLogEntriesForUserVars).then((response) => {
  const data = response.data;
  console.log(data.emotionLogEntries);
});
```

### Using `GetEmotionLogEntriesForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEmotionLogEntriesForUserRef, GetEmotionLogEntriesForUserVariables } from '@dataconnect/generated';

// The `GetEmotionLogEntriesForUser` query requires an argument of type `GetEmotionLogEntriesForUserVariables`:
const getEmotionLogEntriesForUserVars: GetEmotionLogEntriesForUserVariables = {
  userId: ..., 
};

// Call the `getEmotionLogEntriesForUserRef()` function to get a reference to the query.
const ref = getEmotionLogEntriesForUserRef(getEmotionLogEntriesForUserVars);
// Variables can be defined inline as well.
const ref = getEmotionLogEntriesForUserRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEmotionLogEntriesForUserRef(dataConnect, getEmotionLogEntriesForUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.emotionLogEntries);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.emotionLogEntries);
});
```

## ListAllEventTags
You can execute the `ListAllEventTags` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllEventTags(): QueryPromise<ListAllEventTagsData, undefined>;

interface ListAllEventTagsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllEventTagsData, undefined>;
}
export const listAllEventTagsRef: ListAllEventTagsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllEventTags(dc: DataConnect): QueryPromise<ListAllEventTagsData, undefined>;

interface ListAllEventTagsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllEventTagsData, undefined>;
}
export const listAllEventTagsRef: ListAllEventTagsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllEventTagsRef:
```typescript
const name = listAllEventTagsRef.operationName;
console.log(name);
```

### Variables
The `ListAllEventTags` query has no variables.
### Return Type
Recall that executing the `ListAllEventTags` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllEventTagsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllEventTagsData {
  eventTags: ({
    id: UUIDString;
    name: string;
    description?: string | null;
  } & EventTag_Key)[];
}
```
### Using `ListAllEventTags`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllEventTags } from '@dataconnect/generated';


// Call the `listAllEventTags()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllEventTags();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllEventTags(dataConnect);

console.log(data.eventTags);

// Or, you can use the `Promise` API.
listAllEventTags().then((response) => {
  const data = response.data;
  console.log(data.eventTags);
});
```

### Using `ListAllEventTags`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllEventTagsRef } from '@dataconnect/generated';


// Call the `listAllEventTagsRef()` function to get a reference to the query.
const ref = listAllEventTagsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllEventTagsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.eventTags);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.eventTags);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateEmotionLogEntry
You can execute the `CreateEmotionLogEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createEmotionLogEntry(vars: CreateEmotionLogEntryVariables): MutationPromise<CreateEmotionLogEntryData, CreateEmotionLogEntryVariables>;

interface CreateEmotionLogEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmotionLogEntryVariables): MutationRef<CreateEmotionLogEntryData, CreateEmotionLogEntryVariables>;
}
export const createEmotionLogEntryRef: CreateEmotionLogEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createEmotionLogEntry(dc: DataConnect, vars: CreateEmotionLogEntryVariables): MutationPromise<CreateEmotionLogEntryData, CreateEmotionLogEntryVariables>;

interface CreateEmotionLogEntryRef {
  ...
  (dc: DataConnect, vars: CreateEmotionLogEntryVariables): MutationRef<CreateEmotionLogEntryData, CreateEmotionLogEntryVariables>;
}
export const createEmotionLogEntryRef: CreateEmotionLogEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createEmotionLogEntryRef:
```typescript
const name = createEmotionLogEntryRef.operationName;
console.log(name);
```

### Variables
The `CreateEmotionLogEntry` mutation requires an argument of type `CreateEmotionLogEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateEmotionLogEntryVariables {
  userId: UUIDString;
  entryDate: DateString;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateEmotionLogEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEmotionLogEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateEmotionLogEntryData {
  emotionLogEntry_insert: EmotionLogEntry_Key;
}
```
### Using `CreateEmotionLogEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createEmotionLogEntry, CreateEmotionLogEntryVariables } from '@dataconnect/generated';

// The `CreateEmotionLogEntry` mutation requires an argument of type `CreateEmotionLogEntryVariables`:
const createEmotionLogEntryVars: CreateEmotionLogEntryVariables = {
  userId: ..., 
  entryDate: ..., 
  notes: ..., // optional
};

// Call the `createEmotionLogEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEmotionLogEntry(createEmotionLogEntryVars);
// Variables can be defined inline as well.
const { data } = await createEmotionLogEntry({ userId: ..., entryDate: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEmotionLogEntry(dataConnect, createEmotionLogEntryVars);

console.log(data.emotionLogEntry_insert);

// Or, you can use the `Promise` API.
createEmotionLogEntry(createEmotionLogEntryVars).then((response) => {
  const data = response.data;
  console.log(data.emotionLogEntry_insert);
});
```

### Using `CreateEmotionLogEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEmotionLogEntryRef, CreateEmotionLogEntryVariables } from '@dataconnect/generated';

// The `CreateEmotionLogEntry` mutation requires an argument of type `CreateEmotionLogEntryVariables`:
const createEmotionLogEntryVars: CreateEmotionLogEntryVariables = {
  userId: ..., 
  entryDate: ..., 
  notes: ..., // optional
};

// Call the `createEmotionLogEntryRef()` function to get a reference to the mutation.
const ref = createEmotionLogEntryRef(createEmotionLogEntryVars);
// Variables can be defined inline as well.
const ref = createEmotionLogEntryRef({ userId: ..., entryDate: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEmotionLogEntryRef(dataConnect, createEmotionLogEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.emotionLogEntry_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.emotionLogEntry_insert);
});
```

## AddEmotionToLogEntry
You can execute the `AddEmotionToLogEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addEmotionToLogEntry(vars: AddEmotionToLogEntryVariables): MutationPromise<AddEmotionToLogEntryData, AddEmotionToLogEntryVariables>;

interface AddEmotionToLogEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddEmotionToLogEntryVariables): MutationRef<AddEmotionToLogEntryData, AddEmotionToLogEntryVariables>;
}
export const addEmotionToLogEntryRef: AddEmotionToLogEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addEmotionToLogEntry(dc: DataConnect, vars: AddEmotionToLogEntryVariables): MutationPromise<AddEmotionToLogEntryData, AddEmotionToLogEntryVariables>;

interface AddEmotionToLogEntryRef {
  ...
  (dc: DataConnect, vars: AddEmotionToLogEntryVariables): MutationRef<AddEmotionToLogEntryData, AddEmotionToLogEntryVariables>;
}
export const addEmotionToLogEntryRef: AddEmotionToLogEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addEmotionToLogEntryRef:
```typescript
const name = addEmotionToLogEntryRef.operationName;
console.log(name);
```

### Variables
The `AddEmotionToLogEntry` mutation requires an argument of type `AddEmotionToLogEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddEmotionToLogEntryVariables {
  emotionLogEntryId: UUIDString;
  emotionId: UUIDString;
  intensity: number;
}
```
### Return Type
Recall that executing the `AddEmotionToLogEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddEmotionToLogEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddEmotionToLogEntryData {
  emotionLogEmotion_insert: EmotionLogEmotion_Key;
}
```
### Using `AddEmotionToLogEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addEmotionToLogEntry, AddEmotionToLogEntryVariables } from '@dataconnect/generated';

// The `AddEmotionToLogEntry` mutation requires an argument of type `AddEmotionToLogEntryVariables`:
const addEmotionToLogEntryVars: AddEmotionToLogEntryVariables = {
  emotionLogEntryId: ..., 
  emotionId: ..., 
  intensity: ..., 
};

// Call the `addEmotionToLogEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addEmotionToLogEntry(addEmotionToLogEntryVars);
// Variables can be defined inline as well.
const { data } = await addEmotionToLogEntry({ emotionLogEntryId: ..., emotionId: ..., intensity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addEmotionToLogEntry(dataConnect, addEmotionToLogEntryVars);

console.log(data.emotionLogEmotion_insert);

// Or, you can use the `Promise` API.
addEmotionToLogEntry(addEmotionToLogEntryVars).then((response) => {
  const data = response.data;
  console.log(data.emotionLogEmotion_insert);
});
```

### Using `AddEmotionToLogEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addEmotionToLogEntryRef, AddEmotionToLogEntryVariables } from '@dataconnect/generated';

// The `AddEmotionToLogEntry` mutation requires an argument of type `AddEmotionToLogEntryVariables`:
const addEmotionToLogEntryVars: AddEmotionToLogEntryVariables = {
  emotionLogEntryId: ..., 
  emotionId: ..., 
  intensity: ..., 
};

// Call the `addEmotionToLogEntryRef()` function to get a reference to the mutation.
const ref = addEmotionToLogEntryRef(addEmotionToLogEntryVars);
// Variables can be defined inline as well.
const ref = addEmotionToLogEntryRef({ emotionLogEntryId: ..., emotionId: ..., intensity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addEmotionToLogEntryRef(dataConnect, addEmotionToLogEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.emotionLogEmotion_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.emotionLogEmotion_insert);
});
```

