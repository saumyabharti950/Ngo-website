import { useEffect, useMemo, useState } from "react";
import {
  BarChart3, ChevronDown, Eye, FileText, GalleryHorizontal, HandHeart, LayoutDashboard,
  LogOut, MessageSquare, Pencil, Plus, Settings, ShieldCheck, Trash2, UserRound, UsersRound
} from "lucide-react";
import { api, assetUrl, uploadFile } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const contentModules = {
  "/admin/gallery": { module: "gallery", permission: "gallery", title: "Gallery" },
  "/admin/programmes": { module: "programmes", permission: "programmes", title: "Programmes" },
  "/admin/impact-stories": { module: "impact_stories", permission: "impact_stories", title: "Impact Stories" },
  "/admin/blogs": { module: "blogs", permission: "blogs", title: "Blogs" }
};

const menuGroups = [
  { label: "Dashboard", icon: LayoutDashboard, items: [{ label: "Dashboard", path: "/admin" }] },
  { label: "User Management", icon: UsersRound, items: [
    { label: "Users", path: "/admin/users", permission: "users.view" },
    { label: "Roles", path: "/admin/roles", permission: "roles.view" },
    { label: "Permissions", path: "/admin/permissions", permission: "permissions.view" },
    { label: "Audit Log", path: "/admin/audit-logs", permission: "users.view" }
  ] },
  { label: "CMS", icon: FileText, items: [
    { label: "Gallery", path: "/admin/gallery", permission: "gallery.view", icon: GalleryHorizontal },
    { label: "Programmes", path: "/admin/programmes", permission: "programmes.view" },
    { label: "Impact Stories", path: "/admin/impact-stories", permission: "impact_stories.view" },
    { label: "Blogs", path: "/admin/blogs", permission: "blogs.view" }
  ] },
  { label: "Communication", icon: MessageSquare, items: [{ label: "Contact Messages", path: "/admin/contact-messages", permission: "contact_messages.view" }] },
  { label: "Finance", icon: HandHeart, items: [
    { label: "Donations", path: "/admin/donations", permission: "donations.view" },
    { label: "Transactions", path: "/admin/transactions", permission: "transactions.view" },
    { label: "My Donations", path: "/admin/my-donations" }
  ] },
  { label: "Website Settings", icon: Settings, items: [{ label: "Settings Wizard", path: "/admin/settings", permission: "settings.view" }] },
  { label: "Account", icon: UserRound, items: [{ label: "Profile", path: "/admin/profile" }] }
];

const emptyContent = { title: "", slug: "", shortDescription: "", description: "", featuredImage: "", image1: "", image2: "", image3: "", image4: "", status: "draft", featured: false };

const moduleFields = {
  gallery: {
    text: ["title", "slug", "category", "shortDescription", "eventDate", "location", "altText", "sortOrder"],
    long: ["description"],
    images: ["featuredImage", "image1", "image2", "image3", "image4"],
    payload: []
  },
  programmes: {
    text: ["title", "slug", "shortDescription", "beneficiaryCount", "ageGroup", "geographicalArea", "state", "district", "location", "startDate", "endDate", "budget", "fundingRequired", "programmeManager", "contactEmail", "contactPhone", "websiteUrl"],
    long: ["description", "overview", "objectives", "problemStatement", "targetBeneficiaries", "keyActivities", "outcomes", "impactSummary"],
    images: ["featuredImage", "image1", "image2", "image3", "image4"],
    payload: ["programmeStatus", "fundingSource", "implementingPartner", "governmentPartner", "communityPartner", "sdgGoals", "tags", "videoUrl"]
  },
  impact_stories: {
    text: ["title", "slug", "shortDescription", "storyDate", "beneficiaryName", "beneficiaryAge", "beneficiaryGender", "location", "district", "state", "category"],
    long: ["description", "background", "challenge", "intervention", "supportProvided", "journey", "result", "impact", "beforeText", "afterText", "quote", "testimonial"],
    images: ["featuredImage", "image1", "image2", "image3", "image4"],
    payload: ["beneficiaryCount", "programmeId", "tags", "videoUrl"]
  },
  blogs: {
    text: ["title", "slug", "shortDescription", "category", "metaTitle", "metaKeywords"],
    long: ["description", "content", "metaDescription"],
    images: ["featuredImage", "image1", "image2", "image3", "image4"],
    payload: ["tags"]
  }
};

