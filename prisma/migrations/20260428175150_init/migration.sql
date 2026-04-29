-- CreateEnum
CREATE TYPE "SokajyType" AS ENUM ('lovitao', 'tily', 'mpiandalana', 'mpitarika', 'mpiandraikitra');

-- CreateEnum
CREATE TYPE "SexeType" AS ENUM ('lahy', 'vavy');

-- CreateEnum
CREATE TYPE "FafiStatut" AS ENUM ('nandoa', 'ampahany', 'tsy_nandoa');

-- CreateTable
CREATE TABLE "membres" (
    "id" SERIAL NOT NULL,
    "numeroCarte" VARCHAR(12),
    "sokajy" "SokajyType" NOT NULL,
    "taomPanabeazana" VARCHAR(9) NOT NULL,
    "anarana" VARCHAR(100) NOT NULL,
    "fanampiny" VARCHAR(100),
    "datyNahaterahana" DATE,
    "toeraNahaterahana" VARCHAR(200),
    "sex" "SexeType" NOT NULL DEFAULT 'lahy',
    "iraitampo" VARCHAR(10),
    "rayAnarana" VARCHAR(200),
    "rayAsa" VARCHAR(200),
    "renyAnarana" VARCHAR(200),
    "renyAsa" VARCHAR(200),
    "finday" VARCHAR(50),
    "adiresy" TEXT,
    "email" VARCHAR(200),
    "kilasy" VARCHAR(100),
    "piangonanaKilasy" VARCHAR(200),
    "sekolyAlahady" BOOLEAN NOT NULL DEFAULT false,
    "sampanaPiangonana" VARCHAR(200),
    "lidiRaLovitao" VARCHAR(50),
    "tilyMaitso" VARCHAR(50),
    "fanasan" BOOLEAN NOT NULL DEFAULT false,
    "mpanantona" BOOLEAN NOT NULL DEFAULT false,
    "sampanaRaisina" VARCHAR(200),
    "aretina" TEXT,
    "sakafo" TEXT,
    "toetraManokana" TEXT,
    "tenyRaaman" TEXT,
    "asaAtao" VARCHAR(200),
    "fahaizana" TEXT,
    "traikefa" TEXT,
    "mpiandalanaGrade" VARCHAR(100),
    "menafifyGrade" VARCHAR(100),
    "fiantso" VARCHAR(200),
    "andraikitrePoste" VARCHAR(200),
    "manambady" BOOLEAN NOT NULL DEFAULT false,
    "zanakaIsa" INTEGER NOT NULL DEFAULT 0,
    "fiangonana" VARCHAR(200),
    "fivondronana" VARCHAR(200),
    "saryUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ambaratonga" (
    "id" SERIAL NOT NULL,
    "membreId" INTEGER NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "daty" DATE,
    "talenta" TEXT,
    "talenDaty" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ambaratonga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fanekena" (
    "id" SERIAL NOT NULL,
    "membreId" INTEGER NOT NULL,
    "sokajyFane" VARCHAR(50) NOT NULL DEFAULT 'fanekena',
    "daty" DATE,
    "toerana" VARCHAR(200),
    "andraikitra" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fanekena_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fandaharam_panabeazana" (
    "id" SERIAL NOT NULL,
    "taomPanabeazana" VARCHAR(9) NOT NULL,
    "sokajy" "SokajyType",
    "faritany" VARCHAR(200),
    "fivondronana" VARCHAR(200),
    "faritra" VARCHAR(200),
    "sampana" VARCHAR(200),
    "quarter" VARCHAR(50),
    "months" INTEGER NOT NULL DEFAULT 3,
    "tanjona" TEXT,
    "kendrena" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fandaharam_panabeazana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fdp_rows" (
    "id" SERIAL NOT NULL,
    "fdpId" INTEGER NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "daty" DATE,
    "lohahevitra" TEXT,
    "sehatra" VARCHAR(200),
    "fomba" VARCHAR(200),
    "toerana" VARCHAR(200),

    CONSTRAINT "fdp_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fisy_teknika" (
    "id" SERIAL NOT NULL,
    "taomPanabeazana" VARCHAR(9) NOT NULL,
    "sokajy" "SokajyType",
    "sampana" VARCHAR(200),
    "daty" DATE,
    "tanjona" TEXT,
    "kendrena" JSONB NOT NULL DEFAULT '[]',
    "faharetany" VARCHAR(100),
    "toerana" VARCHAR(200),
    "vontoatiny" TEXT,
    "tombane" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fisy_teknika_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teknika_rows" (
    "id" SERIAL NOT NULL,
    "teknikaId" INTEGER NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "ora" VARCHAR(8),
    "atao" TEXT,
    "fomba" TEXT,
    "tomponAndraikitra" VARCHAR(200),
    "fitaovana" TEXT,
    "fanamarihana" TEXT,

    CONSTRAINT "teknika_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fafi" (
    "id" SERIAL NOT NULL,
    "membreId" INTEGER NOT NULL,
    "taomPanabeazana" VARCHAR(9) NOT NULL,
    "datyFandoavana" DATE,
    "volaNaloa" DECIMAL(12,2),
    "statut" "FafiStatut" NOT NULL DEFAULT 'tsy_nandoa',
    "mpandray" VARCHAR(200),
    "fanamarihana" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fafi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "membres_numeroCarte_key" ON "membres"("numeroCarte");

-- CreateIndex
CREATE INDEX "membres_sokajy_idx" ON "membres"("sokajy");

-- CreateIndex
CREATE INDEX "membres_taomPanabeazana_idx" ON "membres"("taomPanabeazana");

-- CreateIndex
CREATE INDEX "membres_numeroCarte_idx" ON "membres"("numeroCarte");

-- CreateIndex
CREATE INDEX "ambaratonga_membreId_idx" ON "ambaratonga"("membreId");

-- CreateIndex
CREATE INDEX "fanekena_membreId_idx" ON "fanekena"("membreId");

-- CreateIndex
CREATE INDEX "fandaharam_panabeazana_taomPanabeazana_idx" ON "fandaharam_panabeazana"("taomPanabeazana");

-- CreateIndex
CREATE INDEX "fdp_rows_fdpId_idx" ON "fdp_rows"("fdpId");

-- CreateIndex
CREATE INDEX "fisy_teknika_taomPanabeazana_idx" ON "fisy_teknika"("taomPanabeazana");

-- CreateIndex
CREATE INDEX "teknika_rows_teknikaId_idx" ON "teknika_rows"("teknikaId");

-- CreateIndex
CREATE INDEX "fafi_membreId_idx" ON "fafi"("membreId");

-- CreateIndex
CREATE INDEX "fafi_taomPanabeazana_idx" ON "fafi"("taomPanabeazana");

-- CreateIndex
CREATE INDEX "fafi_statut_idx" ON "fafi"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "fafi_membreId_taomPanabeazana_key" ON "fafi"("membreId", "taomPanabeazana");

-- AddForeignKey
ALTER TABLE "ambaratonga" ADD CONSTRAINT "ambaratonga_membreId_fkey" FOREIGN KEY ("membreId") REFERENCES "membres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fanekena" ADD CONSTRAINT "fanekena_membreId_fkey" FOREIGN KEY ("membreId") REFERENCES "membres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fdp_rows" ADD CONSTRAINT "fdp_rows_fdpId_fkey" FOREIGN KEY ("fdpId") REFERENCES "fandaharam_panabeazana"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teknika_rows" ADD CONSTRAINT "teknika_rows_teknikaId_fkey" FOREIGN KEY ("teknikaId") REFERENCES "fisy_teknika"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fafi" ADD CONSTRAINT "fafi_membreId_fkey" FOREIGN KEY ("membreId") REFERENCES "membres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
