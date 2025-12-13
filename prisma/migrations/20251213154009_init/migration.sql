-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDnaSkill" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rawSkills" TEXT NOT NULL,
    "experiences" TEXT NOT NULL,
    "interest" TEXT NOT NULL,
    "skillStrong" TEXT NOT NULL,
    "skillMedium" TEXT NOT NULL,
    "skillWeak" TEXT NOT NULL,

    CONSTRAINT "UserDnaSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDnaPsychology" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "cognitive" TEXT NOT NULL,
    "learning" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "trait" TEXT NOT NULL,
    "answers" TEXT NOT NULL,

    CONSTRAINT "UserDnaPsychology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Major" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "university" TEXT,
    "category" TEXT,
    "description" TEXT NOT NULL,
    "prospects" TEXT,
    "skills" TEXT,
    "traits" TEXT NOT NULL,
    "mk" TEXT NOT NULL,
    "metadata" TEXT,

    CONSTRAINT "Major_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRecommendation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recommendations" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiInterpretation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiInterpretation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserDnaSkill_userId_key" ON "UserDnaSkill"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDnaPsychology_userId_key" ON "UserDnaPsychology"("userId");

-- CreateIndex
CREATE INDEX "UserRecommendation_userId_idx" ON "UserRecommendation"("userId");

-- CreateIndex
CREATE INDEX "AiInterpretation_userId_createdAt_idx" ON "AiInterpretation"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "UserDnaSkill" ADD CONSTRAINT "UserDnaSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDnaPsychology" ADD CONSTRAINT "UserDnaPsychology_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecommendation" ADD CONSTRAINT "UserRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiInterpretation" ADD CONSTRAINT "AiInterpretation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
