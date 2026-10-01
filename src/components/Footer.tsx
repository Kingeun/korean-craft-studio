const FAKE_INFO_LABEL = "실습용 가상 정보";

export default function Footer() {
  return (
    <footer className="w-full bg-paper-raised border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <dl className="space-y-3 text-sm text-ink-soft">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
            <dt className="shrink-0 font-medium text-ink">
              <span className="mr-1 inline-block rounded-sm bg-border px-1.5 py-0.5 text-xs text-ink-point">
                {FAKE_INFO_LABEL}
              </span>
              주소
            </dt>
            <dd>서울특별시 종로구 한지길 12 온결 공방 1층 (가상 주소)</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
            <dt className="shrink-0 font-medium text-ink">
              <span className="mr-1 inline-block rounded-sm bg-border px-1.5 py-0.5 text-xs text-ink-point">
                {FAKE_INFO_LABEL}
              </span>
              운영시간
            </dt>
            <dd>매일 10:00 - 18:00 (연중무휴, 가상 운영시간)</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
            <dt className="shrink-0 font-medium text-ink">
              <span className="mr-1 inline-block rounded-sm bg-border px-1.5 py-0.5 text-xs text-ink-point">
                {FAKE_INFO_LABEL}
              </span>
              문의처
            </dt>
            <dd>02-0000-0000 / hello@ongyeol-gongbang.example (가상 연락처)</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-ink-soft">
          © 2026 온결 공방. 본 사이트의 모든 정보는 실습용 프로토타입을 위해
          만들어진 가상의 데이터입니다.
        </p>
      </div>
    </footer>
  );
}
