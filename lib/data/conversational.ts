// 50+ everyday Korean conversational phrases by situation
export const CONVERSATIONAL: {
  situation: string;
  phrases: string[];
}[] = [
  {
    situation: "인사 (Greetings)",
    phrases: [
      "안녕하세요 오랜만이에요",
      "잘 지내셨어요",
      "처음 뵙겠습니다",
      "만나서 반갑습니다",
      "안녕히 가세요"
    ]
  },
  {
    situation: "식당 (Restaurant)",
    phrases: [
      "여기 메뉴판 좀 주세요",
      "추천 메뉴가 뭐예요",
      "매운 거 빼 주세요",
      "계산서 좀 주세요",
      "포장해 주세요",
      "여기 물 좀 더 주세요",
      "이 음식은 얼마나 걸려요"
    ]
  },
  {
    situation: "교통 (Transportation)",
    phrases: [
      "이 버스가 서울역에 가나요",
      "다음 역에서 내려야 해요",
      "택시 좀 불러 주세요",
      "지하철 몇 호선을 타야 해요",
      "여기서 공항까지 얼마나 걸려요",
      "편도 표 한 장 주세요"
    ]
  },
  {
    situation: "쇼핑 (Shopping)",
    phrases: [
      "이거 얼마예요",
      "좀 깎아 주세요",
      "다른 색깔 있어요",
      "카드 결제 되나요",
      "교환하고 싶어요",
      "영수증 좀 주세요",
      "사이즈가 안 맞아요"
    ]
  },
  {
    situation: "병원 (Hospital)",
    phrases: [
      "예약을 하고 싶은데요",
      "어디가 아프세요",
      "머리가 아프고 열이 나요",
      "약은 하루에 세 번 드세요",
      "보험증 가져오셨어요",
      "검사 결과가 나왔어요"
    ]
  },
  {
    situation: "직장 (Workplace)",
    phrases: [
      "회의 시간이 변경되었습니다",
      "보고서를 내일까지 제출해 주세요",
      "점심 같이 드실래요",
      "오늘 야근해야 할 것 같아요",
      "휴가를 신청하고 싶습니다",
      "이 건에 대해 의견이 있으신가요"
    ]
  },
  {
    situation: "전화 (Phone)",
    phrases: [
      "여보세요 거기 누구세요",
      "잠시만 기다려 주세요",
      "다시 한번 말씀해 주세요",
      "전화 잘못 거셨어요",
      "나중에 다시 전화하겠습니다",
      "문자 보내 드릴게요"
    ]
  },
  {
    situation: "날씨 (Weather)",
    phrases: [
      "오늘 날씨가 정말 좋네요",
      "내일 비가 온다고 해요",
      "요즘 너무 덥지 않아요",
      "우산 가져가는 게 좋겠어요",
      "바람이 세게 불어요"
    ]
  }
];

// Flat array of all conversational phrases for typing practice
export const ALL_CONVERSATIONAL_PHRASES: string[] = CONVERSATIONAL.flatMap(c => c.phrases);
