import type { CraftClass } from "@/src/types";

export const classes: CraftClass[] = [
  {
    id: "class-ceramics",
    name: "도자기 만들기",
    description:
      "물레 성형부터 유약 바르기까지, 나만의 그릇을 처음부터 끝까지 빚어보는 체험 클래스입니다.",
    price: 55000,
    durationMinutes: 120,
    maxCapacity: 8,
    imageSrc: "/images/classes/ceramics.svg",
    imageAlt: "물레 위에서 도자기를 빚는 손 모양 일러스트",
  },
  {
    id: "class-bojagi",
    name: "보자기 만들기",
    description:
      "전통 조각보 기법으로 나만의 보자기를 만들며 천 조각을 잇는 바느질의 매력을 느껴보세요.",
    price: 38000,
    durationMinutes: 90,
    maxCapacity: 10,
    imageSrc: "/images/classes/bojagi.svg",
    imageAlt: "알록달록한 조각 천으로 만든 보자기 일러스트",
  },
  {
    id: "class-woodcraft",
    name: "목공예 소품 만들기",
    description:
      "원목을 다듬고 사포질하여 생활 속에서 쓸 수 있는 작은 소품을 완성하는 목공예 클래스입니다.",
    price: 42000,
    durationMinutes: 150,
    maxCapacity: 6,
    imageSrc: "/images/classes/woodcraft.svg",
    imageAlt: "나무 소품과 대패, 사포 도구 일러스트",
  },
  {
    id: "class-najeon",
    name: "나전칠기 소품 만들기",
    description:
      "자개 조각을 붙이고 옻칠로 마무리하며 전통 나전칠기 기법을 간단한 소품으로 배워보는 클래스입니다.",
    price: 65000,
    durationMinutes: 180,
    maxCapacity: 6,
    imageSrc: "/images/classes/najeon.svg",
    imageAlt: "자개 조각이 박힌 나전칠기 소품 일러스트",
  },
];
