import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Loader2, ShieldCheck } from "lucide-react";
import { createStoreItem, getAdminItems } from "@/lib/api";
import { adminLogin } from "@/lib/api";
import { LogIn, LogOut } from "lucide-react";

const defaultForm = {
  nameEn: "",
  nameAr: "",
  category: "",
  descEn: "",
  descAr: "",
  imageUrl: "",
  isFeatured: true,
  status: "published",
};

export default function AdminApp() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [notice, setNotice] = useState("");

  const itemsQuery = useQuery({
    queryKey: ["admin-items"],
    queryFn: () => getAdminItems(token),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: () => createStoreItem(form, token),
    onSuccess: (id) => {
      setForm(defaultForm);
      setNotice(`Item #${id} created successfully.`);
      queryClient.invalidateQueries({ queryKey: ["admin-items"] });
    },
    onError: (error) => {
      setNotice(error.message);
    },
  });

  const onInput = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setNotice("");
    createMutation.mutate();
  };

  if (!token) {
    return <LoginScreen onSuccess={setToken} />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(var(--secondary))_0%,hsl(var(--background))_48%,hsl(var(--background))_100%)] text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-8 rounded-2xl border border-border bg-white/80 backdrop-blur p-6 shadow-sm">
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-display font-bold">Al Sahab Manager Console</h1>
          </div>
          <button
            onClick={() => { setToken(null); queryClient.clear(); }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
          </div>
          <p className="text-muted-foreground mt-2">Upload and manage store items in the same database used by the storefront.</p>
        </header>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold">Add New Item</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold">Name (EN)</span>
                <input
                  value={form.nameEn}
                  onChange={(e) => onInput("nameEn", e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Name (AR)</span>
                <input
                  value={form.nameAr}
                  onChange={(e) => onInput("nameAr", e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold">Category</span>
              <input
                value={form.category}
                onChange={(e) => onInput("category", e.target.value)}
                required
                placeholder="Furniture, Appliances..."
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Image URL</span>
              <input
                value={form.imageUrl}
                onChange={(e) => onInput("imageUrl", e.target.value)}
                required
                type="url"
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Description (EN)</span>
              <textarea
                value={form.descEn}
                onChange={(e) => onInput("descEn", e.target.value)}
                required
                rows={3}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Description (AR)</span>
              <textarea
                value={form.descAr}
                onChange={(e) => onInput("descAr", e.target.value)}
                required
                rows={3}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
              />
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="inline-flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => onInput("isFeatured", e.target.checked)}
                />
                Featured item
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Status</span>
                <select
                  value={form.status}
                  onChange={(e) => onInput("status", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
            </div>

            <button disabled={createMutation.isPending} type="submit"
              className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" /> }
              Save Item
            </button>

            {notice ? <p className="text-sm text-primary">{notice}</p> : null}
          </form>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Latest Items</h2>
            {itemsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading items...</p>
            ) : itemsQuery.isError ? (
              <p className="text-sm text-destructive">{itemsQuery.error.message}</p>
            ) : (
              <ul className="space-y-3 max-h-[600px] overflow-auto pr-1">
                {(itemsQuery.data || []).map((item) => (
                  <li key={item.id} className="rounded-xl border border-border p-3 bg-background">
                    <p className="font-semibold">{item.nameEn}</p>
                    <p className="arabic-text text-sm text-muted-foreground">{item.nameAr}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.category} | {item.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}

function LoginScreen({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => adminLogin(username, password),
    onSuccess: (token) => onSuccess(token),
    onError: (err) => setError(err.message),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,hsl(var(--secondary))_0%,hsl(var(--background))_48%,hsl(var(--background))_100%)]">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg space-y-5"
      >
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-display font-bold leading-none">Manager Login</h1>
            <p className="arabic-text text-sm text-muted-foreground mt-1">تسجيل دخول المدير</p>
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-semibold">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold">Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          {loginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          Sign In
        </button>
      </form>
    </div>
  );
}
