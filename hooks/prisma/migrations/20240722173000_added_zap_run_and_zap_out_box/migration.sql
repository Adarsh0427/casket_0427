-- CreateTable
CREATE TABLE "zapExecution" (
    "id" TEXT NOT NULL,
    "zapId" TEXT NOT NULL,

    CONSTRAINT "zapExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zapExecutionLog" (
    "id" TEXT NOT NULL,
    "zapExecutionId" TEXT NOT NULL,

    CONSTRAINT "zapExecutionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zapExecution_zapId_key" ON "zapExecution"("zapId");

-- CreateIndex
CREATE UNIQUE INDEX "zapExecutionLog_zapExecutionId_key" ON "zapExecutionLog"("zapExecutionId");

-- AddForeignKey
ALTER TABLE "zapExecution" ADD CONSTRAINT "zapExecution_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zapExecutionLog" ADD CONSTRAINT "zapExecutionLog_zapExecutionId_fkey" FOREIGN KEY ("zapExecutionId") REFERENCES "zapExecution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
