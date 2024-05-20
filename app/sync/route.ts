import { NextResponse } from "next/server";
import axios from "axios";

// To handle a GET request to /api
export async function GET() {
  try {
    const rssText = await axios.get(
      "https://www.goodreads.com/review/list_rss/87975662?key=wGWAksug_4259__QFBUCwZBbK9dwUzAkVPkeDAOZPEKXy6mn&shelf=to-read"
    );

    return NextResponse.json(rssText.data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
