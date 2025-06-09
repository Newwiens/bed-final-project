/*
---Databases Volgorde
Optimale volgorde: de volgorde maakt uit vanwege de FK key
- eerst de records upserten die géén afhankelijkheden hebben, 
- daarna de records die afhankelijk zijn van andere tabellen.

1. User
2. Host
3. Amenity
4. Property (hostId vereist)
5. Booking (userId & propertyId vereist)
6. Review (userId & propertyId vereist)
7. Property-to-Amenity connecties


hybride methode = data uitlezen kan parallel(promise.all) of individuel (for lust)
---------------------------------------------------
Model	    Vereiste Afhankelijkheden	Parallel?
-------------------------------------------------
Host	            Geen	                ✅ Ja
Amenity	            Geen	                ✅ Ja
Property	Host + (optioneel Amenities)	✅ Ja
User	            Geen	                ✅ Ja
Booking	    User + Property	                ❌ Nee*
Review	    User + Property	                ❌ Nee*

*Booking en Review kunnen parallel per groep, maar moeten wachten tot Users en Properties bestaan.
--------------------------------------------------------
*/

// import benodigdheden
import { PrismaClient } from "@prisma/client";
import userData from "../src/data/users.json" with { type: "json" };
import hostData from "../src/data/hosts.json" with { type: "json" };
import amenityData  from "../src/data/amenities.json" with { type: "json"};
import propertyData from "../src/data/properties.json" with { type: "json"};
import bookingData from "../src/data/bookings.json" with { type: "json"};
import reviewData from "../src/data/reviews.json" with { type: "json"};
// Prisma client aanmaken met loglevels
const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

async function main() {
  const { users } = userData;
  const { hosts } = hostData;
  const { amenities } = amenityData; 
  const { properties } = propertyData;
  const { bookings } = bookingData;
  const { reviews } = reviewData;

  // Onafhankelijke Records eerst
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }

  for (const host of hosts) {
    await prisma.host.upsert({
      where: { id: host.id },
      update: {},
      create: host,
    });
  }
  
  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { id: amenity.id },
      update: {},
      create: amenity,
    });
  }

  // Eerst alle properties upserten zonder amenities (want hostId vereist)
  for (const property of properties) {
    const { amenityIds, ...propertyDataOnly } = property; // haal amenityIds eruit
    await prisma.property.upsert({
      where: { id: property.id },
      update: propertyDataOnly,
      create: propertyDataOnly,
    });
  }

  // Dan relaties leggen Property <-> Amenities
  for (const property of properties) {
    if (property.amenityIds && property.amenityIds.length > 0) {
      await prisma.property.update({
        where: { id: property.id },
        data: {
          amenities: {
            connect: property.amenityIds.map((amenityId) => ({ id: amenityId })),
          },
        },
      });
    }
  }

  // Vervolgens bookings (user + property moeten bestaan)
  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: { id: booking.id },
      update: booking,
      create: booking,
    });
  }

  // En als laatste reviews (user + property moeten bestaan)
  for (const review of reviews) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: review,
      create: review,
    });
  }

  console.log("Gebruikers en gerelateerde data zijn succesvol ingevoerd.");
}

// Seed script uitvoeren met error handling
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
