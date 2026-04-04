import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log('🏁 ເລີ່ມຕົ້ນການ Seed ຂໍ້ມູນທັງໝົດ...');

  // 1. Branch (ສາຂາ)
  const branch = await prisma.branch.create({
    data: {
      branch_code: 'BR-001',
      branch_name: 'ສາຂາ ວຽງຈັນ (ສຳນັກງານໃຫຍ່)',
      location: 'ຖະໜົນລ້ານຊ້າງ, ບ້ານຫັດສະດີ',
      phone: '021 222 333',
    },
  });

  // 2. User (ຜູ້ໃຊ້)
  const user = await prisma.user.create({
    data: {
      customer_number: 'CUST-8888',
      username: 'soulivanh_it',
      email: 'soulivanh@example.com',
      phoneNumber: 2055554433,
      password: 'hashed_password_123',
      role: 'ADMIN',
      point: 1000,
      province: 'Vientiane',
      district: 'Chanthabouly',
      village: 'Haisoke',
    },
  });

  // 3. Employee (ພະນັກງານ)
  await prisma.employee.create({
    data: {
      employee_code: 'EMP-001',
      employee_name: 'ທ້າວ ສົມພອນ',
      position: 'Manager',
      branchId: branch.branch_id,
      userId: user.user_id,
    },
  });

  // 4. Promotion (ໂປຣໂມຊັ່ນ)
  await prisma.promotion.create({
    data: {
      title: 'ຫຼຸດຄ່າແຮງ 50%',
      detail: 'ສຳລັບລູກຄ້າທີ່ມາໃຊ້ບໍລິການຄັ້ງທຳອິດ',
      image: 'promo_1.png',
    },
  });

  // 5. Service (ການບໍລິການ)
  const service = await prisma.service.create({
    data: {
      serviceName: 'ປ່ຽນນ້ຳມັນເຄື່ອງ Revo',
      description: 'ບໍລິການປ່ຽນນ້ຳມັນເຄື່ອງສັງເຄາະແທ້ 100%',
      image: 'oil_service.jpg',
    },
  });

  // 6. GiftCard (ບັດຂອງຂວັນ)
  const giftCard = await prisma.giftCard.create({
    data: {
      name: 'Voucher ສ່ວນຫຼຸດ 50,000 ກີບ',
      amount: 50000,
      point: 500,
      image: 'voucher_50.jpg',
      status: true,
    },
  });

  // 7. GiftHistory (ປະຫວັດການແລກຂອງຂວັນ)
  await prisma.giftHistory.create({
    data: {
      userId: user.user_id,
      giftcardId: giftCard.giftcard_id,
      amount: 1,
      status: true,
    },
  });

  // 8. Card (ບັດສະມາຊິກ/VIP)
  await prisma.card.create({
    data: {
      userId: user.user_id,
      customer_number: user.customer_number,
      card_number: 'VIP-999-001',
      vip_number: 'VIP001',
      discount: 10,
    },
  });

  // 9. Car (ລົດ)
  const car = await prisma.car.create({
    data: {
      userId: user.user_id,
      model: 'Toyota Hilux Revo',
      frameNumber: 'VIN-REVO-2024-001',
      engineNumber: 'ENG-1GD-999',
      plateNumber: 'ກກ 9999',
      province: 'ນະຄອນຫຼວງ',
      color: 'Silver',
    },
  });

  // 10. Time (ເວລາເປີດບໍລິການ)
  const timeSlot = await prisma.time.create({
    data: {
      time: '09:00',
      date: '2024-06-01',
      timeStatus: true,
      qty: 5,
    },
  });

  // 11. Zone (ໂຊນບໍລິການ)
  const zone = await prisma.zone.create({
    data: {
      zoneName: 'ໂຊນ A (ລົດເບົາ)',
      zoneStatus: true,
    },
  });

  // 12. TimeFix (ການຕັ້ງຄ່າເວລາໃນໂຊນ)
  const timeFix = await prisma.timeFix.create({
    data: {
      timeId: timeSlot.time_id,
      branchId: branch.branch_id,
      zoneId: zone.zone_id,
    },
  });

  // 13. Booking (ການຈອງ)
  const booking = await prisma.booking.create({
    data: {
      userId: user.user_id,
      carId: car.car_id,
      timeId: timeSlot.time_id,
      branchId: branch.branch_id,
      remark: 'ຂໍຊ່າງທີ່ຊ່ຽວຊານເປັນພິເສດ',
      code: 'BK-20240601-001',
      bookingStatus: 'await',
      timeFixTimefix_id: timeFix.timefix_id,
    },
  });

  // 14. BookingDetail (ລາຍລະອຽດການຈອງ)
  await prisma.bookingDetail.create({
    data: {
      bookingId: booking.booking_id,
      serviceId: service.service_id,
    },
  });

  // 15. Fix (ການຊ້ອມແປງ/ບັນທຶກການຊ້ອມ)
  await prisma.fix.create({
    data: {
      zoneId: zone.zone_id,
      bookingId: booking.booking_id,
      detailFix: 'ປ່ຽນນ້ຳມັນເຄື່ອງ ແລະ ກອງນ້ຳມັນ',
      kmLast: 15000,
      kmNext: 20000,
      fixCarPrice: 150000,
      carPartPrice: 450000,
      totalPrice: 600000,
      fixStatus: 'completed',
    },
  });

  console.log('✅ Seed ຂໍ້ມູນຄົບທັງ 15 Models ຮຽບຮ້ອຍແລ້ວ!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });