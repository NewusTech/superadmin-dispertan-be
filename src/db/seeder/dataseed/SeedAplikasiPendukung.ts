import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedAplikasiPendukung() {
  console.log('Seed data inserted Aplikasi Pendukung')
  await prisma.aplikasiPendukung.createMany({
    data: [
      {
        'titleApk': 'SiPutani',
        'desApk': 'Sistem Informasi Pupuk Tani',
        'linkUrl': 'siputani.com',
      },
      {
        'titleApk': 'SiTanam',
        'desApk': 'Siswem Informasi Tanam',
        'linkUrl': 'sitanam.com',
      },
      {
        'titleApk': 'ALSINTAN',
        'desApk': 'Aplikasi Alat dan Mesin Pertanian',
        'linkUrl': 'alsintan.apps',
      },
    ],
    skipDuplicates: true,
  })
}