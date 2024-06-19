import {app} from "../server.js";
import supertest from "supertest";

test("Login Admin", async () => {
    
    const result = await supertest(app)
        .post('/login')
        .send({
            username: "prayogad",
            password: "password123"
        });

    expect(result.status).toBe(200);
    expect(result.body.message).toBe("Login berhasil")
});

test("Tambah Karyawan", async () => {
    const result = await supertest(app)
        .post('/karyawan')
        .send({
            nip: "51420011",
            nama: "Prayoga",
            jabatan: "Manager",
            gaji_pokok: 12000000,
        });

    expect(result.status).toBe(201);
    expect(result.body.results).toBeDefined();
    expect(result.body.message).toBe("Data berhasil ditambahkan");
});

test("Mendapatkan Data Karyawan", async () => {
    const result = await supertest(app)
        .get('/karyawan')

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.success).toBe(true);
});

test("Menghapus Data Karyawan", async () => {
    const result = await supertest(app)
        .delete('/karyawan/1234')

    expect(result.status).toBe(200);
    expect(result.body.results).toBeDefined();
    expect(result.body.message).toBe("Data berhasil dihapus");
});

test("Membuat Laporan Gaji", async () => {
    const result = await supertest(app)
        .post('/laporan_gaji')
        .send({
            bulan: "Juni",
            tahun: 2024,
            nip: "51420011"
        });

    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Laporan gaji berhasil dibuat");
});

test("Mendapatkan Laporan Gaji", async () => {
    const result = await supertest(app)
        .get('/laporan_gaji/Maret')

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.data).toBeDefined();
});

test("Mendapatkan Slip Gaji", async () => {
    const result = await supertest(app)
        .get('/slip_gaji/4567')

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.data).toBeDefined();
});

