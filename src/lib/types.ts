export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          transaction_type: "income" | "expense";
          color: string;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          transaction_type: "income" | "expense";
          color?: string;
          icon?: string | null;
        };
        Update: {
          name?: string;
          transaction_type?: "income" | "expense";
          color?: string;
          icon?: string | null;
        };
      };
      subcategories: {
        Row: {
          id: string;
          category_id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          user_id: string;
          name: string;
        };
        Update: {
          name?: string;
          category_id?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          occurred_on: string;
          transaction_type: "income" | "expense";
          category_id: string | null;
          subcategory_id: string | null;
          payee: string;
          notes: string | null;
          recurring_transaction_id: string | null;
          recurring_instance_key: string | null;
          is_recurring_generated: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          occurred_on: string;
          transaction_type: "income" | "expense";
          category_id?: string | null;
          subcategory_id?: string | null;
          payee: string;
          notes?: string | null;
          recurring_transaction_id?: string | null;
          recurring_instance_key?: string | null;
          is_recurring_generated?: boolean;
        };
        Update: {
          amount?: number;
          occurred_on?: string;
          transaction_type?: "income" | "expense";
          category_id?: string | null;
          subcategory_id?: string | null;
          payee?: string;
          notes?: string | null;
          recurring_transaction_id?: string | null;
          recurring_instance_key?: string | null;
          is_recurring_generated?: boolean;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          month: string;
          planned_amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          month: string;
          planned_amount: number;
          notes?: string | null;
        };
        Update: {
          category_id?: string;
          month?: string;
          planned_amount?: number;
          notes?: string | null;
        };
      };
      recurring_transactions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          transaction_type: "income" | "expense";
          category_id: string | null;
          subcategory_id: string | null;
          payee: string;
          notes: string | null;
          frequency: "monthly";
          day_of_month: number;
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          transaction_type: "income" | "expense";
          category_id?: string | null;
          subcategory_id?: string | null;
          payee: string;
          notes?: string | null;
          frequency?: "monthly";
          day_of_month: number;
          start_date: string;
          end_date?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          amount?: number;
          transaction_type?: "income" | "expense";
          category_id?: string | null;
          subcategory_id?: string | null;
          payee?: string;
          notes?: string | null;
          day_of_month?: number;
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
        };
      };
      audit_log: {
        Row: {
          id: number;
          user_id: string;
          entity_type: string;
          entity_id: string;
          action: string;
          payload: Json | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          entity_type: string;
          entity_id: string;
          action: string;
          payload?: Json | null;
        };
        Update: never;
      };
    };
  };
};

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Subcategory = Database["public"]["Tables"]["subcategories"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type Budget = Database["public"]["Tables"]["budgets"]["Row"];
export type RecurringTransaction =
  Database["public"]["Tables"]["recurring_transactions"]["Row"];
export type AuditLogEntry = Database["public"]["Tables"]["audit_log"]["Row"];

export type TransactionWithRelations = Transaction & {
  category: Pick<Category, "id" | "name" | "color"> | null;
  subcategory: Pick<Subcategory, "id" | "name"> | null;
};

export type BudgetWithCategory = Budget & {
  category: Pick<Category, "id" | "name" | "color"> | null;
};

export type RecurringWithRelations = RecurringTransaction & {
  category: Pick<Category, "id" | "name" | "color"> | null;
  subcategory: Pick<Subcategory, "id" | "name"> | null;
};

export type AuditWithPayload = AuditLogEntry & {
  payload: Json | null;
};
