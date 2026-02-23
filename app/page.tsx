import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Keyboard, TrendingUp, Target, BookOpen, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">K-Type Coach</h1>
          </div>
          <nav className="flex gap-2">
            <Link href="/practice">
              <Button variant="ghost" size="sm">연습하기</Button>
            </Link>
            <Link href="/results">
              <Button variant="ghost" size="sm">통계</Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm">설정</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-foreground">
            한글 타이핑 코치
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            매일 10분으로 정확도와 속도 업
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/practice">
              <Button size="lg" className="text-lg px-8">
                빠른 연습 시작
              </Button>
            </Link>
            <Link href="/drills">
              <Button size="lg" variant="outline" className="text-lg px-8">
                맞춤 드릴
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Keyboard className="h-10 w-10 text-primary mb-2" />
              <CardTitle>다양한 콘텐츠</CardTitle>
              <CardDescription>
                자주 쓰는 단어 100/1000, 애국가, 속담, 뉴스 등
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                10가지 이상의 콘텐츠 팩으로 체계적인 학습
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-2" />
              <CardTitle>정확도 분석</CardTitle>
              <CardDescription>
                자모 혼동, 받침 오타, 띄어쓰기 오류 분석
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                오류 유형별 상세 피드백 제공
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>맞춤 드릴</CardTitle>
              <CardDescription>
                개인 오류 패턴 기반 집중 훈련
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                약점을 보완하는 맞춤형 연습 추천
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {[
            { icon: BookOpen, title: "자주 쓰는 단어 100", desc: "기본 단어부터 시작" },
            { icon: Globe, title: "애국가", desc: "국가 전문 타이핑" },
            { icon: Zap, title: "잰말 놀이", desc: "속도와 정확도 도전" },
            { icon: BookOpen, title: "속담 모음", desc: "55개 한국 속담" },
            { icon: Globe, title: "뉴스 기사", desc: "실전 문장 연습" },
            { icon: Zap, title: "기술 용어", desc: "IT 용어 타이핑" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <Icon className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>지금 바로 시작해보세요</CardTitle>
            <CardDescription>
              로그인 없이 바로 연습할 수 있습니다. 모든 데이터는 브라우저에 안전하게 저장됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/practice">
              <Button className="w-full" size="lg">
                연습 시작하기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>K-Type Coach. 한글 타이핑 마스터를 위한 최고의 도구.</p>
        </div>
      </footer>
    </div>
  );
}
