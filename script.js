function muatData() {
  try {
    const hasil = JSON.parse(localStorage.getItem("pisahuang"));
    return Array.isArray(hasil) ? hasil : [];
  } catch (error) {
    return [];
  }
}

function simpanData() {
  localStorage.setItem("pisahuang", JSON.stringify(data));
}

let data = muatData();

const form = document.querySelector("#form-transaksi");
const formPindah = document.querySelector("#form-pindah");
const pesan = document.querySelector("#pesan");
const pesanPindah = document.querySelector("#pesan-pindah");
const daftar = document.querySelector("#daftar");

function rupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

function hariIni() {
  return new Date().toLocaleDateString("en-CA");
}

function hitungRingkasan() {
  let pemasukan = 0;
  let pengeluaran = 0;

  for (const t of data) {
    if (t.jenis === "pemasukan") pemasukan += t.nominal;
    if (t.jenis === "pengeluaran") pengeluaran += t.nominal;
  }

  return { pemasukan, pengeluaran, saldo: pemasukan - pengeluaran };
}

function hitungSaldoDompet(dompet) {
  let saldo = 0;

  for (const t of data) {
    if (t.jenis === "pemasukan" && t.dompet === dompet) saldo += t.nominal;
    if (t.jenis === "pengeluaran" && t.dompet === dompet) saldo -= t.nominal;
    if (t.jenis === "pindah" && t.dompet === dompet) saldo -= t.nominal;
    if (t.jenis === "pindah" && t.tujuan === dompet) saldo += t.nominal;
  }

  return saldo;
}

function renderRingkasan() {
  const r = hitungRingkasan();
  document.querySelector("#saldo").textContent = rupiah(r.saldo);
  document.querySelector("#total-masuk").textContent = rupiah(r.pemasukan);
  document.querySelector("#total-keluar").textContent = rupiah(r.pengeluaran);
  document.querySelector("#saldo-pribadi").textContent = rupiah(hitungSaldoDompet("Pribadi"));
  document.querySelector("#saldo-usaha").textContent = rupiah(hitungSaldoDompet("Usaha"));
}

function renderDaftar() {
  daftar.innerHTML = "";

  const urut = [...data].sort(
    (a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id
  );

  urut.forEach((t) => {
    const li = document.createElement("li");
    const catatan = t.catatan ? " · " + t.catatan : "";

    const info = document.createElement("span");
    const nominal = document.createElement("strong");

    if (t.jenis === "pindah") {
      info.textContent = t.tanggal + " · Pindah dana " + t.dompet + " → " + t.tujuan + catatan;
      nominal.textContent = rupiah(t.nominal);
    } else {
      info.textContent = t.tanggal + " · " + t.kategori + " · " + t.dompet + catatan;
      nominal.className = t.jenis;
      const tanda = t.jenis === "pemasukan" ? "+" : "-";
      nominal.textContent = tanda + rupiah(t.nominal);
    }

    const tombol = document.createElement("button");
    tombol.type = "button";
    tombol.textContent = "Hapus";
    tombol.dataset.id = t.id;

    li.append(info, nominal, tombol);
    daftar.appendChild(li);
  });
}

function render() {
  renderDaftar();
  renderRingkasan();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const f = form.elements;
  const nominal = Number(f.nominal.value);

  if (f.tanggal.value === "") {
    pesan.textContent = "Tanggal wajib diisi.";
    return;
  }
  if (!(nominal > 0) || !Number.isInteger(nominal)) {
    pesan.textContent = "Nominal harus bilangan bulat lebih dari 0.";
    return;
  }
  pesan.textContent = "";

  data.push({
    id: Date.now(),
    tanggal: f.tanggal.value,
    jenis: f.jenis.value,
    dompet: f.dompet.value,
    kategori: f.kategori.value,
    nominal: nominal,
    catatan: f.catatan.value.trim(),
  });

  simpanData();
  render();
  form.reset();
  f.tanggal.value = hariIni();
});

formPindah.addEventListener("submit", (event) => {
  event.preventDefault();
  const f = formPindah.elements;
  const nominal = Number(f.nominal.value);

  if (f.tanggal.value === "") {
    pesanPindah.textContent = "Tanggal wajib diisi.";
    return;
  }
  if (f.dari.value === f.ke.value) {
    pesanPindah.textContent = "Dompet asal dan tujuan harus berbeda.";
    return;
  }
  if (!(nominal > 0) || !Number.isInteger(nominal)) {
    pesanPindah.textContent = "Nominal harus bilangan bulat lebih dari 0.";
    return;
  }
  pesanPindah.textContent = "";

  data.push({
    id: Date.now(),
    tanggal: f.tanggal.value,
    jenis: "pindah",
    dompet: f.dari.value,
    tujuan: f.ke.value,
    nominal: nominal,
    catatan: f.catatan.value.trim(),
  });

  simpanData();
  render();
  formPindah.reset();
  f.tanggal.value = hariIni();
});

daftar.addEventListener("click", (event) => {
  const tombol = event.target.closest("button");
  if (!tombol) return;
  if (!confirm("Hapus transaksi ini?")) return;

  data = data.filter((t) => t.id !== Number(tombol.dataset.id));
  simpanData();
  render();
});

form.elements.tanggal.value = hariIni();
formPindah.elements.tanggal.value = hariIni();
render();