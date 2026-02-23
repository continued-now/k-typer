import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScoreResult } from "@/types"
import { Activity, Target, Zap } from "lucide-react"

interface StatsWidgetsProps {
    result: ScoreResult;
}

export function StatsWidgets({ result }: StatsWidgetsProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">정확도 (Accuracy)</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{Math.round(result.accuracy * 100)}%</div>
                    <p className="text-xs text-muted-foreground">
                        오류 {result.errorCount}개
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">속도 (WPM)</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{result.wpm}</div>
                    <p className="text-xs text-muted-foreground">
                        타수 {result.cpm} CPM
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">진행률</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {result.totalChars > 0 ? Math.round((result.correctChars / result.totalChars) * 100) : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {result.correctChars} / {result.totalChars} 자
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
