 "use client";

import { ChangeEvent, useEffect, useState } from "react";

type Preview = { file: File; url: string };

export default function Home() {
  const [person, setPerson] = useState<Preview | null>(null);
  const [garment, setGarment] = useState<Preview | null>(null);
  const [description, setDescription] = useState("modern casual shirt");
  const [category, setCategory] = useState("upper_body");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (person) URL.revokeObjectURL(person.url);
      if (garment) URL.revokeObjectURL(garment.url);
    };
  }, [person, garment]);

  function pick(
    e: ChangeEvent<HTMLInputElement>,
    setter: (v: Preview | null) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    if (file.size > 7 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 7 MB.");
      return;
    }
    setError("");
    setter({ file, url: URL.createObjectURL(file) });
  }

  async function generate() {
    if (!person || !garment) {
      setError("Upload foto orang dan foto pakaian terlebih dahulu.");
      return;
    }

    setBusy(true);
    setError("");
    setResult("");

    try {
      const form = new FormData();
      form.append("human", person.file);
      form.append("garment", garment.file);
      form.append("description", description);
      form.append("category", category);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: form
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat gambar.");
      setResult(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">✦ AI VIRTUAL TRY-ON</div>
        <h1>Try clothes on<br /><span>with AI</span></h1>
        <p>Upload foto full-body dan foto pakaian. AI akan mempertahankan pose serta wajah dan mencoba pakaian tersebut pada foto.</p>
      </section>

      <section className="card">
        <div className="step">
          <div className="stepNo">1</div>
          <div>
            <h2>Upload foto full-body</h2>
            <p>Gunakan foto yang jelas, menghadap kamera, dan tubuh terlihat.</p>
          </div>
        </div>

        <label className="upload">
          <input type="file" accept="image/*" onChange={(e) => pick(e, setPerson)} />
          {person ? (
            <img src={person.url} alt="Foto pengguna" />
          ) : (
            <>
              <div className="uploadIcon">＋</div>
              <strong>Upload foto orang</strong>
              <span>JPG, PNG — maksimal 7 MB</span>
            </>
          )}
        </label>

        <div className="step">
          <div className="stepNo">2</div>
          <div>
            <h2>Upload foto pakaian</h2>
            <p>Foto produk/garment sebaiknya jelas dan tidak terlalu ramai.</p>
          </div>
        </div>

        <label className="upload garment">
          <input type="file" accept="image/*" onChange={(e) => pick(e, setGarment)} />
          {garment ? (
            <img src={garment.url} alt="Foto pakaian" />
          ) : (
            <>
              <div className="uploadIcon">👕</div>
              <strong>Upload foto pakaian</strong>
              <span>Contoh: kaos, kemeja, jaket, dress, celana</span>
            </>
          )}
        </label>

        <div className="options">
          <label>
            Jenis pakaian
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="upper_body">Atasan</option>
              <option value="lower_body">Bawahan</option>
              <option value="dresses">Dress</option>
            </select>
          </label>

          <label>
            Deskripsi pakaian
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="contoh: white oversized t-shirt"
            />
          </label>
        </div>

        <button className="generate" onClick={generate} disabled={busy}>
          {busy ? "⏳ Sedang membuat..." : "✨ Generate Try-On"}
        </button>

        {error && <div className="error">{error}</div>}
      </section>

      {result && (
        <section className="result card">
          <div className="step">
            <div className="stepNo">3</div>
            <div>
              <h2>Hasil AI</h2>
              <p>Periksa hasil sebelum menyimpan atau membagikannya.</p>
            </div>
          </div>
          <img className="resultImage" src={result} alt="Hasil virtual try-on" />
          <a className="download" href={result} target="_blank" rel="noreferrer">
            Buka / simpan hasil
          </a>
        </section>
      )}

      <footer>
        Virtual Try-On AI • Gunakan hanya foto yang Anda miliki atau Anda berhak menggunakannya.
      </footer>
    </main>
  );
}