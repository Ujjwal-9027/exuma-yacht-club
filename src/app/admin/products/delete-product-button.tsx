"use client";

type DeleteAction = (formData: FormData) => void | Promise<void>;

export function DeleteProductButton({
  action,
  productName,
}: {
  action: DeleteAction;
  productName: string;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="text-[#8f3526] underline decoration-[#e3c2bb] underline-offset-2"
        onClick={(event) => {
          if (!window.confirm(`Delete ${productName}?`)) event.preventDefault();
        }}
      >
        Delete
      </button>
    </form>
  );
}
