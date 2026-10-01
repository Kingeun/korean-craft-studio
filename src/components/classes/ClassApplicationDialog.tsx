"use client";

import { useEffect, useId, useRef, useState } from "react";
import PracticeNotice from "@/src/components/PracticeNotice";
import { submitClassApplication } from "@/src/lib/mock-api";
import type { CraftClass, MockApiResult } from "@/src/types";

type ClassApplicationDialogProps = {
  cls: CraftClass | null;
  open: boolean;
  /**
   * Called whenever the dialog should close (Escape key, backdrop click, or
   * the explicit close button). Contract: the caller is responsible for
   * keeping a ref to the "신청하기" button that opened this dialog and
   * refocusing it from inside (or right after) this callback, since this
   * component only knows about the dialog itself, not which card opened it.
   */
  onClose: () => void;
};

const PHONE_PATTERN = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;

type FormState = {
  name: string;
  contact: string;
  preferredDate: string;
  participantCount: string;
  request: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function emptyForm(): FormState {
  return {
    name: "",
    contact: "",
    preferredDate: "",
    participantCount: "",
    request: "",
  };
}

function todayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ClassApplicationDialog({
  cls,
  open,
  onClose,
}: ClassApplicationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "done">("idle");
  const [result, setResult] = useState<MockApiResult | null>(null);

  const nameId = useId();
  const contactId = useId();
  const contactErrorId = useId();
  const classId = useId();
  const dateId = useId();
  const dateErrorId = useId();
  const countId = useId();
  const countErrorId = useId();
  const requestId = useId();

  const min = todayISODate();

  // Reset form state whenever a different class is opened (or the dialog is
  // reopened for the same class). Adjusting state during render instead of
  // in an effect avoids an extra render pass; this is the pattern React
  // recommends for "resetting state when a prop changes".
  const resetKey = open ? (cls?.id ?? null) : null;
  const [prevResetKey, setPrevResetKey] = useState<string | null>(null);
  if (resetKey !== null && resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    setForm(emptyForm());
    setErrors({});
    setStatus("idle");
    setResult(null);
  }

  useEffect(() => {
    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    if (open) {
      if (!dialogEl.open) {
        dialogEl.showModal();
      }
      nameInputRef.current?.focus();
    } else if (dialogEl.open) {
      dialogEl.close();
    }
  }, [open, cls?.id]);

  if (!cls) {
    return (
      <dialog
        ref={dialogRef}
        className="m-auto max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-paper p-6"
      >
        <div />
      </dialog>
    );
  }

  function validate(currentClass: CraftClass): FormErrors {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "이름을 입력해 주세요.";
    }

    const trimmedContact = form.contact.trim();
    if (!trimmedContact) {
      nextErrors.contact = "연락처를 입력해 주세요.";
    } else if (!PHONE_PATTERN.test(trimmedContact)) {
      nextErrors.contact = "올바른 연락처 형식이 아닙니다. 예: 010-1234-5678";
    }

    if (!form.preferredDate) {
      nextErrors.preferredDate = "희망 날짜를 선택해 주세요.";
    } else if (form.preferredDate < min) {
      nextErrors.preferredDate = "과거 날짜는 선택할 수 없습니다.";
    }

    const countValue = Number(form.participantCount);
    if (!form.participantCount.trim() || !Number.isInteger(countValue)) {
      nextErrors.participantCount = "인원을 입력해 주세요.";
    } else if (countValue < 1 || countValue > currentClass.maxCapacity) {
      nextErrors.participantCount = `인원은 1명 이상 ${currentClass.maxCapacity}명 이하로 입력해 주세요.`;
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending" || !cls) return;

    const nextErrors = validate(cls);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus("pending");
    setResult(null);
    try {
      const apiResult = await submitClassApplication({
        name: form.name.trim(),
        contact: form.contact.trim(),
        classId: cls.id,
        preferredDate: form.preferredDate,
        participantCount: Number(form.participantCount),
        request: form.request.trim(),
      });
      setResult(apiResult);
    } finally {
      setStatus("done");
    }
  }

  function handleDialogClose() {
    onClose();
  }

  function handleCloseButtonClick() {
    dialogRef.current?.close();
  }

  const isPending = status === "pending";

  return (
    <dialog
      ref={dialogRef}
      onClose={handleDialogClose}
      onCancel={handleDialogClose}
      className="m-auto max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-paper p-0 backdrop:bg-ink/40"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-lg font-bold text-ink-point">
            {cls.name} 신청
          </h2>
          <button
            type="button"
            onClick={handleCloseButtonClick}
            aria-label="닫기"
            className="text-ink-soft hover:text-ink"
          >
            ✕
          </button>
        </div>

        <PracticeNotice variant="inline" />

        <div className="flex flex-col gap-1">
          <label htmlFor={nameId} className="text-sm font-medium text-ink">
            이름
          </label>
          <input
            ref={nameInputRef}
            id={nameId}
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            aria-invalid={errors.name ? "true" : undefined}
            className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink"
          />
          {errors.name && (
            <p role="alert" aria-live="polite" className="text-sm text-red-700">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={contactId} className="text-sm font-medium text-ink">
            연락처
          </label>
          <input
            id={contactId}
            type="text"
            required
            value={form.contact}
            onChange={(e) =>
              setForm((f) => ({ ...f, contact: e.target.value }))
            }
            aria-invalid={errors.contact ? "true" : undefined}
            aria-describedby={errors.contact ? contactErrorId : undefined}
            placeholder="010-1234-5678"
            className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink"
          />
          {errors.contact && (
            <p
              id={contactErrorId}
              role="alert"
              aria-live="polite"
              className="text-sm text-red-700"
            >
              {errors.contact}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={classId} className="text-sm font-medium text-ink">
            클래스
          </label>
          <input
            id={classId}
            type="text"
            readOnly
            value={cls.name}
            className="rounded-md border border-border bg-paper-raised px-3 py-2 text-sm text-ink-soft"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={dateId} className="text-sm font-medium text-ink">
            희망 날짜
          </label>
          <input
            id={dateId}
            type="date"
            required
            min={min}
            value={form.preferredDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, preferredDate: e.target.value }))
            }
            aria-invalid={errors.preferredDate ? "true" : undefined}
            aria-describedby={errors.preferredDate ? dateErrorId : undefined}
            className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink"
          />
          {errors.preferredDate && (
            <p
              id={dateErrorId}
              role="alert"
              aria-live="polite"
              className="text-sm text-red-700"
            >
              {errors.preferredDate}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={countId} className="text-sm font-medium text-ink">
            인원
          </label>
          <input
            id={countId}
            type="number"
            required
            min={1}
            max={cls.maxCapacity}
            step={1}
            value={form.participantCount}
            onChange={(e) =>
              setForm((f) => ({ ...f, participantCount: e.target.value }))
            }
            aria-invalid={errors.participantCount ? "true" : undefined}
            aria-describedby={countErrorId}
            className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink"
          />
          <p id={countErrorId} aria-live="polite" className="text-sm">
            {errors.participantCount ? (
              <span role="alert" className="text-red-700">
                {errors.participantCount}
              </span>
            ) : (
              <span className="text-ink-soft">
                최대 {cls.maxCapacity}명까지 신청 가능합니다.
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={requestId} className="text-sm font-medium text-ink">
            요청사항
          </label>
          <textarea
            id={requestId}
            value={form.request}
            onChange={(e) =>
              setForm((f) => ({ ...f, request: e.target.value }))
            }
            rows={3}
            className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink"
          />
        </div>

        {result && (
          <p
            role="status"
            aria-live="polite"
            className={
              result.success
                ? "rounded-md bg-paper-raised p-3 text-sm text-ink"
                : "rounded-md bg-paper-raised p-3 text-sm text-red-700"
            }
          >
            {result.success
              ? `${result.message} (접수번호: ${result.receiptNumber})`
              : result.message}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCloseButtonClick}
            className="rounded-md border border-border px-4 py-2 text-sm text-ink-soft"
          >
            닫기
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-ink-point px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "전송 중..." : "신청 제출"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
