import Replicate from "replicate";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL =
  "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";

function isImage(file: File) {
  return file.type.startsWith("image/");
}

export async function POST(request: Request) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return Response.json(
        { error: "REPLICATE_API_TOKEN belum dipasang di Vercel." },
        { status: 500 }
      );
    }

    const form = await request.formData();
    const human = form.get("human");
    const garment = form.get("garment");
    const description = String(form.get("description") || "casual clothing");
    const category = String(form.get("category") || "upper_body");

    if (!(human instanceof File) || !(garment instanceof File)) {
      return Response.json({ error: "Foto orang dan pakaian wajib diupload." }, { status: 400 });
    }

    if (!isImage(human) || !isImage(garment)) {
      return Response.json({ error: "File harus berupa gambar." }, { status: 400 });
    }

    if (human.size > 7 * 1024 * 1024 || garment.size > 7 * 1024 * 1024) {
      return Response.json({ error: "Ukuran setiap gambar maksimal 7 MB." }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN
    });

    const humanBuffer = Buffer.from(await human.arrayBuffer());
    const garmentBuffer = Buffer.from(await garment.arrayBuffer());

    const output = await replicate.run(MODEL, {
      input: {
        human_img: humanBuffer,
        garm_img: garmentBuffer,
        garment_des: description.slice(0, 300),
        category,
        crop: true,
        steps: 30,
        seed: Math.floor(Math.random() * 1000000)
      }
    });

    const url =
      typeof output === "string"
        ? output
        : output && typeof (output as { url?: () => string }).url === "function"
          ? (output as { url: () => string }).url()
          : String(output);

    return Response.json({ url });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: error instanceof Error ? error.message : "AI gagal memproses gambar." },
      { status: 500 }
    );
  }
}