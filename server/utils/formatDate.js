// Format tanggal jadi gaya Indonesia yang ringkas: "14.04, 16 September 2026"
// (jam.menit, tanggal bulan tahun -- tanpa detik/milidetik/timezone).
// timeZone di-set eksplisit ke Asia/Jakarta supaya hasilnya konsisten WIB,
// apa pun timezone server tempat backend ini nanti di-deploy.
function formatTanggalIndo(date) {
  const d = new Date(date);
  const opsi = { timeZone: "Asia/Jakarta" };

  const jam = d.toLocaleTimeString("id-ID", {
    ...opsi,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const tanggal = d.toLocaleDateString("id-ID", {
    ...opsi,
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${jam}, ${tanggal}`;
}

module.exports = { formatTanggalIndo };
