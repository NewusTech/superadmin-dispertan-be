import { z } from 'zod'

export const AplikasiPendukungSchema = z.object({
  titleApk: z.string().min(3, 'Nama minimal harus 3 karakter'),
  desApk : z.string().min(3, 'Deskripsi minimal harus 3 karakter'),
  linkUrl: z.string().min(3, 'URL minimal harus 3 karakter'),
})

export const PengumumanSchema = z.object({
  date: z.string().min(10, 'Tanggal minimal harus 10 karakter'),
  title: z.string().min(3, 'Judul minimal harus 3 karakter'),
  value: z.string().min(3, 'Pengumuman minimal harus 3 karakter'),
})

export const PertanyaanSkm = z.object({
  question: z.string().min(3, 'Pertanyaan minimal harus 3 karakter'),
  asanswerOptions: z.string().min(3, 'Opsi minimal harus 3 karakter'),
})

export const Pengaduan = z.object({
  name: z.string().min(3, 'Pertanyaan minimal harus 3 karakter'),
  noTlp : z.string().min(3, 'Pertanyaan minimal harus 3 karakter'),
  email : z.string().email('Invalid email address'),
  alamat: z.string().min(3, 'Pertanyaan minimal harus 3 karakter'),
  title: z.string().min(3, 'Pertanyaan minimal harus 3 karakter'),
  deskripsi: z.string().min(3, 'Pertanyaan minimal harus 3 karakter'),
})

export const Blog = z.object({
  date : z.string().min(10, 'Tanggal minimal harus 10 karakter'),
  title: z.string().min(3, 'Judul minimal harus 3 karakter'),
  value: z.string().min(3, 'Pengumuman minimal harus 3 karakter'),
})

export const Faq = z.object({
  question: z.string().min(3, 'Pertanyaan minimal harus 3 karakter'),
  answare: z.string().min(3, 'Jawaban minimal harus 3 karakter'),
})