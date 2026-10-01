"use client";

import { useRef, useState } from "react";
import { crafts } from "@/src/mocks/crafts";
import type { Craft } from "@/src/types";
import CraftCard from "@/src/components/craft/CraftCard";
import OrderInquiryDialog from "@/src/components/craft/OrderInquiryDialog";

export default function CraftsPanel() {
  const [selectedCraft, setSelectedCraft] = useState<Craft | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLElement | null>(null);

  function handleOrderClick(craft: Craft) {
    // Capture the button that triggered this click so focus can be
    // restored to it when the dialog closes (see the focus-restoration
    // contract documented in OrderInquiryDialog.tsx).
    triggerButtonRef.current = document.activeElement as HTMLElement | null;
    setSelectedCraft(craft);
    setIsDialogOpen(true);
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
    triggerButtonRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
        모든 작품은 장인이 수작업으로 제작하며, 주문 후 제작 기간은 영업일
        기준 7~14일입니다. 배송은 전국 택배로 안내해 드립니다. (실습용 가상
        안내입니다)
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {crafts.map((craft) => (
          <CraftCard
            key={craft.id}
            craft={craft}
            onOrderClick={handleOrderClick}
          />
        ))}
      </div>

      <OrderInquiryDialog
        craft={selectedCraft}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
    </div>
  );
}
