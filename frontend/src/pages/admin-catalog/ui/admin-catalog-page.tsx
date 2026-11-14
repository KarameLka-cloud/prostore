"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";

import {
  catalogRequest,
  type CatalogBrand,
  type CatalogCategory,
  type CatalogProduct,
} from "@/features/catalog-management/api";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category_id: string;
  brand_id: string;
}

const emptyProduct: ProductForm = {
  name: "",
  description: "",
  price: "",
  category_id: "",
  brand_id: "",
};

const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-violet-500";
const actionClass =
  "rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50";
const primaryActionClass =
  "border-violet-300 bg-violet-100 text-violet-950 hover:bg-violet-200";

const transliteration: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
  ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[а-яё]/g, (character) => transliteration[character] ?? "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCatalogPage({
  section,
}: {
  section: "products" | "categories" | "brands";
}) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [files, setFiles] = useState<File[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandSlug, setBrandSlug] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [editingBrand, setEditingBrand] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    const [nextProducts, nextCategories, nextBrands] = await Promise.all([
      catalogRequest<CatalogProduct[]>("products"),
      catalogRequest<CatalogCategory[]>("categories"),
      catalogRequest<CatalogBrand[]>("brands"),
    ]);
    setProducts(nextProducts ?? []);
    setCategories(nextCategories ?? []);
    setBrands(nextBrands ?? []);
  }, []);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      refresh()
        .catch((cause: unknown) => {
          if (active) {
            setError(cause instanceof Error ? cause.message : "Не удалось загрузить каталог");
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [refresh]);

  function resetProductForm() {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setFiles([]);
  }

  function editProduct(product: CatalogProduct) {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      category_id: String(product.category_id),
      brand_id: String(product.brand_id),
    });
    setFiles([]);
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        category_id: Number(productForm.category_id),
        brand_id: Number(productForm.brand_id),
      };
      const product = await catalogRequest<CatalogProduct>(
        editingProduct ? `products/${editingProduct}` : "products",
        {
          method: editingProduct ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!editingProduct && product) {
        setEditingProduct(product.id);
      }
      if (files.length && product) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        await catalogRequest<CatalogProduct>(`products/${product.id}/images`, {
          method: "POST",
          body: formData,
        });
      }
      resetProductForm();
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось сохранить товар");
    } finally {
      setSaving(false);
    }
  }

  async function submitNamedItem(
    event: FormEvent<HTMLFormElement>,
    kind: "categories" | "brands",
  ) {
    event.preventDefault();
    const name = kind === "categories" ? categoryName.trim() : brandName.trim();
    const slug = kind === "categories" ? categorySlug.trim() : brandSlug.trim();
    const editingId = kind === "categories" ? editingCategory : editingBrand;
    if (!name || !slug) return;

    setSaving(true);
    setError("");
    try {
      const savedItem = await catalogRequest<CatalogCategory | CatalogBrand>(
        `${kind}${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            kind === "categories"
              ? { name, slug, description: categoryDescription.trim() || null }
              : { name, slug, description: brandDescription.trim() || null },
          ),
        },
      );
      if (kind === "categories") {
        const categoryId = editingId ?? savedItem?.id;
        if (categoryId && categoryImage) {
          if (!editingId) {
            setEditingCategory(categoryId);
            setCategoryName(name);
          }
          const formData = new FormData();
          formData.append("file", categoryImage);
          await catalogRequest<CatalogCategory>(
            `categories/${categoryId}/image`,
            { method: "POST", body: formData },
          );
        }
        setCategoryName("");
        setCategorySlug("");
        setCategoryDescription("");
        setEditingCategory(null);
        setCategoryImage(null);
      } else {
        setBrandName("");
        setBrandSlug("");
        setBrandDescription("");
        setEditingBrand(null);
      }
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось сохранить запись");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(path: string) {
    if (!window.confirm("Удалить запись?")) return;
    setError("");
    try {
      await catalogRequest(path, { method: "DELETE" });
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось удалить запись");
    }
  }

  async function removeImage(productId: number, imageId: number) {
    setError("");
    try {
      await catalogRequest(`products/${productId}/images/${imageId}`, {
        method: "DELETE",
      });
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось удалить изображение");
    }
  }

  return (
    <section className="space-y-6 bg-white text-zinc-900">
      <div>
        <p className="text-sm text-zinc-600">Управление магазином</p>
        <h1 className="mt-1 text-3xl font-semibold">
          {section === "products"
            ? "Товары"
            : section === "categories"
              ? "Категории"
              : "Бренды"}
        </h1>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-zinc-600">Загрузка каталога...</p>
      ) : (
        <>
          {section === "products" && (
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
              <div className="space-y-3">
                <h2 className="text-xl font-medium">Товары ({products.length})</h2>
                {products.length === 0 ? (
                  <p className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
                    Товаров пока нет. Создайте первый товар справа.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <article key={product.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex min-w-0 gap-3">
                            {product.images[0] && (
                              <Image
                                src={product.images[0].path}
                                alt={product.name}
                                width={64}
                                height={64}
                                unoptimized
                                className="size-16 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="mt-1 text-sm text-zinc-600">
                                {product.category.name} · {product.brand.name}
                              </p>
                              <p className="mt-1 text-sm">
                                {Number(product.price).toLocaleString("ru-RU")} ₽
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" className={actionClass} onClick={() => editProduct(product)}>
                              Изменить
                            </button>
                            <button type="button" className={actionClass} onClick={() => void deleteItem(`products/${product.id}`)}>
                              Удалить
                            </button>
                          </div>
                        </div>
                        {product.images.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {product.images.map((image) => (
                              <div key={image.id} className="relative">
                                <Image
                                  src={image.path}
                                  alt={product.name}
                                  width={64}
                                  height={64}
                                  unoptimized
                                  className="size-16 rounded-lg object-cover"
                                />
                                <button
                                  type="button"
                                  className="absolute -right-2 -top-2 rounded-full border border-red-300 bg-red-100 px-1.5 text-xs text-red-800 hover:bg-red-200"
                                  aria-label={`Удалить фото товара ${product.name}`}
                                  onClick={() => void removeImage(product.id, image.id)}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={submitProduct} className="h-fit space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-medium">
                    {editingProduct ? "Редактирование товара" : "Новый товар"}
                  </h2>
                  {editingProduct && (
                    <button type="button" className="text-sm text-zinc-600 hover:text-zinc-900" onClick={resetProductForm}>
                      Отмена
                    </button>
                  )}
                </div>
                <label className="block space-y-1 text-sm">
                  <span>Название</span>
                  <input required maxLength={255} className={fieldClass} value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} />
                </label>
                <label className="block space-y-1 text-sm">
                  <span>Описание</span>
                  <textarea rows={3} className={fieldClass} value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} />
                </label>
                <label className="block space-y-1 text-sm">
                  <span>Цена, ₽</span>
                  <input required type="number" min="0" step="0.01" className={fieldClass} value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} />
                </label>
                <label className="block space-y-1 text-sm">
                  <span>Категория</span>
                  <select required className={fieldClass} value={productForm.category_id} onChange={(event) => setProductForm({ ...productForm, category_id: event.target.value })}>
                    <option className="bg-white text-zinc-900" value="">Выберите категорию</option>
                    {categories.map((category) => <option className="bg-white text-zinc-900" key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </label>
                <label className="block space-y-1 text-sm">
                  <span>Бренд</span>
                  <select required className={fieldClass} value={productForm.brand_id} onChange={(event) => setProductForm({ ...productForm, brand_id: event.target.value })}>
                    <option className="bg-white text-zinc-900" value="">Выберите бренд</option>
                    {brands.map((brand) => <option className="bg-white text-zinc-900" key={brand.id} value={brand.id}>{brand.name}</option>)}
                  </select>
                </label>
                <label className="block space-y-1 text-sm">
                  <span>Изображения (JPEG, PNG, WebP; до 5 МБ каждое)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className={`${fieldClass} file:mr-3`}
                    onChange={(event) => {
                      const selectedFiles = Array.from(event.target.files ?? []);
                      if (selectedFiles.length > 10) {
                        setError("Можно выбрать не более 10 изображений за раз");
                        event.target.value = "";
                        setFiles([]);
                        return;
                      }
                      setError("");
                      setFiles(selectedFiles);
                    }}
                  />
                  {files.length > 0 && (
                    <span className="block text-xs text-zinc-600">Выбрано файлов: {files.length}</span>
                  )}
                </label>
                <button type="submit" disabled={saving || categories.length === 0 || brands.length === 0} className={`${actionClass} ${primaryActionClass} w-full`}>
                  {saving ? "Сохранение..." : editingProduct ? "Сохранить товар" : "Создать товар"}
                </button>
                {(categories.length === 0 || brands.length === 0) && (
                  <p className="text-xs text-amber-800">Перед созданием товара добавьте категорию и бренд.</p>
                )}
              </form>
            </div>
          )}

          {(section === "categories" || section === "brands") && (() => {
            const isCategory = section === "categories";
            const items = isCategory ? categories : brands;
            const name = isCategory ? categoryName : brandName;
            const editingId = isCategory ? editingCategory : editingBrand;
            const kind = isCategory ? "categories" : "brands";
            return (
              <div className="grid gap-8 md:grid-cols-[minmax(0,360px)_1fr]">
                <form onSubmit={(event) => void submitNamedItem(event, kind)} className="h-fit space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
                  <h2 className="text-xl font-medium">
                    {editingId ? "Редактировать" : "Добавить"} {isCategory ? "категорию" : "бренд"}
                  </h2>
                  <label className="block space-y-1 text-sm">
                    <span>Название</span>
                    <input
                      required
                      maxLength={120}
                      className={fieldClass}
                      value={name}
                      onChange={(event) => {
                        const nextName = event.target.value;
                        if (isCategory) {
                          setCategoryName(nextName);
                          setCategorySlug(makeSlug(nextName));
                        } else {
                          setBrandName(nextName);
                          setBrandSlug(makeSlug(nextName));
                        }
                      }}
                    />
                  </label>
                  <label className="block space-y-1 text-sm">
                    <span>Наименование тега для ссылки (slug)</span>
                    <input
                      required
                      maxLength={120}
                      pattern="[a-z0-9]+(-[a-z0-9]+)*"
                      title="Используйте латинские буквы, цифры и дефис"
                      className={fieldClass}
                      value={isCategory ? categorySlug : brandSlug}
                      onChange={(event) => {
                        const nextSlug = makeSlug(event.target.value);
                        if (isCategory) setCategorySlug(nextSlug);
                        else setBrandSlug(nextSlug);
                      }}
                    />
                    <span className="block text-xs text-zinc-600">
                      Ссылка: /catalog/{isCategory ? categorySlug || "slug" : brandSlug || "slug"}
                    </span>
                  </label>
                  <label className="block space-y-1 text-sm">
                    <span>Описание</span>
                    <textarea
                      rows={3}
                      className={fieldClass}
                      value={isCategory ? categoryDescription : brandDescription}
                      onChange={(event) => {
                        if (isCategory) setCategoryDescription(event.target.value);
                        else setBrandDescription(event.target.value);
                      }}
                    />
                  </label>
                  {isCategory && (
                    <label className="block space-y-1 text-sm">
                      <span>
                        Изображение категории (JPEG, PNG или WebP; до 5 МБ)
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className={fieldClass}
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          if (file && file.size > 5 * 1024 * 1024) {
                            setError("Размер изображения не должен превышать 5 МБ");
                            event.target.value = "";
                            setCategoryImage(null);
                            return;
                          }
                          setError("");
                          setCategoryImage(file);
                        }}
                      />
                      {categoryImage && (
                        <span className="block text-xs text-zinc-600">
                          Выбран файл: {categoryImage.name}
                        </span>
                      )}
                    </label>
                  )}
                  <div className="flex gap-2">
                    <button type="submit" disabled={saving} className={`${actionClass} ${primaryActionClass} flex-1`}>
                      {saving ? "Сохранение..." : editingId ? "Сохранить" : "Добавить"}
                    </button>
                    {editingId && (
                      <button type="button" className={actionClass} onClick={() => {
                        if (isCategory) {
                          setCategoryName("");
                          setCategorySlug("");
                          setCategoryDescription("");
                          setEditingCategory(null);
                        }
                        if (isCategory) setCategoryImage(null);
                        else {
                          setBrandName("");
                          setBrandSlug("");
                          setBrandDescription("");
                          setEditingBrand(null);
                        }
                      }}>
                        Отмена
                      </button>
                    )}
                  </div>
                </form>
                <div className="space-y-3">
                  <h2 className="text-xl font-medium">{isCategory ? "Категории" : "Бренды"} ({items.length})</h2>
                  {items.length === 0 ? (
                    <p className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">Список пока пуст.</p>
                  ) : items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                      <div className="flex min-w-0 items-center gap-3">
                        {isCategory &&
                          (() => {
                            const imagePath = categories.find(
                              (category) => category.id === item.id,
                            )?.image_path;
                            return imagePath ? (
                              <Image
                                src={imagePath}
                                alt=""
                                width={48}
                                height={48}
                                unoptimized
                                className="size-12 rounded-md object-cover"
                              />
                            ) : null;
                          })()}
                        <div>
                          <span>{item.name}</span>
                          <span className="block text-xs text-zinc-500">/{item.slug}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className={actionClass} onClick={() => {
                          if (isCategory) {
                            setCategoryName(item.name);
                            setCategorySlug(item.slug);
                            setCategoryDescription(
                              (item as CatalogCategory).description ?? "",
                            );
                            setEditingCategory(item.id);
                            setCategoryImage(null);
                          }
                          else {
                            setBrandName(item.name);
                            setBrandSlug(item.slug);
                            setBrandDescription(
                              (item as CatalogBrand).description ?? "",
                            );
                            setEditingBrand(item.id);
                          }
                        }}>
                          Изменить
                        </button>
                        <button type="button" className={actionClass} onClick={() => void deleteItem(`${kind}/${item.id}`)}>
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </>
      )}
    </section>
  );
}
