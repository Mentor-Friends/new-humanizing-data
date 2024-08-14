import {
  Concept,
  Connection,
  CreateTheConnectionLocal,
  LConcept,
  MakeTheTypeConceptApi,
  MakeTheTypeConceptLocal,
  SyncData,
} from "mftsccs-browser";

export async function CreateConnectionBetweenEntity(
  concept1Data: Concept,
  concept2Data: Concept,
  linker: string
) {
  const userId: number = concept1Data.userId;
  // var orderUserId: number = userId;
  const securityId: number = 999;
  const securityUserId: number = userId;
  const accessId: number = 4;
  const accessUserId: number = userId;
  const sessionInformationId = 999;
  const sessionInformationUserId = 999;

  const prefix = concept1Data.type?.characterValue;
  // let linkerAdd = linker + "_s";
  const linkerAdd = linker;
  const forwardLinker = prefix + "_" + linkerAdd;

  const connectionConcept = await MakeTheTypeConceptApi(forwardLinker, userId);
  const newConnection = new Connection(
    0,
    concept1Data.id,
    concept2Data.id,
    concept1Data.userId,
    concept2Data.userId,
    concept1Data.userId,
    connectionConcept.id,
    connectionConcept.userId,
    1000,
    userId,
    securityId,
    securityUserId,
    accessId,
    accessUserId,
    sessionInformationId,
    sessionInformationUserId
  );
  SyncData.AddConnection(newConnection);
}

export async function CreateConnectionBetweenEntityLocal(
  concept1Data: LConcept,
  concept2Data: LConcept,
  linker: string
) {
  const userId: number = concept1Data.userId;
  // var orderUserId: number = userId;
  // const securityId: number = 999;
  // const securityUserId: number = userId;
  // const accessId: number = 4;
  // const accessUserId: number = userId;
  const sessionInformationId = 999;
  const sessionInformationUserId = 999;

  const prefix = concept1Data.type?.characterValue;
  // let linkerAdd = linker + "_s";
  const linkerAdd = linker;
  const forwardLinker = prefix + "_" + linkerAdd;

  const connectionConcept = await MakeTheTypeConceptLocal(forwardLinker, sessionInformationId, sessionInformationUserId, userId);
  // console.warn('connectionConcept', connectionConcept)
  CreateTheConnectionLocal(concept1Data.id, concept2Data.id, connectionConcept.id, 1000);

  // const newConnection = new LConnection(
  //   0,
  //   concept1Data.id,
  //   concept2Data.id,
  //   concept1Data.userId,
  //   concept2Data.userId,
  //   concept1Data.userId,
  //   connectionConcept.id,
  //   connectionConcept.userId,
  //   1000,
  //   userId,
  //   securityId,
  //   securityUserId,
  //   accessId,
  //   accessUserId,
  //   sessionInformationId,
  //   sessionInformationUserId
  // );
  // SyncData.AddConnection(newConnection);
}

