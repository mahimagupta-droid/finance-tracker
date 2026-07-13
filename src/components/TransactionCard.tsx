import { Card } from "@heroui/react";
import { useState } from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";

type TransactionCardTypes = {
  _id: string,
  amount: number,
  category: string,
  type: string,
  date: Date,
  description: string,
  paymentMethod: string,
  isEssential: boolean,
  isRecurring: boolean,
  onDelete: (_id: string) => void,
  onUpdate: () => void
}

export function TransactionCard({ _id, amount, category, type, date, description, paymentMethod, isEssential, isRecurring, onDelete, onUpdate }: TransactionCardTypes) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatingTransaction, setUpdatingTransaction] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState({
    amount,
    type,
    category,
    description,
    date: new Date(date),
    paymentMethod,
    isEssential,
    isRecurring,
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdatingTransaction(true);
      const response = await fetch(`/api/transactions/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedTransaction),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(data.message || "Transaction updated successfully");
          setIsEditing(false);
          onUpdate();
        } else {
          throw new Error(data.message || "Failed to update transaction");
        }
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to update transaction");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdatingTransaction(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="w-full max-w-[320px] bg-card text-card-textColor p-4 rounded border border-border transition-colors duration-300">
        <form onSubmit={handleUpdate} className="flex flex-col gap-3 font-lexend mt-2">
          <input
            type="number"
            value={editedTransaction.amount || ""}
            onChange={(e) => setEditedTransaction({ ...editedTransaction, amount: Number(e.target.value) })}
            className="w-full bg-input text-textColor border border-border rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
            placeholder="Amount" />
          <select
            value={editedTransaction.type}
            onChange={(e) => setEditedTransaction({ ...editedTransaction, type: e.target.value, category: "" })}
            className="w-full bg-input text-textColor border border-border rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-ring focus:outline-none">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select
            value={editedTransaction.category}
            onChange={(e) => setEditedTransaction({ ...editedTransaction, category: e.target.value })}
            className="w-full bg-input text-textColor border border-border rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-ring focus:outline-none">
            <option value="" disabled>Select Category</option>
            {editedTransaction.type === "expense" && (EXPENSE_CATEGORIES as string[]).map((cat: string) => (<option key={cat} value={cat}>{cat.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>))}
            {editedTransaction.type === "income" && (INCOME_CATEGORIES as string[]).map((cat: string) => (<option key={cat} value={cat}>{cat.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>))}
          </select>
          <input
            type="date"
            value={editedTransaction.date ? new Date(editedTransaction.date).toISOString().split('T')[0] : ''}
            onChange={(e) => setEditedTransaction({ ...editedTransaction, date: new Date(e.target.value) })}
            className="w-full bg-input text-textColor border border-border rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-ring focus:outline-none" />
          <select value={editedTransaction.paymentMethod} onChange={(e) => setEditedTransaction({ ...editedTransaction, paymentMethod: e.target.value })} className="w-full bg-input text-textColor border border-border rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-ring focus:outline-none">
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="other">Other</option>
          </select>
          <textarea
            value={editedTransaction.description}
            onChange={(e) => setEditedTransaction({ ...editedTransaction, description: e.target.value })}
            className="w-full bg-input text-textColor border border-border rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
            placeholder="Description"
            rows={2} />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={updatingTransaction}
              className="flex-1 bg-primary text-primary-textColor py-1 rounded-lg text-sm disabled:opacity-50 cursor-pointer hover:bg-primary/85 transition-all duration-200">{updatingTransaction ? "Saving..." : "Save"}</button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditedTransaction({ amount, type, category, description, date: new Date(date), paymentMethod, isEssential, isRecurring });
              }}
              className="flex-1 bg-muted text-textColor border border-border py-1 rounded-lg text-sm cursor-pointer hover:bg-muted/70 transition-all duration-200">Cancel</button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-[320px] bg-card text-card-textColor p-4 rounded border border-border transition-colors duration-300">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            ₹{amount} • {category}
          </Card.Title>

          <Card.Description>
            {type.toUpperCase()} • {new Date(date).toLocaleDateString()}
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-sm">{description}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {paymentMethod}
          </p>
          <div className="flex gap-2 mt-4">
            <button className="text-primary hover:text-primary/75 border border-border px-2 py-1 rounded cursor-pointer transition-colors duration-200" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="text-danger hover:text-danger/75 border border-border px-2 py-1 rounded cursor-pointer transition-colors duration-200"
              onClick={() => onDelete(_id)}
            >
              Delete
            </button>
          </div>
        </Card.Content>
      </Card>
    </>
  );
}