import { CategoryForm, SubcategoryForm } from "@/components/forms/category-forms";
import { DeleteWithConfirm } from "@/components/forms/delete-with-confirm";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { deleteCategoryAction, deleteSubcategoryAction } from "@/app/actions";
import { getCategories } from "@/lib/queries";

export default async function CategoriasPage() {
  const categories = await getCategories();

  return (
    <div className="grid gap-4 md:gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <Card>
          <div className="mb-4">
            <p className="text-sm uppercase tracking-[0.3em] text-foreground/45">Taxonomía</p>
            <h1 className="display-copy mt-3 text-3xl text-foreground md:text-4xl">
              Categorías personalizadas.
            </h1>
          </div>
          <CategoryForm />
        </Card>
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">Subcategorías</h2>
            <p className="text-sm text-foreground/58">Afina la captura para mejorar análisis y sugerencias.</p>
          </div>
          <SubcategoryForm categories={categories} />
        </Card>
      </div>
      <Card>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">Mapa actual</h2>
          <p className="text-sm text-foreground/58">{categories.length} categorías activas.</p>
        </div>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="rounded-[1.4rem] border border-border bg-white/65 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <p className="font-semibold text-foreground">{category.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill tone={category.transaction_type === "income" ? "success" : "neutral"}>
                    {category.transaction_type === "income" ? "Ingreso" : "Gasto"}
                  </StatusPill>
                  <DeleteWithConfirm id={category.id} action={deleteCategoryAction} label="Eliminar" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {category.subcategories.length ? (
                  category.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center gap-1">
                      <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-foreground/72">
                        {subcategory.name}
                      </span>
                      <DeleteWithConfirm id={subcategory.id} action={deleteSubcategoryAction} label="×" />
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-foreground/50">Sin subcategorías aún</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
