interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  emptyLabel?: string;
}

export const ProductImage = ({
  src,
  alt,
  className = "",
  imageClassName = "h-full w-full object-contain",
  emptyLabel = "No image available",
}: ProductImageProps) => {
  return (
    <div className={className}>
      {src ? (
        <img src={src} alt={alt} className={imageClassName} />
      ) : (
        <div className="flex h-full items-center justify-center p-6 text-center font-mono text-[0.75rem] uppercase tracking-[0.16em] text-muted-foreground">
          {emptyLabel}
        </div>
      )}
    </div>
  );
};
