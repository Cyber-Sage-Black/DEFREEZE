import { NextResponse } from 'next/server';
import { createAdminClient } from '@supabase/server/core';

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('topic_suggestions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching topic_suggestions:', error);
      return NextResponse.json([]);
    }

    const responses = (data || []).map((t) => {
      let stuckArea = 'Personal Growth & Habits';
      let biggestObstacle = 'Overthinking & self-doubt';
      let growthGoal = t.topic || '';
      let readinessScore = 9;

      if (t.topic?.includes('[Stuck:') && t.topic?.includes('Obstacle:')) {
        try {
          const parts = t.topic.split('|');
          const p1 = parts[0] || '';
          const p2 = parts[1] || '';
          stuckArea = p1.split('Obstacle:')[0].replace('[Stuck:', '').replace(']', '').trim();
          biggestObstacle = p1.split('Obstacle:')[1]?.trim() || biggestObstacle;

          if (p2.includes('Vision:')) {
            growthGoal = p2.split('Vision:')[1]?.split('(')[0]?.trim() || growthGoal;
          }
          if (p2.includes('Readiness:')) {
            const scoreMatch = p2.match(/Readiness:\s*(\d+)/i);
            if (scoreMatch) readinessScore = parseInt(scoreMatch[1], 10);
          }
        } catch {}
      } else if (t.topic?.startsWith('[Program Goal]')) {
        stuckArea = 'Program Learning Goal';
        growthGoal = t.topic.replace('[Program Goal]', '').trim();
        biggestObstacle = 'Awaiting immersion at event';
      } else if (t.topic?.startsWith('[Learning Goal]')) {
        stuckArea = 'Expectation / Goal';
        growthGoal = t.topic.replace('[Learning Goal]', '').trim();
        biggestObstacle = 'Awaiting immersion at event';
      }

      return {
        id: t.id,
        stuckArea,
        biggestObstacle,
        growthGoal,
        readinessScore,
        userName: t.participant_name || 'Youth Participant',
        userEmail: '',
        created_at: t.submitted_at || new Date().toISOString(),
      };
    });

    return NextResponse.json(responses);
  } catch (err: any) {
    console.error('Error in /api/youth-insights GET:', err);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const admin = createAdminClient();

    const topicText = `[Stuck: ${body.stuckArea}] Obstacle: ${body.biggestObstacle} | Vision: ${body.growthGoal} (Readiness: ${body.readinessScore}/10)`;

    const { data, error } = await admin
      .from('topic_suggestions')
      .insert({
        participant_name: body.userName || 'Youth Visitor',
        topic: topicText,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving to topic_suggestions:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        stuckArea: body.stuckArea,
        biggestObstacle: body.biggestObstacle,
        growthGoal: body.growthGoal,
        readinessScore: body.readinessScore,
        userName: data.participant_name,
        created_at: data.submitted_at,
      },
    });
  } catch (err: any) {
    console.error('Error in /api/youth-insights POST:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
