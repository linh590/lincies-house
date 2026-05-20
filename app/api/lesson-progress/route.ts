import { NextResponse } from "next/server";
import { courseLessons } from "../../courseData";
import { getActiveStudent } from "../../lib/supabase/access";
import { createServiceClient } from "../../lib/supabase/admin";

const PROGRESS_METADATA_KEY = "linciesHouseCompletedLessons";
const validPlaybackIds = new Set(courseLessons.map((lesson) => lesson.playbackId));

type ProgressMetadata = {
  [PROGRESS_METADATA_KEY]?: unknown;
};

function normalizeCompletedIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .filter((playbackId) => validPlaybackIds.has(playbackId)),
    ),
  );
}

async function getUserProgress(userId: string) {
  const supabaseAdmin = createServiceClient();
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error) {
    throw error;
  }

  const metadata = (data.user?.app_metadata ?? {}) as ProgressMetadata;
  return normalizeCompletedIds(metadata[PROGRESS_METADATA_KEY]);
}

export async function GET() {
  const access = await getActiveStudent();

  if (!access) {
    return NextResponse.json({ completedIds: [] }, { status: 401 });
  }

  try {
    const completedIds = await getUserProgress(access.user.id);
    return NextResponse.json({ completedIds });
  } catch (error) {
    console.error("Unable to load lesson progress", error);
    return NextResponse.json({ completedIds: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const access = await getActiveStudent();

  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { completedIds?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const completedIds = normalizeCompletedIds(body.completedIds);

  try {
    const supabaseAdmin = createServiceClient();
    const existingMetadata = (access.user.app_metadata ?? {}) as Record<string, unknown>;
    const { error } = await supabaseAdmin.auth.admin.updateUserById(access.user.id, {
      app_metadata: {
        ...existingMetadata,
        [PROGRESS_METADATA_KEY]: completedIds,
      },
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ completedIds });
  } catch (error) {
    console.error("Unable to save lesson progress", error);
    return NextResponse.json({ error: "Unable to save lesson progress" }, { status: 500 });
  }
}
