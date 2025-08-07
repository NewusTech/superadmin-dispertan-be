-- CreateTable
CREATE TABLE "AplikasiPendukung" (
    "id" SERIAL NOT NULL,
    "titleApk" TEXT,
    "desApk" TEXT,
    "linkUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AplikasiPendukung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengumuman" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "title" TEXT,
    "value" TEXT,
    "file" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PertanyaanSkm" (
    "id" SERIAL NOT NULL,
    "question" TEXT,
    "asanswerOptions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PertanyaanSkm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSkm" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "gender" TEXT,
    "age" TEXT,
    "alamat" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DataSkm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JawabanSkm" (
    "id" SERIAL NOT NULL,
    "dataSkmId" INTEGER,
    "pertanyaanSkmId" INTEGER,
    "question" TEXT,
    "asanswer" TEXT,
    "opsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "JawabanSkm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengaduan" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "noTlp" TEXT,
    "email" TEXT,
    "alamat" TEXT,
    "title" TEXT,
    "deskripsi" TEXT,
    "file" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Pengaduan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "title" TEXT,
    "value" TEXT,
    "file" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" SERIAL NOT NULL,
    "question" TEXT,
    "answare" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JawabanSkm" ADD CONSTRAINT "JawabanSkm_dataSkmId_fkey" FOREIGN KEY ("dataSkmId") REFERENCES "DataSkm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JawabanSkm" ADD CONSTRAINT "JawabanSkm_pertanyaanSkmId_fkey" FOREIGN KEY ("pertanyaanSkmId") REFERENCES "PertanyaanSkm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