const settingFields = {
  general: ["website_name", "website_title", "tagline", "website_description", "copyright_text"],
  banners: ["banner_1", "banner_2", "banner_3", "banner_4", "banner_5"],
  header: ["header_logo", "header_phone", "header_email", "header_button_text", "header_button_url", "announcement_text", "announcement_status"],
  footer: ["footer_logo", "footer_content", "privacy_policy_url", "terms_url"],
  seo: ["meta_title", "meta_description", "meta_keywords", "canonical_url", "robots", "author", "og_title", "og_description", "og_image", "twitter_title", "twitter_description", "twitter_image"],
  social: ["facebook", "instagram", "twitter", "youtube", "linkedin", "whatsapp", "telegram"],
  contact: ["primary_email", "alternate_email", "phone", "alternate_phone", "whatsapp", "address", "city", "state", "country", "pincode", "latitude", "longitude", "office_hours"],
  donation: ["minimum_amount", "default_amounts", "donation_note", "receipt_prefix"],
  payment: ["razorpay_key_id", "currency", "gateway_status"]
};

function rowDate(row) {
  return row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-";
}

function AdminDashboard({ path }) {
  const { user, can, logout, loading } = useAuth();
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState({ roles: [], permissions: [] });
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const allowedGroups = useMemo(() => menuGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || can(item.permission))
  })).filter((group) => group.items.length), [can]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      window.history.pushState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }
    const load = async () => {
      setError("");
      setData(null);
      try {
        if (contentModules[path]) setData(await api(`/content/admin/${contentModules[path].module}`));
        else if (path === "/admin/users") setData(await api("/admin/users"));
        else if (path === "/admin/roles") setData(await api("/admin/roles"));
        else if (path === "/admin/permissions") setData(await api("/admin/permissions"));
        else if (path === "/admin/audit-logs") setData(await api("/admin/audit-logs"));
        else if (path === "/admin/contact-messages") setData(await api("/admin/contact-messages"));
        else if (path === "/admin/donations") setData(await api("/admin/donations"));
        else if (path === "/admin/transactions") setData(await api("/admin/transactions"));
        else if (path === "/admin/my-donations") setData(await api("/donations/mine"));
        else if (path === "/admin/settings") setData(await api("/settings"));
        else setData(await api("/admin/dashboard"));
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [path, user, loading, refreshKey]);

  useEffect(() => {
    if (!user) return;
    Promise.allSettled([api("/admin/roles"), api("/admin/permissions")]).then(([roles, permissions]) => {
      setMeta({
        roles: roles.status === "fulfilled" ? roles.value : [],
        permissions: permissions.status === "fulfilled" ? permissions.value : []
      });
    });
  }, [user, refreshKey]);

  if (loading) return <section className="admin-loading">Loading secure workspace...</section>;
  if (!user) return null;

  const title = currentTitle(path);
  const rows = Array.isArray(data) ? data : data?.rows || [];
  const reload = () => setRefreshKey((value) => value + 1);

  return (
    <section className="admin-layout">
      <aside className="admin-sidebar">
        <img src="/images/SIFI%20Foundation%20logo.png" alt="SIFI Foundation" />
        {allowedGroups.map((group) => <MenuGroup key={group.label} group={group} path={path} />)}
        <button onClick={logout}><LogOut size={17} />Logout</button>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar"><div><span>Admin Panel</span><h1>{title}</h1></div><div className="admin-user">{user.profilePhoto ? <img src={user.profilePhoto} alt="" /> : user.name?.[0]}<span>{user.name}</span></div></header>
        {error ? <div className="admin-card forbidden"><h2>403 Access Denied</h2><p>{error}</p></div> : renderPanel({ path, data, rows, can, meta, setModal, reload, user })}
      </div>
      {modal && <CrudModal modal={modal} meta={meta} close={() => setModal(null)} done={() => { setModal(null); reload(); }} />}
    </section>
  );
}

function MenuGroup({ group, path }) {
  const Icon = group.icon;
  const open = group.items.some((item) => item.path === path) || group.label === "Dashboard";
  return (
    <details className="admin-menu-group" open={open}>
      <summary><Icon size={17} />{group.label}<ChevronDown size={15} /></summary>
      <div>{group.items.map((item) => {
        const ItemIcon = item.icon;
        return <a className={path === item.path ? "active" : ""} href={item.path} key={item.path}>{ItemIcon && <ItemIcon size={15} />}{item.label}</a>;
      })}</div>
    </details>
  );
}

