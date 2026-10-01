import type { Craft } from "@/src/types";

type CraftCardProps = {
  craft: Craft;
  onOrderClick: (craft: Craft) => void;
};

function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

export default function CraftCard({ craft, onOrderClick }: CraftCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-paper">
      <img
        src={craft.imageSrc}
        alt={craft.imageAlt}
        className="h-48 w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="w-fit rounded-full bg-paper-raised px-2.5 py-0.5 text-xs font-medium text-ink-soft">
          {craft.craftType}
        </span>
        <h3 className="font-serif text-lg font-bold text-ink-point">
          {craft.name}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-ink-soft">
          {craft.description}
        </p>
        <p className="text-base font-semibold text-ink-point">
          {formatPrice(craft.price)}
        </p>
        <button
          type="button"
          onClick={() => onOrderClick(craft)}
          className="mt-2 w-full rounded-md bg-ink-point px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90"
        >
          주문 문의하기
        </button>
      </div>
    </div>
  );
}
