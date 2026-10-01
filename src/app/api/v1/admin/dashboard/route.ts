import { NextResponse } from 'next/server';
import { initialAnalytics, initialCourses, initialLearners, activityTrend7Days } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      stats: initialAnalytics,
      recentLearners: initialLearners.slice(0, 5),
      courses: initialCourses,
      activity: activityTrend7Days,
    },
  });
}
