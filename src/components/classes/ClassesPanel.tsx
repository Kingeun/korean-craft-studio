"use client";

import { useRef, useState } from "react";
import ClassApplicationDialog from "@/src/components/classes/ClassApplicationDialog";
import ClassCard from "@/src/components/classes/ClassCard";
import { classes } from "@/src/mocks/classes";
import type { CraftClass } from "@/src/types";

export default function ClassesPanel() {
  const [selectedClass, setSelectedClass] = useState<CraftClass | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  function handleApplyClick(cls: CraftClass, triggerButton: HTMLButtonElement) {
    triggerButtonRef.current = triggerButton;
    setSelectedClass(cls);
    setIsDialogOpen(true);
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
    triggerButtonRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-ink-soft">
        준비물은 공방에서 모두 제공합니다. 수강 변경·취소는 클래스 시작 3일
        전까지 가능합니다. (실습용 가상 안내)
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <ClassCard key={cls.id} cls={cls} onApplyClick={handleApplyClick} />
        ))}
      </div>

      <ClassApplicationDialog
        cls={selectedClass}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
    </div>
  );
}
