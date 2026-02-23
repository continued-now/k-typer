import { ContentPack, db } from './index';

const SEED_PACKS: ContentPack[] = [
    {
        id: 'beginner-daily',
        title: '일상 대화 (초급)',
        level: 'beginner',
        topic: 'daily',
        tags: ['daily', 'basic'],
        sentences: [
            '안녕하세요. 반갑습니다.',
            '오늘 날씨가 참 좋네요.',
            '점심 식사는 하셨나요?',
            '저는 한국어를 공부하고 있어요.',
            '주말에 무엇을 하실 건가요?',
            '커피 한 잔 주세요.',
            '지하철역이 어디에 있나요?',
            '이 책은 정말 재미있어요.',
            '감기에 걸려서 병원에 갔어요.',
            '내일은 친구를 만날 거예요.'
        ]
    },
    {
        id: 'intermediate-business',
        title: '비즈니스 회화 (중급)',
        level: 'intermediate',
        topic: 'business',
        tags: ['business', 'formal'],
        sentences: [
            '회의 일정을 확인해 주시기 바랍니다.',
            '이번 프로젝트의 마감일은 다음 주 금요일입니다.',
            '제안서를 검토한 후 피드백을 드리겠습니다.',
            '거래처와 미팅이 예정되어 있습니다.',
            '업무 효율을 높이기 위한 방안을 모색해야 합니다.',
            '결재 서류를 올렸으니 확인 부탁드립니다.',
            '신제품 출시 행사가 성공적으로 마무리되었습니다.',
            '고객 만족도 조사를 실시할 예정입니다.',
            '예산안을 수정하여 다시 제출하겠습니다.',
            '팀원들과 협력하여 목표를 달성합시다.'
        ]
    },
    {
        id: 'advanced-news',
        title: '뉴스 기사 (고급)',
        level: 'advanced',
        topic: 'news',
        tags: ['news', 'economy', 'society'],
        sentences: [
            '정부는 경제 활성화를 위한 새로운 정책을 발표했습니다.',
            '기후 변화로 인한 자연재해가 전 세계적으로 증가하고 있습니다.',
            '인공지능 기술의 발전이 산업 전반에 큰 영향을 미치고 있습니다.',
            '주식 시장이 연일 상승세를 기록하며 최고치를 경신했습니다.',
            '교육 격차 해소를 위한 다양한 지원 프로그램이 마련되어야 합니다.',
            '국제 유가 상승이 국내 물가에 불안 요인으로 작용하고 있습니다.',
            '문화 예술 분야에 대한 투자가 확대될 전망입니다.',
            '저출산 고령화 문제는 우리 사회가 해결해야 할 시급한 과제입니다.',
            '친환경 에너지 개발을 위한 연구가 활발히 진행되고 있습니다.',
            '우주 탐사 프로젝트가 새로운 국면을 맞이하고 있습니다.'
        ]
    }
];

export async function seedContent() {
    const existing = await db.getAllContentPacks();
    if (existing.length === 0) {
        for (const pack of SEED_PACKS) {
            await db.saveContentPack(pack);
        }
        console.log('Seeded content packs');
    }
}
