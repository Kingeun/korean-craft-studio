import type {
  ClassApplication,
  MockApiResult,
  OrderInquiry,
} from "@/src/types";

const MOCK_DELAY_MS = 700;
const MOCK_FAILURE_CONTACT_DIGITS = "01000000000";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function generateReceiptNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const suffix = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `ONG-${year}${month}${day}-${suffix}`;
}

function buildResult(): MockApiResult {
  return {
    success: true,
    receiptNumber: generateReceiptNumber(),
    message: "접수가 완료되었습니다. (실습용 가짜 접수번호입니다)",
  };
}

const MOCK_FAILURE_RESULT: MockApiResult = {
  success: false,
  message:
    "실습용 Mock 오류입니다: 연락처 010-0000-0000은 실패 상황을 반복 테스트하기 위한 예시 번호입니다.",
};

function resolveMockResult(contact: string): MockApiResult {
  return onlyDigits(contact) === MOCK_FAILURE_CONTACT_DIGITS
    ? MOCK_FAILURE_RESULT
    : buildResult();
}

export async function submitOrderInquiry(
  input: OrderInquiry,
): Promise<MockApiResult> {
  await delay(MOCK_DELAY_MS);
  return resolveMockResult(input.contact);
}

export async function submitClassApplication(
  input: ClassApplication,
): Promise<MockApiResult> {
  await delay(MOCK_DELAY_MS);
  return resolveMockResult(input.contact);
}
