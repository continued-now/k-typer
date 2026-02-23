// Korean National Anthem (애국가)
// Full lyrics with verses and chorus

export const ANTHEM_TITLE = "애국가";

export const ANTHEM_VERSES: string[][] = [
  [
    "동해 물과 백두산이 마르고 닳도록",
    "하느님이 보우하사 우리나라 만세"
  ],
  [
    "남산 위에 저 소나무 철갑을 두른 듯",
    "바람 서리 불변함은 우리 기상일세"
  ],
  [
    "가을 하늘 공활한데 높고 구름 없이",
    "밝은 달은 우리 가슴 일편단심일세"
  ],
  [
    "이 기상과 이 맘으로 충성을 다하여",
    "괴로우나 즐거우나 나라 사랑하세"
  ]
];

export const ANTHEM_CHORUS: string[] = [
  "무궁화 삼천리 화려 강산",
  "대한 사람 대한으로 길이 보전하세"
];

// All lines flattened for typing practice
export const ANTHEM_ALL_LINES: string[] = [
  ...ANTHEM_VERSES[0],
  ...ANTHEM_CHORUS,
  ...ANTHEM_VERSES[1],
  ...ANTHEM_CHORUS,
  ...ANTHEM_VERSES[2],
  ...ANTHEM_CHORUS,
  ...ANTHEM_VERSES[3],
  ...ANTHEM_CHORUS,
];