function currentTitle(path) {
  for (const group of menuGroups) {
    const item = group.items.find((entry) => entry.path === path);
    if (item) return item.label;
  }
  return contentModules[path]?.title || "Dashboard";
}

function renderPanel({ path, data, rows, can, meta, setModal, reload, user }) {
  if (path === "/admin") return <DashboardCards data={data || {}} />;
  if (path === "/admin/settings") return <SettingsPanel data={data} />;
  if (path === "/admin/profile") return <ProfilePanel user={user} />;
  if (path === "/admin/my-donations") return <MyDonations rows={rows} />;
  if (contentModules[path]) return <ContentCrud config={contentModules[path]} rows={rows} can={can} setModal={setModal} reload={reload} />;
  if (path === "/admin/users") return <UserCrud rows={rows} can={can} meta={meta} setModal={setModal} reload={reload} />;
  if (path === "/admin/roles") return <RoleCrud rows={rows} can={can} meta={meta} setModal={setModal} reload={reload} />;
  if (path === "/admin/permissions") return <PermissionCrud rows={rows} can={can} setModal={setModal} reload={reload} />;
  if (path === "/admin/audit-logs") return <DataTable title="Audit Log" rows={rows} columns={[{ key: "action", label: "Action" }, { key: "module", label: "Module" }, { key: "recordId", label: "Record" }, { key: "createdAt", label: "Date", render: rowDate }]} />;
  if (path === "/admin/contact-messages") return <ContactMessages rows={rows} reload={reload} />;
  if (path === "/admin/donations" || path === "/admin/transactions") return <DonationTable title={currentTitle(path)} rows={rows} />;
  return <DashboardCards data={data || {}} />;
}

function DashboardCards({ data }) {
  return <div className="stats-cards">{Object.entries(data).map(([key, value]) => <article key={key}><BarChart3 /><span>{key.replace(/([A-Z])/g, " $1")}</span><strong>{value}</strong></article>)}</div>;
}

function DataTable({ title, rows, columns, toolbar }) {
  const [search, setSearch] = useState("");
  const filtered = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
  return (
    <section className="admin-card">
      <div className="table-head"><h2>{title}</h2><div className="table-tools">{toolbar}<input placeholder="Search..." value={search} onChange={(event) => setSearch(event.target.value)} /></div></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>{filtered.length ? filtered.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key] || "-"}</td>)}</tr>) : <tr><td colSpan={columns.length}>No records found.</td></tr>}</tbody></table></div>
    </section>
  );
}

function ActionButtons({ row, onView, onEdit, onDelete, canEdit = true, canDelete = true }) {
  return <div className="row-actions"><button onClick={() => onView(row)} title="View"><Eye size={15} /></button>{canEdit && <button onClick={() => onEdit(row)} title="Edit"><Pencil size={15} /></button>}{canDelete && <button className="danger" onClick={() => onDelete(row)} title="Delete"><Trash2 size={15} /></button>}</div>;
}

function ContentCrud({ config, rows, can, setModal, reload }) {
  const del = async (row) => {
    if (!confirm(`Delete ${row.title}?`)) return;
    await api(`/content/admin/${config.module}/${row.id}`, { method: "DELETE" });
    reload();
  };
  return <DataTable title={config.title} rows={rows} toolbar={can(`${config.permission}.create`) && <button className="btn btn-primary table-add" onClick={() => setModal({ type: "content", mode: "create", config, row: emptyContent })}><Plus size={16} />Add {config.title}</button>} columns={[
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    { key: "status", label: "Status" },
    { key: "featured", label: "Featured", render: (row) => row.featured ? "Yes" : "No" },
    { key: "createdAt", label: "Date", render: rowDate },
    { key: "actions", label: "Actions", render: (row) => <ActionButtons row={row} onView={(item) => setModal({ type: "content", mode: "view", config, row: item })} onEdit={(item) => setModal({ type: "content", mode: "edit", config, row: item })} onDelete={del} canEdit={can(`${config.permission}.edit`)} canDelete={can(`${config.permission}.delete`)} /> }
  ]} />;
}

