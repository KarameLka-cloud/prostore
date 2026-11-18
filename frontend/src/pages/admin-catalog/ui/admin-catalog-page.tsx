"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Boxes,
  GripVertical,
  Image as ImageIcon,
  Pencil,
  Plus,
  Search,
  Store,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import {
  catalogRequest,
  type CatalogBrand,
  type CatalogCategory,
  type CatalogImage,
  type CatalogProduct,
} from "@/features/catalog-management/api";
import { Button } from "@/shared/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";
import { Input } from "@/shared/ui/shadcn/input";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  old_price: string;
  category_id: string;
  brand_id: string;
}

const emptyProduct: ProductForm = {
  name: "",
  description: "",
  price: "",
  old_price: "",
  category_id: "",
  brand_id: "",
};

const fieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50";

const transliteration: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[а-яё]/g, (character) => transliteration[character] ?? "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPrice(price: string) {
  return `${Number(price).toLocaleString("ru-RU")} ₽`;
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
  const [productImages, setProductImages] = useState<CatalogImage[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryImageError, setCategoryImageError] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandSlug, setBrandSlug] = useState("");
  const [editingBrand, setEditingBrand] = useState<number | null>(null);
  const [brandImage, setBrandImage] = useState<File | null>(null);
  const [brandImageError, setBrandImageError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ordering, setOrdering] = useState(false);

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
            setError(
              cause instanceof Error
                ? cause.message
                : "Не удалось загрузить каталог",
            );
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

  const title =
    section === "products"
      ? "Товары"
      : section === "categories"
        ? "Категории"
        : "Бренды";
  const createLabel =
    section === "products"
      ? "Добавить товар"
      : section === "categories"
        ? "Добавить категорию"
        : "Добавить бренд";

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru-RU");
    if (!query) return products;
    return products.filter((product) =>
      [
        product.name,
        product.category.name,
        product.brand.name,
        product.description ?? "",
      ].some((value) => value.toLocaleLowerCase("ru-RU").includes(query)),
    );
  }, [products, search]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru-RU");
    if (!query) return categories;
    return categories.filter((category) =>
      [category.name, category.slug].some((value) =>
        value.toLocaleLowerCase("ru-RU").includes(query),
      ),
    );
  }, [categories, search]);

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru-RU");
    if (!query) return brands;
    return brands.filter((brand) =>
      [brand.name, brand.slug].some((value) =>
        value.toLocaleLowerCase("ru-RU").includes(query),
      ),
    );
  }, [brands, search]);

  function closeModal() {
    setModalOpen(false);
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setProductImages([]);
    setFiles([]);
    setCategoryName("");
    setCategorySlug("");
    setEditingCategory(null);
    setCategoryImage(null);
    setCategoryImageError("");
    setBrandName("");
    setBrandSlug("");
    setEditingBrand(null);
    setBrandImage(null);
    setBrandImageError("");
  }

  function openCreateModal() {
    closeModal();
    setError("");
    setModalOpen(true);
  }

  function editProduct(product: CatalogProduct) {
    setEditingProduct(product.id);
    setProductImages(
      [...product.images].sort((left, right) => left.id - right.id),
    );
    setProductForm({
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      old_price: product.old_price ?? "",
      category_id: String(product.category_id),
      brand_id: String(product.brand_id),
    });
    setFiles([]);
    setError("");
    setModalOpen(true);
  }

  function editCategory(category: CatalogCategory) {
    setCategoryName(category.name);
    setCategorySlug(category.slug);
    setEditingCategory(category.id);
    setCategoryImage(null);
    setError("");
    setModalOpen(true);
  }

  function editBrand(brand: CatalogBrand) {
    setBrandName(brand.name);
    setBrandSlug(brand.slug);
    setEditingBrand(brand.id);
    setBrandImage(null);
    setBrandImageError("");
    setError("");
    setModalOpen(true);
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        old_price: productForm.old_price ? Number(productForm.old_price) : null,
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
      closeModal();
      await refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Не удалось сохранить товар",
      );
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
    const editingId = kind === "categories" ? editingCategory : editingBrand;
    if (!name) return;

    setSaving(true);
    setError("");
    try {
      const savedItem = await catalogRequest<CatalogCategory | CatalogBrand>(
        `${kind}${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        },
      );
      const itemId = editingId ?? savedItem?.id;
      const image = kind === "categories" ? categoryImage : brandImage;
      if (itemId && image) {
        if (!editingId) {
          if (kind === "categories") setEditingCategory(itemId);
          else setEditingBrand(itemId);
        }
        const formData = new FormData();
        formData.append("file", image);
        await catalogRequest(`${kind}/${itemId}/image`, {
          method: "POST",
          body: formData,
        });
      }
      closeModal();
      await refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Не удалось сохранить запись",
      );
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
      setError(
        cause instanceof Error ? cause.message : "Не удалось удалить запись",
      );
    }
  }

  async function saveNamedOrder(
    kind: "categories" | "brands",
    itemIds: number[],
    applyOrder: () => void,
    restoreOrder: () => void,
  ) {
    if (ordering) return;
    setOrdering(true);
    setError("");
    applyOrder();
    try {
      await catalogRequest<number[]>(`${kind}/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_ids: itemIds }),
      });
    } catch (cause) {
      restoreOrder();
      setError(
        cause instanceof Error
          ? cause.message
          : `Не удалось изменить порядок ${
              kind === "categories" ? "категорий" : "брендов"
            }`,
      );
    } finally {
      setOrdering(false);
    }
  }

  async function removeImage(productId: number, imageId: number) {
    setError("");
    try {
      await catalogRequest(`products/${productId}/images/${imageId}`, {
        method: "DELETE",
      });
      if (editingProduct === productId) {
        setProductImages((images) =>
          images.filter((image) => image.id !== imageId),
        );
      }
      await refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Не удалось удалить изображение",
      );
    }
  }

  const listCount =
    section === "products"
      ? products.length
      : section === "categories"
        ? categories.length
        : brands.length;
  const filteredCount =
    section === "products"
      ? filteredProducts.length
      : section === "categories"
        ? filteredCategories.length
        : filteredBrands.length;

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 p-2 text-foreground sm:p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>
        <Button onClick={openCreateModal} className="w-full sm:w-auto">
          <Plus data-icon="inline-start" />
          {createLabel}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<Boxes className="size-4" />}
          label="Всего товаров"
          value={products.length}
        />
        <SummaryCard
          icon={<Tag className="size-4" />}
          label="Категории"
          value={categories.length}
        />
        <SummaryCard
          icon={<Store className="size-4" />}
          label="Бренды"
          value={brands.length}
        />
      </div>

      {error && !modalOpen && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? `Показано ${filteredCount} из ${listCount}`
                : section === "categories" || section === "brands"
                  ? `${listCount} ${pluralize(section, listCount)} · перетащите за ручку слева, чтобы изменить порядок`
                  : `${listCount} ${pluralize(section, listCount)}`}
            </p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Поиск: ${title.toLocaleLowerCase("ru-RU")}`}
              aria-label={`Поиск по разделу ${title.toLocaleLowerCase("ru-RU")}`}
              className="h-9 pl-9"
            />
          </label>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Загрузка каталога...
          </div>
        ) : section === "products" ? (
          <ProductTable
            products={filteredProducts}
            onEdit={editProduct}
            onDelete={(product) => void deleteItem(`products/${product.id}`)}
          />
        ) : section === "categories" ? (
          <NamedTable
            kind="categories"
            items={filteredCategories}
            onEdit={editCategory}
            onDelete={(category) =>
              void deleteItem(`categories/${category.id}`)
            }
            ordering={ordering}
            searchActive={Boolean(search.trim())}
            onReorder={(items) =>
              saveNamedOrder(
                "categories",
                items.map((item) => item.id),
                () => setCategories(items),
                () => setCategories(categories),
              )
            }
          />
        ) : (
          <NamedTable
            kind="brands"
            items={filteredBrands}
            onEdit={editBrand}
            onDelete={(brand) => void deleteItem(`brands/${brand.id}`)}
            ordering={ordering}
            searchActive={Boolean(search.trim())}
            onReorder={(items) =>
              saveNamedOrder(
                "brands",
                items.map((item) => item.id),
                () => setBrands(items),
                () => setBrands(brands),
              )
            }
          />
        )}
      </div>

      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open && !saving) closeModal();
          else if (open) setModalOpen(true);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {section === "products"
                ? editingProduct
                  ? "Редактировать товар"
                  : "Новый товар"
                : section === "categories"
                  ? editingCategory
                    ? "Редактировать категорию"
                    : "Новая категория"
                  : editingBrand
                    ? "Редактировать бренд"
                    : "Новый бренд"}
            </DialogTitle>
            <DialogDescription>
              Заполните данные и сохраните изменения.
            </DialogDescription>
          </DialogHeader>
          {error && modalOpen && (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          {section === "products" ? (
            <form onSubmit={submitProduct} className="space-y-4">
              <label className="block space-y-1.5 text-sm">
                <span>Название</span>
                <Input
                  required
                  maxLength={255}
                  value={productForm.name}
                  onChange={(event) =>
                    setProductForm({ ...productForm, name: event.target.value })
                  }
                />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span>Описание</span>
                <textarea
                  rows={3}
                  className={fieldClass}
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      description: event.target.value,
                    })
                  }
                />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span>Текущая цена, ₽</span>
                <Input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      price: event.target.value,
                    })
                  }
                />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span>Старая цена, ₽ (необязательно)</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.old_price}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      old_price: event.target.value,
                    })
                  }
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5 text-sm">
                  <span>Категория</span>
                  <select
                    required
                    className={fieldClass}
                    value={productForm.category_id}
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        category_id: event.target.value,
                      })
                    }
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5 text-sm">
                  <span>Бренд</span>
                  <select
                    required
                    className={fieldClass}
                    value={productForm.brand_id}
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        brand_id: event.target.value,
                      })
                    }
                  >
                    <option value="">Выберите бренд</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block space-y-1.5 text-sm">
                <span>Изображения (JPEG, PNG, WebP; до 5 МБ каждое)</span>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
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
                  <span className="block text-xs text-muted-foreground">
                    Выбрано файлов: {files.length}
                  </span>
                )}
              </label>
              {editingProduct !== null && (
                <div className="space-y-2">
                  <p className="text-sm">Текущие изображения</p>
                  {productImages.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {productImages.map((image) => (
                        <div key={image.id} className="group relative">
                          <Image
                            src={image.path}
                            alt=""
                            width={72}
                            height={72}
                            unoptimized
                            className="size-[72px] rounded-md border object-cover"
                          />
                          <button
                            type="button"
                            aria-label={`Удалить изображение товара ${image.id}`}
                            disabled={saving}
                            className="absolute -right-2 -top-2 rounded-full border bg-background p-1 text-muted-foreground shadow-sm transition-colors hover:bg-destructive hover:text-white disabled:pointer-events-none disabled:opacity-50"
                            onClick={() =>
                              void removeImage(editingProduct, image.id)
                            }
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      У товара пока нет изображений.
                    </p>
                  )}
                </div>
              )}
              {(categories.length === 0 || brands.length === 0) && (
                <p className="text-sm text-amber-700">
                  Перед созданием товара добавьте категорию и бренд.
                </p>
              )}
              <ModalActions
                saving={saving}
                submitLabel={
                  editingProduct ? "Сохранить товар" : "Создать товар"
                }
                disabled={categories.length === 0 || brands.length === 0}
                onCancel={closeModal}
              />
            </form>
          ) : section === "categories" ? (
            <NamedForm
              kind="categories"
              name={categoryName}
              slug={categorySlug}
              image={categoryImage}
              imagePath={
                editingCategory === null
                  ? null
                  : (categories.find(
                      (category) => category.id === editingCategory,
                    )?.image_path ?? null)
              }
              saving={saving}
              editing={editingCategory !== null}
              onNameChange={(name) => {
                setCategoryName(name);
                setCategorySlug(makeSlug(name));
              }}
              onImageChange={setCategoryImage}
              imageError={categoryImageError}
              onImageError={setCategoryImageError}
              onSubmit={(event) => void submitNamedItem(event, "categories")}
              onCancel={closeModal}
            />
          ) : (
            <NamedForm
              kind="brands"
              name={brandName}
              slug={brandSlug}
              image={brandImage}
              imagePath={
                editingBrand === null
                  ? null
                  : (brands.find((brand) => brand.id === editingBrand)
                      ?.image_path ?? null)
              }
              saving={saving}
              editing={editingBrand !== null}
              onNameChange={(name) => {
                setBrandName(name);
                setBrandSlug(makeSlug(name));
              }}
              onImageChange={setBrandImage}
              imageError={brandImageError}
              onImageError={setBrandImageError}
              onSubmit={(event) => void submitNamedItem(event, "brands")}
              onCancel={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </div>
      <div className="rounded-lg border bg-muted p-2 text-muted-foreground">
        {icon}
      </div>
    </div>
  );
}

function ProductTable({
  products,
  onEdit,
  onDelete,
}: {
  products: CatalogProduct[];
  onEdit: (product: CatalogProduct) => void;
  onDelete: (product: CatalogProduct) => void;
}) {
  if (products.length === 0) {
    return <EmptyState message="Товары не найдены." />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Товар</th>
            <th className="px-4 py-3 font-medium">Категория</th>
            <th className="px-4 py-3 font-medium">Бренд</th>
            <th className="px-4 py-3 font-medium">Цена</th>
            <th className="px-4 py-3 text-right font-medium">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product) => {
            const firstImage = [...product.images].sort(
              (left, right) => left.id - right.id,
            )[0];
            return (
              <tr key={product.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {firstImage ? (
                      <span className="block shrink-0">
                        <Image
                          src={firstImage.path}
                          alt=""
                          width={44}
                          height={44}
                          unoptimized
                          className="size-11 rounded-md border object-cover"
                        />
                      </span>
                    ) : (
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                        <ImageIcon className="size-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="max-w-64 truncate text-xs text-muted-foreground">
                        {product.description || "Без описания"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.category.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.brand.name}
                </td>
                <td className="px-4 py-3 font-medium">
                  <div className="flex flex-col items-start">
                    {product.old_price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.old_price)}
                      </span>
                    )}
                    <span>{formatPrice(product.price)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <RowActions
                    label={product.name}
                    onEdit={() => onEdit(product)}
                    onDelete={() => onDelete(product)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function NamedTable<T extends CatalogCategory | CatalogBrand>({
  kind,
  items,
  onEdit,
  onDelete,
  ordering,
  searchActive,
  onReorder,
}: {
  kind: "categories" | "brands";
  items: T[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  ordering: boolean;
  searchActive: boolean;
  onReorder: (items: T[]) => Promise<void>;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (items.length === 0) {
    return (
      <EmptyState
        message={`${kind === "categories" ? "Категории" : "Бренды"} не найдены.`}
      />
    );
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || ordering || searchActive || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    void onReorder(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="w-12 px-2 py-3" aria-label="Изменить порядок" />
                <th className="px-4 py-3 font-medium">
                  {kind === "categories" ? "Категория" : "Бренд"}
                </th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 text-right font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <SortableNamedRow
                  key={item.id}
                  item={item}
                  kind={kind}
                  disabled={ordering || searchActive || items.length < 2}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableNamedRow<T extends CatalogCategory | CatalogBrand>({
  item,
  kind,
  disabled,
  onEdit,
  onDelete,
}: {
  item: T;
  kind: "categories" | "brands";
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled });
  const imagePath =
    kind === "categories"
      ? (item as CatalogCategory).image_path
      : (item as CatalogBrand).image_path;

  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`hover:bg-muted/30 ${
        isDragging ? "relative z-10 bg-card opacity-75 shadow-lg" : ""
      }`}
    >
      <td className="w-12 px-2 py-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={disabled}
          aria-label={`Перетащить ${item.name}`}
          title={disabled ? "Очистите поиск, чтобы менять порядок" : "Перетащить"}
          style={{ touchAction: "none" }}
          className="flex size-8 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-muted active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
        >
          <GripVertical className="size-4" />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {imagePath ? (
            <Image
              src={imagePath}
              alt=""
              width={40}
              height={40}
              unoptimized
              className="size-10 rounded-md border object-cover"
            />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-md border bg-muted text-muted-foreground">
              {kind === "categories" ? (
                <Tag className="size-4" />
              ) : (
                <Store className="size-4" />
              )}
            </div>
          )}
          <span className="font-medium">{item.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{item.slug}</td>
      <td className="px-4 py-3">
        <RowActions label={item.name} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}

function RowActions({
  label,
  onEdit,
  onDelete,
}: {
  label: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Редактировать: ${label}`}
        onClick={onEdit}
      >
        <Pencil data-icon="inline-start" />
        Изменить
      </Button>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Удалить: ${label}`}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 data-icon="inline-start" />
        Удалить
      </Button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function ModalActions({
  saving,
  submitLabel,
  disabled = false,
  onCancel,
}: {
  saving: boolean;
  submitLabel: string;
  disabled?: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-2 border-t pt-4">
      <Button
        type="button"
        variant="outline"
        disabled={saving}
        onClick={onCancel}
      >
        Отмена
      </Button>
      <Button type="submit" disabled={saving || disabled}>
        {saving ? "Сохранение..." : submitLabel}
      </Button>
    </div>
  );
}

function NamedForm({
  kind,
  name,
  slug,
  image,
  imagePath,
  saving,
  editing,
  onNameChange,
  onImageChange,
  imageError,
  onImageError,
  onSubmit,
  onCancel,
}: {
  kind: "categories" | "brands";
  name: string;
  slug: string;
  image: File | null;
  imagePath: string | null;
  saving: boolean;
  editing: boolean;
  onNameChange: (value: string) => void;
  onImageChange: (value: File | null) => void;
  imageError: string;
  onImageError: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  const isCategory = kind === "categories";
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5 text-sm">
        <span>Название</span>
        <Input
          required
          maxLength={120}
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
        />
      </label>
      <label className="block space-y-1.5 text-sm">
        <span>Slug (формируется автоматически)</span>
        <Input readOnly value={slug} />
        <span className="block text-xs text-muted-foreground">
          Ссылка: /catalog/{slug || "slug"}
        </span>
      </label>
      <label className="block space-y-1.5 text-sm">
        <span>
          Изображение {isCategory ? "категории" : "бренда"} (JPEG, PNG или WebP;
          до 5 МБ)
        </span>
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            if (file && file.size > 5 * 1024 * 1024) {
              event.target.value = "";
              onImageChange(null);
              onImageError("Размер изображения не должен превышать 5 МБ");
              return;
            }
            onImageChange(file);
            onImageError("");
          }}
        />
        {imageError && (
          <span role="alert" className="block text-xs text-destructive">
            {imageError}
          </span>
        )}
        {image && (
          <span className="block text-xs text-muted-foreground">
            Выбран файл: {image.name}
          </span>
        )}
        {!image && imagePath && (
          <Image
            src={imagePath}
            alt=""
            width={96}
            height={96}
            unoptimized
            className="size-24 rounded-md border object-contain"
          />
        )}
      </label>
      <ModalActions
        saving={saving}
        submitLabel={
          editing
            ? `Сохранить ${isCategory ? "категорию" : "бренд"}`
            : `Создать ${isCategory ? "категорию" : "бренд"}`
        }
        onCancel={onCancel}
      />
    </form>
  );
}

function pluralize(
  section: "products" | "categories" | "brands",
  count: number,
) {
  if (section === "products") {
    const lastTwo = count % 100;
    const last = count % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return "товаров";
    if (last === 1) return "товар";
    if (last >= 2 && last <= 4) return "товара";
    return "товаров";
  }
  if (section === "categories") {
    if (count % 10 === 1 && count % 100 !== 11) return "категория";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
      return "категории";
    }
    return "категорий";
  }
  if (count % 10 === 1 && count % 100 !== 11) return "бренд";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return "бренда";
  }
  return "брендов";
}
