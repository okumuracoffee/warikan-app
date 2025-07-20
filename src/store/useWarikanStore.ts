// src/store/useWarikanStore.ts

import { create } from "zustand"; // standを作成するのに必要な関数 create
import type { Expense } from "../types";

// 状態
// 管理したい状態４つ
// 1.フォーム入力
// 2.２つめのフォーム
// 3 members 追加されたメンバー
// 4追加された支払いの記録が配列で管理される
type State = {
  inputMember: string;
  inputExpense: Expense;
  members: string[];
  expenses: Expense[];
};

// 更新用の処理
type Action = {
  updateInputMember: (inputMember: string) => void; b// reactでいうonChange
  updateInputExpense: (inputExpense: Expense) => void;
  addMember: () => void;
  addExpense: () => void;
  removeExpense: (description: string) => void;
};

// 管理したい状態、更新用の関数をいれていく
const useWarikanStore = create((set) => ({
    // initial state
    inputMember: "",
    inputExpense: { paidBy: "", description: "", amount: 0 },
    members: [],
    expenses: [],
    // actions
    updateInputMember: (inputMember: string) =>
        set(() => ({ inputMember: inputMember })),
    updateInputExpense: (inputExpense: Expense) =>
        set(() => ({ inputExpense: inputExpense })),

    addMember: () =>
        set((state) => {
        // 空白のトリミング(jsの関数 whitespaceの入力対策)
        const trimmedMember = state.inputMember.trim();
        // 重複の確認
        const isDuplicateMember = state.members.includes(trimmedMember);
        // バリデーション
        if (trimmedMember && !isDuplicateMember) {
            return {
            members: [...state.members, trimmedMember],
            inputMember: "",
            };
        }
        return state;
        }),

    addExpense: () =>
        set((state) => {
            // 支払い内容のトリミング
            const { paidBy, description, amount } = state.inputExpense;
            const trimmedDescription = description.trim();
            // 重複の確認
            const isDuplicateDescription = state.expenses.some(
            (expense) => expense.description === trimmedDescription
            );
            // バリデーション
            if (paidBy && trimmedDescription && amount && !isDuplicateDescription) {
            return {
                expenses: [
                ...state.expenses,
                { ...state.inputExpense, description: trimmedDescription },
                ],
                inputExpense: { paidBy: "", description: "", amount: 0 },
            };
            }
            return state;
        }),

    removeExpense: (description: string) =>
        set((state) => {
            return {
            expenses: state.expenses.filter(
                (expense) => expense.description !== description
            ),
            };
        }),
}));

// <State & Action>

export default useWarikanStore;