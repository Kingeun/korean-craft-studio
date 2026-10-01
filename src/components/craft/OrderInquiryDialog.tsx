"use client";

import { useEffect, useRef, useState } from "react";
import type { Craft, MockApiResult } from "@/src/types";
import { submitOrderInquiry } from "@/src/lib/mock-api";
import { PracticeNotice } from "@/src/components/PracticeNotice";

type OrderInquiryDialogProps = {
  craft: Craft | null;
  open: boolean;
  onClose: () => void;
};

const CONTACT_PATTERN = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;

type FormState = {
  name: string;
  contact: string;
  quantity: string;
  request: string;
};

const INITIAL_FORM_STATE: FormState = {
  name: "",
  contact: "",
  quantity: "1",
  request: "",
};

type FieldErrors = {
  name?: string;
  contact?: string;
  quantity?: string;
};

/**
 * Focus restoration contract:
 * The caller (CraftsPanel / whoever renders this dialog) MUST keep a ref to
 * the "주문 문의하기" button that triggered the dialog's opening, and refocus
 * that button inside the `onClose` callback passed here. This component only
 * moves focus INTO the dialog when it opens (to the name input); it does not
 * know which button opened it, so it cannot restore focus on close itself.
 */
export default function OrderInquiryDialog({
  craft,
  open,
  onClose,
}: OrderInquiryDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "pending">("idle");
  const [result, setResult] = useState<MockApiResult | null>(null);
  const [lastCraftId, setLastCraftId] = useState<string | undefined>(
    craft?.id,
  );

  // Reset form state whenever a different craft is opened. Adjusting state
  // during render (rather than in an effect) avoids an extra render pass;
  // see https://react.dev/learn/you-might-not-need-an-effect
  if (craft?.id !== lastCraftId) {
    setLastCraftId(craft?.id);
    setForm(INITIAL_FORM_STATE);
    setErrors({});
    setStatus("idle");
    setResult(null);
  }

  useEffect(() => {
    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    if (open && craft) {
      if (!dialogEl.open) {
        dialogEl.showModal();
      }
      nameInputRef.current?.focus();
    } else if (dialogEl.open) {
      dialogEl.close();
    }
  }, [open, craft]);

  function handleDialogClose() {
    onClose();
  }

  function validate(): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (form.name.trim().length === 0) {
      nextErrors.name = "이름을 입력해 주세요.";
    }

    const trimmedContact = form.contact.trim();
    if (trimmedContact.length === 0) {
      nextErrors.contact = "연락처를 입력해 주세요.";
    } else if (!CONTACT_PATTERN.test(trimmedContact)) {
      nextErrors.contact = "올바른 연락처 형식이 아닙니다. 예: 010-1234-5678";
    }

    const quantityNum = Number(form.quantity);
    if (
      form.quantity.trim().length === 0 ||
      !Number.isInteger(quantityNum) ||
      quantityNum < 1 ||
      quantityNum > 10
    ) {
      nextErrors.quantity = "수량은 1에서 10 사이의 정수로 입력해 주세요.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending" || !craft) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus("pending");
    setResult(null);

    const apiResult = await submitOrderInquiry({
      name: form.name.trim(),
      contact: form.contact.trim(),
      craftId: craft.id,
      quantity: Number(form.quantity),
      request: form.request.trim(),
    });

    setResult(apiResult);
    setStatus("idle");
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleDialogClose}
      className="m-auto max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-paper p-0 text-ink backdrop:bg-ink-point/40"
    >
      {craft ? (
        <div className="p-6">
          <h2 className="font-serif text-xl font-bold text-ink-point">
            주문 문의
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{craft.name}</p>

          <div className="mt-4">
            <PracticeNotice variant="inline" />
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1">
              <label htmlFor="order-name" className="text-sm font-medium text-ink">
                이름
              </label>
              <input
                ref={nameInputRef}
                id="order-name"
                type="text"
                required
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                aria-invalid={errors.name ? "true" : undefined}
                aria-describedby={errors.name ? "order-name-error" : undefined}
                className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink-point"
              />
              {errors.name ? (
                <p
                  id="order-name-error"
                  aria-live="polite"
                  className="text-xs text-red-700"
                >
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="order-contact" className="text-sm font-medium text-ink">
                연락처
              </label>
              <input
                id="order-contact"
                type="text"
                required
                value={form.contact}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, contact: event.target.value }))
                }
                placeholder="010-1234-5678"
                aria-invalid={errors.contact ? "true" : undefined}
                aria-describedby={
                  errors.contact ? "order-contact-error" : undefined
                }
                className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink-point"
              />
              {errors.contact ? (
                <p
                  id="order-contact-error"
                  aria-live="polite"
                  className="text-xs text-red-700"
                >
                  {errors.contact}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="order-product" className="text-sm font-medium text-ink">
                상품
              </label>
              <input
                id="order-product"
                type="text"
                readOnly
                value={craft.name}
                className="rounded-md border border-border bg-paper-raised px-3 py-2 text-sm text-ink-soft"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="order-quantity" className="text-sm font-medium text-ink">
                수량
              </label>
              <input
                id="order-quantity"
                type="number"
                required
                min={1}
                max={10}
                step={1}
                value={form.quantity}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, quantity: event.target.value }))
                }
                aria-invalid={errors.quantity ? "true" : undefined}
                aria-describedby={
                  errors.quantity ? "order-quantity-error" : undefined
                }
                className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink-point"
              />
              {errors.quantity ? (
                <p
                  id="order-quantity-error"
                  aria-live="polite"
                  className="text-xs text-red-700"
                >
                  {errors.quantity}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="order-request" className="text-sm font-medium text-ink">
                요청사항 (선택)
              </label>
              <textarea
                id="order-request"
                rows={3}
                value={form.request}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, request: event.target.value }))
                }
                className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink-point"
              />
            </div>

            {result ? (
              <p
                aria-live="polite"
                className={`text-sm ${
                  result.success ? "text-green-700" : "text-red-700"
                }`}
              >
                {result.success
                  ? `${result.message} (접수번호: ${result.receiptNumber})`
                  : result.message}
              </p>
            ) : null}

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-paper-raised"
              >
                닫기
              </button>
              <button
                type="submit"
                disabled={status === "pending"}
                className="rounded-md bg-ink-point px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "pending" ? "전송 중..." : "문의 보내기"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </dialog>
  );
}
