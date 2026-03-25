import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

export const runtime = "nodejs";

function runFfmpeg(args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const process = spawn("ffmpeg", args, {
      stdio: ["ignore", "ignore", "pipe"],
    });

    let stderr = "";

    process.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    process.on("error", reject);
    process.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(stderr || `ffmpeg exited with code ${code}`));
    });
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("video");

  if (!(file instanceof File)) {
    return Response.json({ error: "Missing video file." }, { status: 400 });
  }

  const id = randomUUID();
  const inputPath = join(tmpdir(), `${id}.webm`);
  const outputPath = join(tmpdir(), `${id}.mp4`);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);

    await runFfmpeg([
      "-y",
      "-i",
      inputPath,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outputPath,
    ]);

    const output = await fs.readFile(outputPath);

    return new Response(output, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="whatsapp-conversation.mp4"',
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Video conversion failed." }, { status: 500 });
  } finally {
    await Promise.allSettled([fs.unlink(inputPath), fs.unlink(outputPath)]);
  }
}
