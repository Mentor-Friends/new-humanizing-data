import {
  MakeTheInstanceConcept,
  MakeTheInstanceConceptLocal,
} from "mftsccs-browser";
export const companyName = "Boomconsole";

export async function getCompanyConcept() {
  return await MakeTheInstanceConcept("company", companyName, false, 999, 4);
}

export async function getCompanyConceptL() {
  return await MakeTheInstanceConceptLocal(
    "company",
    companyName,
    false,
    999,
    4
  );
}
