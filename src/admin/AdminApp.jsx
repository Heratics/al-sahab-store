import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { createStoreItem, getAdminItems, updateStoreItem } from "@/lib/api";
import { adminLogin } from "@/lib/api";
import { LogIn, LogOut } from "lucide-react";
import { categories } from "@/data/store-data";

const MAX_IMAGES = 10;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

const defaultForm = {
  nameEn: "",
  nameAr: "",
  category: "",
  descEn: "",
  descAr: "",
  imageUrls: [""],
  price: "",
  onSale: false,
  salePrice: "",
  isFeatured: true,
  status: "published",
};

export default function AdminApp() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [editingItemId, setEditingItemId] = useState(null);
  const [notice, setNotice] = useState("");

  const itemsQuery = useQuery({
    queryKey: ["admin-items"],
    queryFn: () => getAdminItems(token),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => createStoreItem(payload, token),
    onSuccess: (id) => {
      setForm(defaultForm);
      setEditingItemId(null);
      setNotice(`Item #${id} created successfully.`);
      queryClient.invalidateQueries({ queryKey: ["admin-items"] });
      queryClient.invalidateQueries({ queryKey: ["store-items"] });
    },
    onError: (error) => {
      setNotice(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateStoreItem(id, payload, token),
    onSuccess: (id) => {
      setForm(defaultForm);
      setEditingItemId(null);
      setNotice(`Item #${id} updated successfully.`);
      queryClient.invalidateQueries({ queryKey: ["admin-items"] });
      queryClient.invalidateQueries({ queryKey: ["store-items"] });
      queryClient.invalidateQueries({ queryKey: ["store-item"] });
    },
    onError: (error) => {
      setNotice(error.message);
    },
  });

  const onInput = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onImageUrlInput = (index, value) => {
    setForm((prev) => {
      const nextImageUrls = [...prev.imageUrls];
      nextImageUrls[index] = value;
      return { ...prev, imageUrls: nextImageUrls };
    });
  };

  const addImageUrlField = () => {
    setForm((prev) => {
      if (prev.imageUrls.length >= MAX_IMAGES) return prev;
      return { ...prev, imageUrls: [...prev.imageUrls, ""] };
    });
  };

  const removeImageUrlField = (index) => {
    setForm((prev) => {
      const nextImageUrls = prev.imageUrls.filter((_, imageIndex) => imageIndex !== index);
      return { ...prev, imageUrls: nextImageUrls.length ? nextImageUrls : [""] };
    });
  };

  const onImageFileUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    try {
      const uploadedImages = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      setForm((prev) => {
        const current = prev.imageUrls.map((url) => url.trim()).filter(Boolean);
        const combined = [...current, ...uploadedImages].slice(0, MAX_IMAGES);
        if (combined.length < current.length + uploadedImages.length) {
          setNotice(`Only the first ${MAX_IMAGES} images were kept.`);
        }
        return { ...prev, imageUrls: combined.length ? combined : [""] };
      });
    } catch (error) {
      setNotice(error.message || "Failed to upload one or more images.");
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setNotice("");

    const imageUrls = form.imageUrls.map((value) => value.trim()).filter(Boolean);
    if (imageUrls.length < 1) {
      setNotice("Please add at least 1 image.");
      return;
    }

    if (imageUrls.length > MAX_IMAGES) {
      setNotice(`Maximum ${MAX_IMAGES} images are allowed.`);
      return;
    }

    const price = Number(form.price);
    const salePrice = form.onSale && form.salePrice !== "" ? Number(form.salePrice) : null;

    if (!Number.isFinite(price) || price <= 0) {
      setNotice("Please enter a valid base price.");
      return;
    }

    if (form.onSale) {
      if (!Number.isFinite(salePrice) || salePrice <= 0) {
        setNotice("Please enter a valid sale price.");
        return;
      }

      if (salePrice >= price) {
        setNotice("Sale price must be less than base price.");
        return;
      }
    }

    const payload = {
      ...form,
      imageUrls,
      price,
      salePrice,
    };

    if (editingItemId) {
      updateMutation.mutate({ id: editingItemId, payload });
      return;
    }

    createMutation.mutate(payload);
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
            <h2 className="text-xl font-bold">{editingItemId ? `Edit Item #${editingItemId}` : "Add New Item"}</h2>

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
              <select
                value={form.category}
                onChange={(e) => onInput("category", e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.nameEn}>{category.nameEn}</option>
                ))}
              </select>
            </label>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Item Images (1-10)</span>
                <button
                  type="button"
                  onClick={addImageUrlField}
                  disabled={form.imageUrls.length >= MAX_IMAGES}
                  className="text-xs font-medium rounded-md border border-border px-2 py-1 hover:bg-muted/50 disabled:opacity-50"
                >
                  + Add URL
                </button>
              </div>

              {form.imageUrls.map((url, index) => (
                <div key={`image-url-${index}`} className="flex items-center gap-2">
                  <input
                    value={url}
                    onChange={(e) => onImageUrlInput(index, e.target.value)}
                    type="text"
                    placeholder={`Image URL ${index + 1}`}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageUrlField(index)}
                    className="rounded-lg border border-border px-2 py-2 text-xs hover:bg-muted/50"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <label className="block">
                <span className="text-xs text-muted-foreground">Or upload image files</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onImageFileUpload}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold">Base Price</span>
                <input
                  value={form.price}
                  onChange={(e) => onInput("price", e.target.value)}
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="inline-flex items-center gap-2 font-medium mt-6">
                <input
                  type="checkbox"
                  checked={form.onSale}
                  onChange={(e) => onInput("onSale", e.target.checked)}
                />
                On sale
              </label>
            </div>

            {form.onSale ? (
              <label className="block">
                <span className="text-sm font-semibold">Sale Price</span>
                <input
                  value={form.salePrice}
                  onChange={(e) => onInput("salePrice", e.target.value)}
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
                />
              </label>
            ) : null}

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

            <button disabled={createMutation.isPending || updateMutation.isPending} type="submit"
              className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" /> }
              {editingItemId ? "Update Item" : "Save Item"}
            </button>

            {editingItemId ? (
              <button
                type="button"
                onClick={() => {
                  setForm(defaultForm);
                  setEditingItemId(null);
                  setNotice("");
                }}
                className="w-full rounded-xl border border-border py-3 font-semibold hover:bg-muted/50 transition-colors"
              >
                Cancel Editing
              </button>
            ) : null}

            {notice ? <p className="text-sm text-primary">{notice}</p> : null}
          </form>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Latest Items</h2>
            {itemsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading items...</p>
            ) : itemsQuery.isError ? (
              <p className="text-sm text-destructive">{itemsQuery.error.message}</p>
            ) : (
              <ul className="space-y-3 max-h-150 overflow-auto pr-1">
                {(itemsQuery.data || []).map((item) => (
                  <li key={item.id} className="rounded-xl border border-border p-3 bg-background">
                    <p className="font-semibold">{item.nameEn}</p>
                    <p className="arabic-text text-sm text-muted-foreground">{item.nameAr}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.category} | {item.status}</p>
                    <p className="text-sm mt-2">
                      {item.onSale && item.salePrice != null ? (
                        <>
                          <span className="text-muted-foreground line-through mr-2">${Number(item.price).toFixed(2)}</span>
                          <span className="font-semibold text-primary">${Number(item.salePrice).toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-semibold text-foreground">${Number(item.price).toFixed(2)}</span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItemId(item.id);
                        setForm({
                          nameEn: item.nameEn,
                          nameAr: item.nameAr,
                          category: item.category,
                          descEn: item.descEn,
                          descAr: item.descAr,
                          imageUrls: item.imageUrls?.length ? item.imageUrls : [item.imageUrl],
                          price: String(item.price),
                          onSale: item.onSale,
                          salePrice: item.salePrice == null ? "" : String(item.salePrice),
                          isFeatured: item.isFeatured,
                          status: item.status,
                        });
                        setNotice(`Editing item #${item.id}`);
                      }}
                      className="mt-3 inline-flex rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted/50 transition-colors"
                    >
                      Edit Item
                    </button>
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
  const [showPassword, setShowPassword] = useState(false);

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
          <div className="mt-1 relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-11 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
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
