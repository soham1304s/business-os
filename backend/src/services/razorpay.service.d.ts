export declare const createRazorpayOrder: (amount: number, receiptId: string) => Promise<import("razorpay/dist/types/orders.js").Orders.RazorpayOrder>;
export declare const verifyRazorpayPayment: (razorpayOrderId: string, razorpayPaymentId: string, signature: string) => boolean;
//# sourceMappingURL=razorpay.service.d.ts.map