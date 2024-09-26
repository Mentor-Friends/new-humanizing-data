import { LocalSyncData, MakeTheInstanceConcept } from "mftsccs-browser";
import { createEntityInstance } from "../../services/createEntityInstance.service";
import { CreateConnectionBetweenEntityLocal } from "../../services/entity.service";
import { getLocalStorageData } from "../../services/helper.service";

export async function submitAccountingForm(e: any) {
    e.preventDefault();
    const formData: any = new FormData(e.target);
    const formValues: any = Object.fromEntries(formData);
    const profileStorageData: any = await getLocalStorageData();
    const userId = profileStorageData?.userId;
    let accountingNameConcept: any;
    // let transactionConcept:any;
    const obj:any={ 
      topic:formValues.account,
      amount:formValues.amount,
      account:formValues.topic
    }
    // return
    accountingNameConcept = await MakeTheInstanceConcept(
      "the_journal_entry",
      '',
      false,
      userId,
      4,
      999
    )
    console.log(accountingNameConcept,"formValues")
     let transactionConcept_cr = await createEntityInstance(
        "transaction",
        userId,
        formValues
      );

      let transactionConcept_dr = await createEntityInstance(
        "transaction",
        userId,
        obj
      ); 

      // console.log(transactionConcept_cr,"test",transactionConcept_dr,"here")
      // accountingNameConcept = await createEntityInstance(
      //   "journal_entry",
      //   userId,
      //   'transaction'
      // );
     await CreateConnectionBetweenEntityLocal(
      accountingNameConcept,
      transactionConcept_cr,
      "transaction"
      );
      await CreateConnectionBetweenEntityLocal(
        accountingNameConcept,
        transactionConcept_dr,
        "transaction"
      );
    //   await Promise.all(
    //     formValues?.map(async (items: any) => {
    //       transactionConcept = await createEntityInstance("transaction", userId, items);
    
    //       await CreateConnectionBetweenEntityLocal(
    //         accountingNameConcept,
    //         transactionConcept,
    //         "s_transaction"
    //       );
    //     })
    //   );
   await LocalSyncData.SyncDataOnline();
}