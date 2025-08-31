-- CreateTable
CREATE TABLE "public"."Book" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(100),
    "author" VARCHAR(255),

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Drink" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" VARCHAR(50) NOT NULL,

    CONSTRAINT "Drink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "drinkId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" TEXT,
    "status" VARCHAR(50),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_drinkId_fkey" FOREIGN KEY ("drinkId") REFERENCES "public"."Drink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
