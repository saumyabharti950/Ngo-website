import { useState } from "react";
import { api } from "../lib/api";

const emptyGateway = { name: "", provider: "razorpay", mode: "test", publicKey: "", secretKey: "" };

export default function PaymentGateways({ rows, canEdit, reload }) {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async (action) => {
    setBusy(true); setMessage("");
    try { await action(); reload(); }
    catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  };
  const save = (event) => {
    event.preventDefault();
    run(async () => {
      await api(`/admin/payment-gateways${form.id ? `/${form.id}` : ""}`, { method: form.id ? "PUT" : "POST", body: form });
      setForm(null); setMessage("Gateway saved. Activate it when you are ready to use it for donations.");
    });
  };
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return <section className="admin-card">
    <div className="table-head"><h2>Payment Gateways</h2>{canEdit && <button className="btn btn-primary" disabled={busy} onClick={() => { setForm({ ...emptyGateway }); setMessage(""); }}>Add Gateway</button>}</div>
    <p>Only one gateway is active at a time. New donations use that gateway. All donation amounts are in INR.</p>
    {message && <p className="form-message" role="status">{message}</p>}
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Provider</th><th>Mode</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {rows.map((row) => <tr key={row.id}><td>{row.name}</td><td>{row.provider}</td><td>{row.mode}</td><td>{row.active ? "Active" : "Inactive"}</td><td>{canEdit && <div className="row-actions">
        <button disabled={busy} onClick={() => { setForm({ ...row, secretKey: "" }); setMessage(""); }}>Edit</button>
        <button disabled={busy} onClick={() => run(() => api(`/admin/payment-gateways/${row.id}/${row.active ? "deactivate" : "activate"}`, { method: "POST" }))}>{row.active ? "Deactivate" : "Activate"}</button>
        <button disabled={busy || row.active} onClick={() => { if (confirm(`Delete ${row.name}?`)) run(() => api(`/admin/payment-gateways/${row.id}`, { method: "DELETE" })); }}>Delete</button>
      </div>}</td></tr>)}
      {!rows.length && <tr><td colSpan="5">No payment gateways configured. Add a gateway to enable online donations.</td></tr>}
    </tbody></table></div>
    {form && <div className="crud-overlay"><form className="crud-modal" role="dialog" aria-modal="true" aria-label="Payment gateway" onSubmit={save}>
      <div className="crud-head"><h2>{form.id ? "Edit" : "Add"} Payment Gateway</h2><button type="button" disabled={busy} onClick={() => setForm(null)} aria-label="Close dialog">×</button></div>
      <fieldset className="settings-fieldset" disabled={busy}><div className="crud-grid">
        <label><span>Name</span><input required value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Razorpay Live" /></label>
        <label><span>Provider</span><select value={form.provider} onChange={(event) => setForm((current) => ({ ...current, provider: event.target.value, publicKey: "", secretKey: "", hasSecret: false }))}><option value="razorpay">Razorpay</option><option value="stripe">Stripe</option><option value="cashfree">Cashfree</option></select></label>
        <label><span>Mode</span><select value={form.mode} onChange={(event) => update("mode", event.target.value)}><option value="test">Test / Sandbox</option><option value="live">Live</option></select></label>
        <label><span>{form.provider === "cashfree" ? "App ID" : form.provider === "stripe" ? "Publishable key" : "Key ID"}</span><input required autoComplete="off" value={form.publicKey} onChange={(event) => update("publicKey", event.target.value)} /></label>
        <label className="wide"><span>Secret key</span><input type="password" autoComplete="new-password" required={!form.hasSecret} value={form.secretKey} onChange={(event) => update("secretKey", event.target.value)} placeholder={form.hasSecret ? "Leave blank to keep the saved secret" : "Enter secret key"} /></label>
      </div><p>Use credentials for the selected mode. Cashfree requires your website domain to be whitelisted in its dashboard.</p>
      {message && <p className="form-message error" role="alert">{message}</p>}
      <div className="crud-actions"><button type="button" onClick={() => setForm(null)}>Cancel</button><button type="submit" className="btn btn-primary">{busy ? "Saving..." : "Save Gateway"}</button></div></fieldset>
    </form></div>}
  </section>;
}