function UserCrud({ rows, can, meta, setModal, reload }) {
  const del = async (row) => {
    if (!confirm(`Delete ${row.name}?`)) return;
    await api(`/admin/users/${row.id}`, { method: "DELETE" });
    reload();
  };
  return <DataTable title="Users" rows={rows} toolbar={can("users.create") && <button className="btn btn-primary table-add" onClick={() => setModal({ type: "user", mode: "create", row: { name: "", email: "", phone: "", password: "", status: "active" } })}><Plus size={16} />Add User</button>} columns={[
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (row) => row.Role?.name || "-" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Date", render: rowDate },
    { key: "actions", label: "Actions", render: (row) => <ActionButtons row={row} onView={(item) => setModal({ type: "user", mode: "view", row: item })} onEdit={(item) => setModal({ type: "user", mode: "edit", row: item })} onDelete={del} canEdit={can("users.edit")} canDelete={can("users.delete")} /> }
  ]} meta={meta} />;
}

function RoleCrud({ rows, can, meta, setModal, reload }) {
  const del = async (row) => {
    if (!confirm(`Delete ${row.name}?`)) return;
    await api(`/admin/roles/${row.id}`, { method: "DELETE" });
    reload();
  };
  return <DataTable title="Roles" rows={rows} toolbar={can("roles.create") && <button className="btn btn-primary table-add" onClick={() => setModal({ type: "role", mode: "create", row: { name: "", slug: "", description: "", status: "active", permissionIds: [] } })}><Plus size={16} />Add Role</button>} columns={[
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
    { key: "status", label: "Status" },
    { key: "permissions", label: "Permissions", render: (row) => row.Permissions?.length || 0 },
    { key: "actions", label: "Actions", render: (row) => <ActionButtons row={row} onView={(item) => setModal({ type: "role", mode: "view", row: item })} onEdit={(item) => setModal({ type: "role", mode: "edit", row: { ...item, permissionIds: item.Permissions?.map((p) => p.id) || [] } })} onDelete={del} canEdit={can("roles.edit")} canDelete={can("roles.delete")} /> }
  ]} meta={meta} />;
}

