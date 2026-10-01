import type { CraftClass } from "@/src/types";

type ClassCardProps = {
  cls: CraftClass;
  /**
   * Called with the class and the button element that triggered the click,
   * so the caller can store it and restore focus to it when the dialog closes.
   */
  onApplyClick: (cls: CraftClass, triggerButton: HTMLButtonElement) => void;
};

function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

function formatDuration(minutes: number): string {
  if (minutes % 60 === 0) {
    return `${minutes / 60}시간`;
  }
  if (minutes < 60) {
    return `${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}시간 ${rest}분`;
}

export default function ClassCard({ cls, onApplyClick }: ClassCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-paper">
      <img
        src={cls.imageSrc}
        alt={cls.imageAlt}
        className="h-40 w-full object-cover sm:h-48"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-serif text-lg font-bold text-ink-point">
          {cls.name}
        </h3>
        <p className="flex-1 text-sm text-ink-soft">{cls.description}</p>
        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink">
          <div className="flex gap-1">
            <dt className="text-ink-soft">가격</dt>
            <dd>{formatPrice(cls.price)}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="text-ink-soft">소요 시간</dt>
            <dd>{formatDuration(cls.durationMinutes)}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="text-ink-soft">정원</dt>
            <dd>정원 {cls.maxCapacity}명</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={(event) => onApplyClick(cls, event.currentTarget)}
          className="mt-2 w-full rounded-md bg-ink-point px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90"
        >
          신청하기
        </button>
      </div>
    </div>
  );
}
