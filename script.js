function muatData() {
  try {
    return JSON.parse(localStorage.getItem("pisahuang")) || [];
  } catch (error) {
    return [];
  }
}

function simpanData() {
  localStorage.setItem("pisahuang", JSON.stringify(data));
}

let data = muatData();

const form = document.querySelector("#form-transaksi");
const daftar = document.querySelector("#daftar");

// W2: tampilkan daftar (terbaru di atas, format Rupiah)
function renderDaftar() {
  daftar.innerHTML = "";
  const urut = [...data].sort((a, b) => b.id - a.id);

  urut.forEach((t) => {
    const li = document.createElement("li");

    const info = document.createElement("span");
    const catatan = t.catatan ? " · " + t.catatan : "";
    info.textContent = t.tanggal + " · " + t.kategori + " · " + t.dompet + catatan;

    const nominal = document.createElement("strong");
    nominal.className = t.jenis;
    const tanda = t.jenis === "pemasukan" ? "+" : "-";
    nominal.textContent = tanda + "Rp " + t.nominal.toLocaleString("id-ID");

    const tombol = document.createElement("button");
    tombol.type = "button";
    tombol.textContent = "Hapus";
    tombol.dataset.id = t.id;

    li.append(info, nominal, tombol);
    daftar.appendChild(li);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const f = form.elements;

  data.push({
    id: Date.now(),
    tanggal: f.tanggal.value,
    jenis: f.jenis.value,
    dompet: f.dompet.value,
    kategori: f.kategori.value,
    nominal: Number(f.nominal.value),
    catatan: f.catatan.value.trim(),
  });

  simpanData();
  renderDaftar();
  form.reset();
});

daftar.addEventListener("click", (event) => {
  const tombol = event.target.closest("button");
  if (!tombol) return;
  if (!confirm("Hapus transaksi ini?")) return;

  data = data.filter((t) => t.id !== Number(tombol.dataset.id));
  simpanData();
  renderDaftar();
});

renderDaftar();