function PermissionCrud({ rows, can, setModal, reload }) {
  const del = async (row) => {
    if (!confirm(`Delete ${row.slug}?`)) return;
    await api(`/admin/permissions/${row.id}`, { method: "DELETE" });
    reload();
  };
  return <DataTable title="Permissions" rows={rows} toolbar={can("permissions.create") && <button className="btn btn-primary table-add" onClick={() => setModal({ type: "permission", mode: "create", row: { name: "", module: "", action: "", slug: "", description: "", status: "active" } })}><Plus size={16} />Add Permission</button>} columns={[
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
    { key: "module", label: "Module" },
    { key: "action", label: "Action" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", render: (row) => <ActionButtons row={row} onView={(item) => setModal({ type: "permission", mode: "view", row: item })} onEdit={(item) => setModal({ type: "permission", mode: "edit", row: item })} onDelete={del} canEdit={can("permissions.edit")} canDelete={can("permissions.delete")} /> }
  ]} />;
}

function ContactMessages({ rows, reload }) {
  const mark = async (row, status) => {
    await api(`/admin/contact-messages/${row.id}`, { method: "PATCH", body: { status } });
    reload();
  };
  return <DataTable title="Contact Messages" rows={rows} columns={[
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Date", render: rowDate },
    { key: "actions", label: "Actions", render: (row) => <div className="row-actions"><button onClick={() => alert(`${row.name}\n${row.email}\n\n${row.message}`)}><Eye size={15} /></button><button onClick={() => mark(row, row.status === "read" ? "unread" : "read")}>{row.status === "read" ? "Unread" : "Read"}</button><button onClick={() => mark(row, "archived")}>Archive</button></div> }
  ]} />;
}

function DonationTable({ title, rows }) {
  return <DataTable title={title} rows={rows} columns={[
    { key: "donationNumber", label: "Donation No." },
    { key: "donorName", label: "Donor" },
    { key: "email", label: "Email" },
    { key: "amount", label: "Amount", render: (row) => `${row.currency || "INR"} ${row.amount}` },
    { key: "gateway", label: "Gateway" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Date", render: rowDate }
  ]} />;
}

function CrudModal({ modal, meta, close, done }) {
  const readOnly = modal.mode === "view";
  const [form, setForm] = useState(modal.row || {});
  const [message, setMessage] = useState("");
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = async (event) => {
    event.preventDefault();
    if (readOnly) return close();
    try {
      if (modal.type === "content") {
        const method = modal.mode === "edit" ? "PUT" : "POST";
        const url = modal.mode === "edit" ? `/content/admin/${modal.config.module}/${form.id}` : `/content/admin/${modal.config.module}`;
        await api(url, { method, body: form });
      } else if (modal.type === "user") {
        const method = modal.mode === "edit" ? "PUT" : "POST";
        const url = modal.mode === "edit" ? `/admin/users/${form.id}` : "/admin/users";
        await api(url, { method, body: form });
      } else if (modal.type === "role") {
        const method = modal.mode === "edit" ? "PUT" : "POST";
        const url = modal.mode === "edit" ? `/admin/roles/${form.id}` : "/admin/roles";
        await api(url, { method, body: form });
      } else if (modal.type === "permission") {
        const method = modal.mode === "edit" ? "PUT" : "POST";
        const url = modal.mode === "edit" ? `/admin/permissions/${form.id}` : "/admin/permissions";
        await api(url, { method, body: form });
      }
      done();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="crud-overlay">
      <form className="crud-modal" onSubmit={save}>
        <div className="crud-head"><h2>{modal.mode} {modal.config?.title || modal.type}</h2><button type="button" onClick={close}>x</button></div>
        {modal.type === "content" && <ContentForm form={form} update={update} readOnly={readOnly} module={modal.config.module} />}
        {modal.type === "user" && <UserForm form={form} update={update} meta={meta} readOnly={readOnly} />}
        {modal.type === "role" && <RoleForm form={form} update={update} meta={meta} readOnly={readOnly} />}
        {modal.type === "permission" && <PermissionForm form={form} update={update} readOnly={readOnly} />}
        {message && <p className="form-message error">{message}</p>}
        <div className="crud-actions"><button type="button" onClick={close}>Cancel</button><button className="btn btn-primary" type="submit">{readOnly ? "Close" : "Save"}</button></div>
      </form>
    </div>
  );
}

function ContentForm({ form, update, readOnly, module }) {
  const config = moduleFields[module] || moduleFields.gallery;
  const payload = form.payload || {};
  const updatePayload = (key, value) => update("payload", { ...payload, [key]: value });
  return <div className="crud-grid">
    {config.text.map((key) => <label key={key}><span>{labelize(key)}</span><input disabled={readOnly} value={form[key] ?? payload[key] ?? ""} onChange={(event) => (key in form || !config.payload.includes(key)) ? update(key, event.target.value) : updatePayload(key, event.target.value)} /></label>)}
    {config.payload.map((key) => <label key={key}><span>{labelize(key)}</span><input disabled={readOnly} value={payload[key] || ""} onChange={(event) => updatePayload(key, event.target.value)} /></label>)}
    {config.images.map((key) => <ImageUpload key={key} scope={module} label={labelize(key)} value={form[key]} disabled={readOnly} onChange={(value) => update(key, value)} />)}
    <label><span>Status</span><select disabled={readOnly} value={form.status || "draft"} onChange={(event) => update("status", event.target.value)}><option>draft</option><option>published</option><option>unpublished</option></select></label>
    <label className="check-field"><input disabled={readOnly} type="checkbox" checked={Boolean(form.featured)} onChange={(event) => update("featured", event.target.checked)} /> Featured</label>
    {config.long.map((key) => <label className="wide" key={key}><span>{labelize(key)}</span><textarea disabled={readOnly} rows="5" value={form[key] ?? payload[key] ?? ""} onChange={(event) => (key in form || key === "description" || key === "content") ? update(key, event.target.value) : updatePayload(key, event.target.value)} /></label>)}
  </div>;
}

function UserForm({ form, update, meta, readOnly }) {
  return <div className="crud-grid">
    {["name", "email", "phone", "designation", "city", "state", "country", "pincode"].map((key) => <label key={key}><span>{key}</span><input disabled={readOnly} value={form[key] || ""} onChange={(event) => update(key, event.target.value)} /></label>)}
    <label><span>Role</span><select disabled={readOnly} value={form.roleId || form.RoleId || ""} onChange={(event) => update("roleId", event.target.value)}><option value="">Select role</option>{meta.roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>
    <label><span>Status</span><select disabled={readOnly} value={form.status || "active"} onChange={(event) => update("status", event.target.value)}><option>active</option><option>inactive</option><option>blocked</option></select></label>
    <label><span>Password</span><input disabled={readOnly} type="password" value={form.password || ""} onChange={(event) => update("password", event.target.value)} placeholder={form.id ? "Leave blank to keep old password" : ""} /></label>
    <label className="wide"><span>Address</span><textarea disabled={readOnly} value={form.address || ""} onChange={(event) => update("address", event.target.value)} /></label>
  </div>;
}

function RoleForm({ form, update, meta, readOnly }) {
  const ids = form.permissionIds || [];
  const toggle = (id) => update("permissionIds", ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  return <div className="crud-grid">
    {["name", "slug", "description"].map((key) => <label key={key}><span>{key}</span><input disabled={readOnly} value={form[key] || ""} onChange={(event) => update(key, event.target.value)} /></label>)}
    <label><span>Status</span><select disabled={readOnly} value={form.status || "active"} onChange={(event) => update("status", event.target.value)}><option>active</option><option>inactive</option></select></label>
    <div className="permission-picker wide">{meta.permissions.map((permission) => <label key={permission.id}><input disabled={readOnly} type="checkbox" checked={ids.includes(permission.id)} onChange={() => toggle(permission.id)} />{permission.slug}</label>)}</div>
  </div>;
}

function PermissionForm({ form, update, readOnly }) {
  return <div className="crud-grid">
    {["name", "slug", "module", "action", "description"].map((key) => <label key={key}><span>{key}</span><input disabled={readOnly} value={form[key] || ""} onChange={(event) => update(key, event.target.value)} /></label>)}
    <label><span>Status</span><select disabled={readOnly} value={form.status || "active"} onChange={(event) => update("status", event.target.value)}><option>active</option><option>inactive</option></select></label>
  </div>;
}

function SettingsPanel({ data }) {
  const steps = ["general", "header", "footer", "seo", "social", "contact", "donation", "payment"];
  const [active, setActive] = useState("general");
  const [draft, setDraft] = useState(data || {});
  const [message, setMessage] = useState("");
  const save = async () => {
    await api("/admin/settings", { method: "PUT", body: draft });
    setMessage("Settings saved.");
  };
  const values = draft[active] || {};
  return <section className="admin-card settings-card"><div className="settings-steps">{steps.map((step) => <button className={active === step ? "active" : ""} onClick={() => setActive(step)} key={step}>{step}</button>)}</div><div className="settings-fields">{["website_name", "website_title", "tagline", "header_phone", "header_email", "footer_content", "meta_title", "facebook", "primary_email", "phone", "address", "razorpay_key_id"].map((key) => <label key={key}><span>{key.replaceAll("_", " ")}</span><input value={values[key] || ""} onChange={(event) => setDraft((current) => ({ ...current, [active]: { ...(current[active] || {}), [key]: event.target.value } }))} /></label>)}</div><button className="btn btn-primary" onClick={save}>Save Settings</button>{message && <p className="form-message">{message}</p>}</section>;
}

function MyDonations({ rows }) {
  const downloadInvoice = async (donation) => {
    const response = await api(`/donations/download/${donation.donationNumber}`, { raw: true });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `donation-${donation.donationNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return <DataTable title="My Donations" rows={rows} columns={[{ key: "donationNumber", label: "Donation Number" }, { key: "amount", label: "Amount", render: (row) => `${row.currency || "INR"} ${row.amount}` }, { key: "status", label: "Status" }, { key: "paymentMethod", label: "Payment Method" }, { key: "createdAt", label: "Date", render: rowDate }, { key: "invoice", label: "Invoice", render: (row) => row.donationNumber ? <button className="table-action" onClick={() => downloadInvoice(row)}>Download</button> : "-" }]} />;
}

function ProfilePanel({ user }) {
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const changePassword = async (event) => {
    event.preventDefault();
    try {
      await api("/auth/change-password", { method: "POST", body: passwords });
      setMessage("Password updated.");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (error) {
      setMessage(error.message);
    }
  };
  return <section className="admin-card profile-card"><div className="profile-hero"><div className="admin-user profile-avatar">{user.profilePhoto ? <img src={user.profilePhoto} alt="" /> : user.name?.[0]}</div><div><h2>{user.name}</h2><p>{user.email}</p><p>{user.Role?.name || "Authenticated user"}</p></div></div><form className="settings-fields" onSubmit={changePassword}><label><span>current password</span><input type="password" value={passwords.currentPassword} onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))} required /></label><label><span>new password</span><input type="password" minLength={8} value={passwords.newPassword} onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))} required /></label><button className="btn btn-primary" type="submit">Change Password</button></form>{message && <p className="form-message">{message}</p>}</section>;
}

export default AdminDashboard;
