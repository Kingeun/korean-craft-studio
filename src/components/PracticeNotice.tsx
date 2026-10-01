type PracticeNoticeProps = {
  variant: "banner" | "inline";
};

const NOTICE_TEXT =
  "이 사이트는 실습용 프로토타입입니다. 입력한 정보는 저장되거나 전송되지 않으므로 실제 개인정보를 입력하지 마세요.";

export default function PracticeNotice({ variant }: PracticeNoticeProps) {
  if (variant === "inline") {
    return (
      <p className="text-sm text-ink-soft border-l-2 border-border pl-3 py-1">
        {NOTICE_TEXT}
      </p>
    );
  }

  return (
    <div className="w-full bg-paper-raised border-b border-border">
      <p className="mx-auto max-w-5xl px-4 py-2 text-center text-sm text-ink-soft sm:px-6">
        {NOTICE_TEXT}
      </p>
    </div>
  );
}

export { PracticeNotice };
