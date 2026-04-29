import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "../schemas";
import { uploadsApi } from "../../uploads/api";
import { useToast } from "../../../components/toast/useToast";
import { ProductImage } from "../../../components/shared/ProductImage";
import { SubmitButton } from "../../../components/shared/SubmitButton";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Select } from "../../../components/ui/Select";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { getErrorMessage } from "../../../lib/api-error";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel: string;
}

export const ProductForm = ({ defaultValues, onSubmit, submitLabel }: ProductFormProps) => {
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>(defaultValues?.imageUrl);
  const toast = useToast();
  const imageInputId = "product-image-upload";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      const { imageUrl } = await uploadsApi.uploadProductImage(file);
      setValue("imageUrl", imageUrl);
      setImagePreview(imageUrl);
      toast.success("The product image was uploaded.", "Upload complete");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message, "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      setError("");
      await onSubmit(data);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message, "Save failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-lg">
      {error && <ErrorMessage message={error} />}

      <Input label="Product Name" {...register("name")} error={errors.name?.message} />

      <Textarea
        label="Description"
        {...register("description")}
        error={errors.description?.message}
        rows={4}
      />

      <div className="grid grid-cols-2 gap-md">
        <Input
          label="Price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          error={errors.price?.message}
        />
        <Input
          label="Stock"
          type="number"
          {...register("stock", { valueAsNumber: true })}
          error={errors.stock?.message}
        />
      </div>

      <Select label="Category" {...register("category")} error={errors.category?.message}>
        <option value="">Select a category</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Books">Books</option>
        <option value="Home">Home</option>
        <option value="Sports">Sports</option>
      </Select>

      <div>
        <label htmlFor={imageInputId} className="block text-body text-ink mb-sm">
          Product Image
        </label>
        {imagePreview && (
          <ProductImage
            src={imagePreview}
            alt="Product preview"
            className="mb-md h-48 w-48 rounded-md bg-canvas-parchment"
          />
        )}
        <input
          id={imageInputId}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleImageUpload}
          disabled={uploading}
          className="block w-full text-body text-ink file:mr-md file:py-sm file:px-md file:rounded-md file:border-0 file:text-caption file:bg-canvas-parchment file:text-ink hover:file:bg-hairline"
        />
        {uploading && <p className="text-caption text-ink-muted-80 mt-sm">Uploading...</p>}
        <p className="text-caption text-ink-muted-80 mt-sm">Max 5MB. Formats: JPG, PNG, WebP</p>
      </div>

      <SubmitButton isSubmitting={isSubmitting}>{submitLabel}</SubmitButton>
    </form>
  );
};
