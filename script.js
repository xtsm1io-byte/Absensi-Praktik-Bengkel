const scriptURL = 'https://script.google.com/macros/s/AKfycbxGk647C4cC9r35dC9GkWvPWGGaKt6TmXzrlRIspgsshcrvB6ucRG8aeOKkUBh5n5VSjw/exec';
const form = document.getElementById('absensiForm');
const btn = document.getElementById('btnKirim');
const pesan = document.getElementById('pesan');
const isiTabel = document.getElementById('isiTabel');
const rekapanContainer = document.getElementById('rekapanContainer');

// Set tanggal otomatis ke hari ini
document.getElementById('tanggal').valueAsDate = new Date();

function muatRekapan() {
    fetch(scriptURL)
        .then(res => res.json())
        .then(data => {
            isiTabel.innerHTML = ""; 
            data.forEach(row => {
                const tr = document.createElement('tr');
                
                // Format tanggal dari row[1] (Kolom B di Sheet)
                // Jika row[1] adalah objek Date dari Apps Script
                let tglObj = new Date(row[1]);
                let tglFormat = isNaN(tglObj) ? row[1] : tglObj.toLocaleDateString('id-ID', {day:'2-digit', month:'2-digit'});

                tr.innerHTML = `
                    <td>${tglFormat}</td>
                    <td>${row[0]}</td>
                    <td>${row[2]}</td>
                `;
                isiTabel.appendChild(tr);
            });
            rekapanContainer.style.display = "block";
        })
        .catch(err => console.error("Gagal memuat data", err));
}

// Muat data saat aplikasi pertama kali dibuka
muatRekapan();

form.addEventListener('submit', e => {
    e.preventDefault();
    btn.disabled = true;
    pesan.textContent = "Sedang mengirim...";
    pesan.style.color = "gray";

    const payload = {
        nama: document.getElementById('nama').value,
        tanggal: document.getElementById('tanggal').value,
        status: document.getElementById('status').value
    };

    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
    .then(res => {
        pesan.textContent = "Presensi Berhasil Dikirim!";
        pesan.style.color = "green";
        form.reset();
        document.getElementById('tanggal').valueAsDate = new Date();
        muatRekapan(); // Refresh tabel setelah kirim
    })
    .catch(err => {
        pesan.textContent = "Gagal Mengirim Data.";
        pesan.style.color = "red";
    })
    .finally(() => { btn.disabled = false; });
});
 
