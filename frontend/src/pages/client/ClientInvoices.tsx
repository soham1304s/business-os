import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { DollarSign, FileText, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { API_URL } from '../../config';
import { useLiveUpdate } from '../../hooks/useLiveUpdate';

interface Invoice {
  id: string;
  invoiceNo: string;
  amount: number;
  tax: number;
  total: number;
  status: string;
  dueDate: string;
  createdAt: string;
  deal?: {
    title: string;
  };
}

export function ClientInvoices() {
  const { token } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/client/invoices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setInvoices(data);
      } else {
        setInvoices([]);
        console.error(data.error || 'Failed to fetch invoices');
      }
    } catch (err) {
      console.error(err);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [token]);

  useLiveUpdate(['metrics-updated'], fetchInvoices);

  const handlePay = async (invoiceId: string) => {
    setProcessingId(invoiceId);
    try {
      // 1. Create order on backend
      const orderRes = await fetch(`${API_URL}/api/finance/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create payment order');

      // 2. Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '', // Frontend needs the public key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'BusinessOS',
        description: `Payment for Invoice ${orderData.invoice.invoiceNo}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on backend
            const verifyRes = await fetch(`${API_URL}/api/finance/invoices/verify`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                invoiceId: invoiceId
              })
            });

            if (!verifyRes.ok) throw new Error('Payment verification failed');

            // 4. Update UI
            setInvoices(invoices.map(inv => 
              inv.id === invoiceId ? { ...inv, status: 'PAID' } : inv
            ));
          } catch (err) {
            console.error(err);
            alert('Payment verification failed');
          }
        },
        theme: {
          color: '#4f46e5'
        }
      };

      // 5. Open Razorpay modal
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error(response.error);
        alert('Payment failed');
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Could not initiate payment');
    } finally {
      setProcessingId(null);
    }
  };

  const outstanding = invoices.filter(i => i.status === 'UNPAID').reduce((sum, i) => sum + i.total, 0);

  if (loading) return <div className="p-8 text-slate-500">Loading invoices...</div>;

  return (
    <div className="p-8 h-full overflow-y-auto max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing & Invoices</h1>
          <p className="text-slate-500 mt-1">Manage your payments and billing history.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Amount Due</p>
            <h3 className="text-2xl font-bold text-slate-900">${outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {invoices.length === 0 ? (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>You have no invoices yet.</p>
          </div>
        ) : (
          invoices.map(inv => (
            <div key={inv.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{inv.invoiceNo}</h3>
                  {inv.deal && <p className="text-sm text-slate-500 mt-1">{inv.deal.title}</p>}
                </div>
                {inv.status === 'PAID' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    <CheckCircle className="w-4 h-4" /> Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                    <Clock className="w-4 h-4" /> Pending
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">${inv.amount.toFixed(2)}</span>
                </div>
                {inv.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax</span>
                    <span className="font-medium text-slate-900">${inv.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-3 border-t border-slate-100">
                  <span className="text-slate-900">Total</span>
                  <span className="text-slate-900">${inv.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Due: <span className="font-medium text-slate-700">{new Date(inv.dueDate).toLocaleDateString()}</span>
                </div>
                
                {inv.status === 'UNPAID' && (
                  <Button 
                    onClick={() => handlePay(inv.id)} 
                    variant="primary" 
                    disabled={processingId === inv.id}
                  >
                    {processingId === inv.id ? 'Processing...' : 'Pay Now'}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
