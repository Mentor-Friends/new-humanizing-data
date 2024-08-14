import {
  Concept,
  LConcept,
  MakeTheInstanceConcept,
  MakeTheInstanceConceptLocal,
  SyncData,
} from "mftsccs-browser";
import {
  CreateConnectionBetweenEntity,
  CreateConnectionBetweenEntityLocal,
} from "./entity.service";

// LOCAL
export async function createEntityInstance(
  entityType: string,
  userId: number,
  conepts: any
) {
  const entityConcept: LConcept = await MakeTheInstanceConceptLocal(
    `the_${entityType}`,
    "",
    true,
    userId,
    4,
    999
  );

  for (const [key, value] of Object.entries(conepts)) {
    let ObjKey = key;

    const keyConcept: LConcept = await MakeTheInstanceConceptLocal(
      `${ObjKey}`,
      `${value}`,
      false,
      userId,
      4,
      999
    );
    await CreateConnectionBetweenEntityLocal(entityConcept, keyConcept, ObjKey);
  }

  // await LocalSyncData.SyncDataOnline();
  return entityConcept;
}

// NOT LOCAL ONLINE
export async function _createEntityInstance(
  entityType: string,
  userId: number,
  conepts: any
) {
  const entityConcept = await MakeTheInstanceConcept(
    `the_${entityType}`,
    "",
    true,
    userId,
    4,
    999
  );

  for (const [key, value] of Object.entries(conepts)) {
    let ObjKey = key;

    const keyConcept: Concept = await MakeTheInstanceConcept(
      `${ObjKey}`,
      `${value}`,
      false,
      userId,
      4,
      999
    );
    await CreateConnectionBetweenEntity(entityConcept, keyConcept, ObjKey);
  }

  await SyncData.SyncDataOnline();
  return entityConcept;
}
