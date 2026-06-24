import { create } from "zustand";

export type PlanType = "free" | "pro";

export interface SubscriptionInfo {
  plan: PlanType;
  analysesUsed: number;
  analysesLimit: number | "unlimited";
  subscription: {
    id: string;
    plan: string;
    status: string;
    method: string | null;
    startDate: string;
    endDate: string | null;
    amount: number;
  } | null;
}

interface PaymentState {
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  selectedPlan: PlanType;
  setSelectedPlan: (plan: PlanType) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  subscription: SubscriptionInfo | null;
  setSubscription: (sub: SubscriptionInfo | null) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  paymentSuccess: boolean;
  setPaymentSuccess: (success: boolean) => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  isPaymentModalOpen: false,
  setIsPaymentModalOpen: (open) => set({ isPaymentModalOpen: open }),
  selectedPlan: "pro",
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  userEmail: "",
  setUserEmail: (email) => set({ userEmail: email }),
  userName: "",
  setUserName: (name) => set({ userName: name }),
  subscription: null,
  setSubscription: (sub) => set({ subscription: sub }),
  isProcessing: false,
  setIsProcessing: (processing) => set({ isProcessing: processing }),
  paymentSuccess: false,
  setPaymentSuccess: (success) => set({ paymentSuccess: success }),
}));
