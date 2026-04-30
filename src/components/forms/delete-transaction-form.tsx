"use client";

import { deleteTransactionAction } from "@/app/actions";
import { DeleteWithConfirm } from "@/components/forms/delete-with-confirm";

export function DeleteTransactionForm({ id }: { id: string }) {
  return <DeleteWithConfirm id={id} action={deleteTransactionAction} />;
}
