import {
  DeleteConnectionById,
  GetRelation,
  LConcept,
  MakeTheInstanceConceptLocal,
} from "mftsccs-browser";
import { getConnectionList } from "./GetConnection";
import { CreateConnectionBetweenEntityLocal } from "./entity.service";

/**
 * 
 * @param userId number
 * @param token string
 * @param fromConcept LConcept
 * @param linker string
 * @param key string
 * @param value string
 */
export const updateTypeConceptLocal = async (
  userId: number,
  token: string,
  fromConcept: LConcept,
  linker: string,
  key: string,
  value: string
) => {
  const relatedLinks = await GetRelation(
    fromConcept.id,
    `${fromConcept?.type?.characterValue}_${linker}`
  );
  const toConcept = relatedLinks?.[0]?.id;

  // remove previous link
  const item = {
    parent: fromConcept.id,
    fullLinker: `${fromConcept?.type?.characterValue}_${linker}`,
    id: toConcept,
  };
  const responseConnection: any = await getConnectionList(item, token);
  const responseId = responseConnection?.[0]?.id;
  await DeleteConnectionById(responseId);

  // create new link
  const keyConcept: LConcept = await MakeTheInstanceConceptLocal(
    key,
    value,
    false,
    userId,
    4,
    999
  );
  await CreateConnectionBetweenEntityLocal(fromConcept, keyConcept, linker);
};
