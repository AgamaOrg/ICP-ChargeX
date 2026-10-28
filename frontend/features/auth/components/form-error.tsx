type FormErrorProps = {
  message: string;
};

export function FormError({ message }: FormErrorProps) {
  return (
    <div role="alert" className="flex gap-2 rounded-md bg-danger-soft p-3 text-sm text-danger">
      <span aria-hidden="true">⚠</span>
      <p>{message}</p>
    </div>
  );
}
