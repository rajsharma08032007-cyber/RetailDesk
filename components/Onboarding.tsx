import React, { useState } from 'react';
import { BusinessProfile, Sector, Branch, Transaction, Employee, Role, ServiceItem, InventoryItem, Unit } from '../types.ts';
import { Coffee, Wrench, Scissors, Pill, ArrowRight, Building2, Smartphone } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<Sector | ''>('');

  const bootstrapSector = () => {
    const s = sector as Sector;
    let mockRoles: Role[] = [];
    let mockServices: ServiceItem[] = [];
    let mockEmps: Employee[] = [];
    let mockInventory: InventoryItem[] = [];

    switch(s) {
      case Sector.CAFE:
        mockRoles = [
          { id: 'r1', name: 'Manager', isServiceProvider: false },
          { id: 'r2', name: 'Cashier', isServiceProvider: true },
          { id: 'r3', name: 'Head Baker', isServiceProvider: true },
          { id: 'r4', name: 'Barista', isServiceProvider: true },
          { id: 'r5', name: 'Delivery Executive', isServiceProvider: false },
          { id: 'r6', name: 'Kitchen Assistant', isServiceProvider: false },
          { id: 'r7', name: 'Waiter', isServiceProvider: false },
          { id: 'r8', name: 'Cleaner', isServiceProvider: false }
        ];
        mockServices = [
          { id: 's1', name: 'Espresso', price: 40, category: 'Coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&fit=crop' },
          { id: 's2', name: 'Americano', price: 35, category: 'Coffee', image: 'https://www.shutterstock.com/image-photo/hot-americano-coffee-rich-aroma-600nw-2706827099.jpg' },
          { id: 's3', name: 'Cappuccino', price: 55, category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&fit=crop' },
          { id: 's4', name: 'Latte', price: 60, category: 'Coffee', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&fit=crop' },
          { id: 's5', name: 'Mocha', price: 45, category: 'Coffee', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&fit=crop' },
          { id: 's6', name: 'Hot Chocolate', price: 30, category: 'Hot Beverage', image: 'https://media.istockphoto.com/id/524265513/photo/homemade-peppermint-hot-chocolate.jpg?s=612x612&w=0&k=20&c=5_lpJmgDqedCuHEXi-gG4v3Zx3lFwUYJ9zIOV7B8liU=' },
          { id: 's7', name: 'Cold Coffee', price: 25, category: 'Cold Beverage', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&fit=crop' },
          { id: 's8', name: 'Masala Tea', price: 60, category: 'Tea', image: 'https://t4.ftcdn.net/jpg/01/66/87/43/360_F_166874362_kZTGg8x1JgRsSCJgO0GWhrkgSWa4ZqRA.jpg' },
          { id: 's9', name: 'Avocado Toast', price: 120, category: 'Food', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&fit=crop' },
          { id: 's10', name: 'Butter Croissant', price: 140, category: 'Pastry', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&fit=crop' },
          { id: 's11', name: 'Chocolate Muffin', price: 120, category: 'Muffin', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&fit=crop' },
          { id: 's12', name: 'Blueberry Muffin', price: 130, category: 'Muffin', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&fit=crop' },
          { id: 's13', name: 'Brownie', price: 150, category: 'Dessert', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&fit=crop' },
          { id: 's14', name: 'CheeseCake Slice', price: 260, category: 'Dessert', image: 'https://media.istockphoto.com/id/1485851569/photo/tasty-cheesecake-with-caramel-and-nuts-served-on-table.jpg?s=612x612&w=0&k=20&c=RIIMi-oJ6SeFfzGeXGPfsOT0pLO4YhGHSNjIqNUY6Eg=' },
          { id: 's15', name: 'ChocolateCake Slice', price: 220, category: 'Dessert', image: 'https://t4.ftcdn.net/jpg/06/78/12/01/360_F_678120157_GwrkDJE19x77N2BiSrsml6pN4ef94o8x.jpg' },
          { id: 's16', name: 'Veg Sandwich', price: 65, category: 'Snack', image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=600&fit=crop' },
          { id: 's17', name: 'Grilled Cheese Sandwich', price: 50, category: 'Snack', image: 'https://thumbs.dreamstime.com/b/american-hot-cheese-sandwich-homemade-grilled-breakfast-147894109.jpg' },
          { id: 's18', name: 'Panner Sandwich', price: 65, category: 'Snack', image: 'https://media.istockphoto.com/id/1300443216/photo/vegetable-paneer-sandwich-using-cottage-cheese-with-tomato-onion-and-lettuce-with-chutney.jpg?s=612x612&w=0&k=20&c=3oF8PsUvInw4lLYe6JGYdz65_bYzfrPKLu-SYwa4AaI=' },
          { id: 's19', name: 'Garlic Bread', price: 40, category: 'Snack', image: 'https://media.istockphoto.com/id/1441714834/photo/fresh-garlic-bread-with-cheese-and-spices-on-the-wooden-table.jpg?s=612x612&w=0&k=20&c=5hWb8Az0zutl1UDoiqm6MIFSa1fHJLje1pw7eQagAcI=' }
        ];
        mockInventory = [
          { id: 'i1', name: 'Coffee Beans', quantity: 50, unit: 'kg', category: 'Raw Material', minLevel: 10 },
          { id: 'i2', name: 'Milk', quantity: 120, unit: 'ltr', category: 'Dairy', minLevel: 20 },
          { id: 'i3', name: 'Flour', quantity: 120, unit: 'ltr', category: 'Raw Material', minLevel: 15 },
          { id: 'i4', name: 'Butter', quantity: 120, unit: 'ltr', category: 'Dairy', minLevel: 10 },
          { id: 'i5', name: 'Eggs', quantity: 120, unit: 'pcs', category: 'Supplies', minLevel: 50 },
          { id: 'i6', name: 'Sugar', quantity: 30, unit: 'kg', category: 'Raw Material', minLevel: 5 },
          { id: 'i7', name: 'Chocolate Syrup', quantity: 30, unit: 'kg', category: 'Raw Material', minLevel: 5 },
          { id: 'i8', name: 'Paper Cups', quantity: 500, unit: 'pcs', category: 'Supplies', minLevel: 100 },
          { id: 'i9', name: 'Paper Plates', quantity: 500, unit: 'pcs', category: 'Supplies', minLevel: 100 }
        ];
        mockEmps = [
          { id: 'e1', name: 'Nancy Wheeler', role: 'Manager', salary: 35000, status: 'Active', joinedDate: '2023-01-10' },
          { id: 'e2', name: 'Joyce Byers', role: 'Cashier', salary: 15000, status: 'Active', joinedDate: '2023-02-15' },
          { id: 'e3', name: 'Robin Buckley', role: 'Head Baker', salary: 18000, status: 'Active', joinedDate: '2023-02-15' },
          { id: 'e4', name: 'Steve Harrington', role: 'Barista', salary: 18000, status: 'Active', joinedDate: '2023-02-15' },
          { id: 'e5', name: 'Jonathan Byers', role: 'Delivery Executive', salary: 16000, status: 'Active', joinedDate: '2023-02-15' },
          { id: 'e6', name: 'Holly Wheeler', role: 'Kitchen Assistant', salary: 14000, status: 'Active', joinedDate: '2023-02-15' },
          { id: 'e7', name: 'Argyle Huts', role: 'Waiter', salary: 10000, status: 'Active', joinedDate: '2023-02-15' },
          { id: 'e8', name: 'Doris Driscoll', role: 'Cleaner', salary: 10000, status: 'Active', joinedDate: '2023-03-01' }
        ];
        break;
      case Sector.AUTO:
        mockRoles = [
          { id: 'r1', name: 'Workshop Manager', isServiceProvider: false },
          { id: 'r2', name: 'Service Advisor', isServiceProvider: true },
          { id: 'r3', name: 'Senior Mechanic', isServiceProvider: true },
          { id: 'r4', name: 'Junior Mechanic', isServiceProvider: true },
          { id: 'r5', name: 'Electrician', isServiceProvider: true },
          { id: 'r6', name: 'Cleaner', isServiceProvider: false }
        ];
        mockServices = [
          { id: 's1', name: 'General Vehicle Inspection', price: 800, category: 'Diagnostic', image: 'https://www.shutterstock.com/image-photo/auto-check-car-service-shop-600nw-2486269071.jpg' },
          { id: 's2', name: 'Engine Diagnostics [OBD]', price: 1800, category: 'Diagnostic', image: 'https://t3.ftcdn.net/jpg/03/41/42/92/360_F_341429200_XZJ0Zsrzu8NCzpFzrOma73d3NyTSSH4p.jpg' },
          { id: 's3', name: 'Oil Change (Mineral)', price: 1200, category: 'Maintenance', image: 'https://media.istockphoto.com/id/1218396853/photo/woman-hand-pour-motor-oil-to-car-engine.jpg?s=612x612&w=0&k=20&c=9JkBpt9o-4MiRLp61v4tqVirO8dfedVw0omEpZSrkds=' },
          { id: 's4', name: 'Oil Change (Synthetic)', price: 2200, category: 'Maintenance', image: 'https://t3.ftcdn.net/jpg/02/01/87/94/360_F_201879487_LnJybzIlQLTe4k620PPBmoKXEyvEEigQ.jpg' },
          { id: 's5', name: 'Wheel Alignment & Balancing', price: 1500, category: 'Wheels', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&fit=crop' },
          { id: 's6', name: 'Car Wash & Vaccum', price: 600, category: 'Cleaning', image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&fit=crop' },
          { id: 's7', name: 'Clutch Overhaul', price: 9000, category: 'Transmission', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&fit=crop' },
          { id: 's8', name: 'Suspension Repair', price: 6500, category: 'Mechanical', image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&fit=crop' },
          { id: 's9', name: 'Timing Belt Replacement', price: 7500, category: 'Engine', image: 'https://images.unsplash.com/photo-1504222490345-c075b6008014?w=600&fit=crop' },
          { id: 's10', name: 'Battery Replacement', price: 5200, category: 'Electrical', image: 'https://media.istockphoto.com/id/1356606765/photo/mechanic-holds-key-over-car-battery-with-engine-trunk-of-the-car-open.jpg?s=612x612&w=0&k=20&c=QGvkRukQnME8GvSZ_N83NrUTwWYV6tyaoLE0hZEF3es=' },
          { id: 's11', name: 'Wiring Repair', price: 2500, category: 'Electrical', image: 'https://previews.123rf.com/images/amnachphoto/amnachphoto1404/amnachphoto140400217/27784784-closeup-car-electric-repair-repair-of-electrical-wiring-in-the-car.jpg' },
          { id: 's12', name: 'Headlight Restoration', price: 1200, category: 'Electrical', image: 'https://static.vecteezy.com/system/resources/thumbnails/070/319/109/small/first-person-view-of-polishing-car-headlight-with-restoration-pad-for-a-clean-shine-photo.jpg' },
          { id: 's13', name: 'AC Gas Refill', price: 2500, category: 'AC', image: 'https://www.shutterstock.com/image-photo/car-air-conditioning-ac-repair-600nw-2186069289.jpg' },
          { id: 's14', name: 'Full AC Service', price: 3800, category: 'AC', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ_eq5kMjHQf7PHCS2pGwoWqUFjaFsTRPr2w&s' }
        ];
        mockInventory = [
          { id: 'i1', name: 'Engine Oil (5W-30)', quantity: 200, unit: 'ltr', category: 'Fluids', minLevel: 50 },
          { id: 'i2', name: 'Brake Pads', quantity: 40, unit: 'pcs', category: 'Parts', minLevel: 10 },
          { id: 'i3', name: 'Headlight Bulbs', quantity: 60, unit: 'pcs', category: 'Parts', minLevel: 20 },
          { id: 'i4', name: 'Coolant', quantity: 100, unit: 'ltr', category: 'Fluids', minLevel: 25 },
          { id: 'i5', name: 'Spark Plugs', quantity: 100, unit: 'pcs', category: 'Parts', minLevel: 20 },
          { id: 'i6', name: 'Air Filters', quantity: 100, unit: 'pcs', category: 'Parts', minLevel: 15 }
        ];
        mockEmps = [
          { id: 'e1', name: 'Jim Hopper', role: 'Workshop Manager', salary: 40000, status: 'Active', joinedDate: '2022-11-20' },
          { id: 'e2', name: 'Mike Wheelar', role: 'Service Advisor', salary: 20000, status: 'Active', joinedDate: '2022-11-20' },
          { id: 'e3', name: 'Murray Bauman', role: 'Senior Mechanic', salary: 30000, status: 'Active', joinedDate: '2022-11-20' },
          { id: 'e4', name: 'Dustin Henderson', role: 'Junior Mechanic', salary: 18000, status: 'Active', joinedDate: '2022-11-20' },
          { id: 'e5', name: 'Will Byers', role: 'Electrician', salary: 22000, status: 'Active', joinedDate: '2023-01-05' },
          { id: 'e6', name: 'Fred Benson', role: 'Cleaner', salary: 12000, status: 'Active', joinedDate: '2023-01-05' }
        ];
        break;
      case Sector.SALON:
        mockRoles = [
          { id: 'r1', name: 'Salon Manager', isServiceProvider: false },
          { id: 'r2', name: 'Receptionist', isServiceProvider: true },
          { id: 'r3', name: 'Senior Stylist', isServiceProvider: true },
          { id: 'r4', name: 'Junior Stylist', isServiceProvider: true },
          { id: 'r5', name: 'Beautician', isServiceProvider: true },
          { id: 'r6', name: 'Massage Therapist', isServiceProvider: true },
          { id: 'r7', name: 'Cleaner', isServiceProvider: false}
        ];
        mockServices = [
          { id: 's1', name: 'Men Haircut', price: 75, category: 'Hair', image: 'https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
          { id: 's2', name: 'Women Haircut', price: 150, category: 'Hair', image: 'https://media.istockphoto.com/id/692999494/photo/hairdresser-cutting-some-hair-tips.webp?a=1&b=1&s=612x612&w=0&k=20&c=tlx34JXu-XOOUzvSmQbH0Ef4288Tb4wwOHWHP8KYjxI=' },
          { id: 's3', name: 'Kids Haircut', price: 75, category: 'Hair', image: 'https://plus.unsplash.com/premium_photo-1677098576199-971c398f5403?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 's4', name: 'Hair Wash & Blow Dry', price: 75, category: 'Hair', image: 'https://images.pexels.com/photos/7447134/pexels-photo-7447134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
          { id: 's5', name: 'Hair Spa', price: 75, category: 'Hair Care', image: 'https://images.pexels.com/photos/8834048/pexels-photo-8834048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
          { id: 's6', name: 'Global Hair Coloring', price: 55, category: 'Coloring', image: 'https://plus.unsplash.com/premium_photo-1661672325251-683e6f7dea00?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 's7', name: 'Root Touch Up', price: 55, category: 'Coloring', image: 'https://images.pexels.com/photos/4981476/pexels-photo-4981476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
          { id: 's8', name: 'Keratin Treatment', price: 55, category: 'Premium', image: 'https://plus.unsplash.com/premium_photo-1720363480581-7c9765c74627?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 's9', name: 'Smoothening', price: 55, category: 'Premium', image: 'https://media.istockphoto.com/id/177429570/photo/high-quality-image-woman-with-smooth-hair.jpg?s=2048x2048&w=is&k=20&c=LYR0Cu3YBMMsNSmVuJQp9nYuYSGbZ09wGJd1WkNxzEU=' },
          { id: 's10', name: 'Anti-Dandruff', price: 55, category: 'Treatment', image: 'https://plus.unsplash.com/premium_photo-1674841253522-893a6a0077c0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 's11', name: 'Tan Removal', price: 55, category: 'Treatment', image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 's12', name: 'CleanUp', price: 55, category: 'Skin', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 's13', name: 'Facial-Gold', price: 55, category: 'Skin', image: 'https://plus.unsplash.com/premium_photo-1664300415296-1e1e606e553a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bHV4dXJ5JTIwZmFjaWFsfGVufDB8fDB8fHww' },
          { id: 's14', name: 'Facial-Fruit', price: 55, category: 'Skin', image: 'https://media.istockphoto.com/id/1590247969/photo/beautiful-woman-enjoying-receiving-a-facial-treatment-at-the-spa.jpg?s=2048x2048&w=is&k=20&c=NmPUQ2X4XZvL8XG6HSInhV7yXn9frY6GBvdbSZpR3sA=' },
          { id: 's15', name: 'Full Body Massage', price: 55, category: 'Spa', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9keSUyMG1hc3NhZ2V8ZW58MHx8MHx8fDA%3D' },
          { id: 's16', name: 'Head Massage', price: 55, category: 'Spa', image: 'https://plus.unsplash.com/premium_photo-1663090763496-310472d5ef93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVhZCUyMG1hc3NhZ2V8ZW58MHx8MHx8fDA%3D' },
          { id: 's17', name: 'Threading(EyeBrow)', price: 55, category: 'Grooming', image: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXllYnJvdyUyMHRocmVhZGluZ3xlbnwwfHwwfHx8MA%3D%3D' },
          { id: 's18', name: 'Waxing(Arms)', price: 55, category: 'Grooming', image: 'https://plus.unsplash.com/premium_photo-1661541089335-518bd5aaade9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8d2F4aW5nJTIwYXJtc3xlbnwwfHwwfHx8MA%3D%3D' },
          { id: 's19', name: 'Waxing(Legs)', price: 55, category: 'Grooming', image: 'https://plus.unsplash.com/premium_photo-1726804940914-2cd542e5d7e6?w=600&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGVnJTIwd2F4aW5nfGVufDB8fDB8fHww' },
          { id: 's20', name: 'Beard Trim', price: 55, category: 'Grooming', image: 'https://plus.unsplash.com/premium_photo-1661382028468-38612d62a254?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhcmQlMjB0cmltfGVufDB8fDB8fHww' }
        ];
        mockInventory = [
          { id: 'i1', name: 'Massage Oil', quantity: 15, unit: 'ltr', category: 'Spa', minLevel: 5 },
          { id: 'i2', name: 'Shampoo', quantity: 20, unit: 'ltr', category: 'Hair', minLevel: 4 },
          { id: 'i3', name: 'Hair Color', quantity: 50, unit: 'tubes', category: 'Chemicals', minLevel: 10 },
          { id: 'i4', name: 'Facial Kits', quantity: 50, unit: 'kits', category: 'Facial', minLevel: 10 },
          { id: 'i5', name: 'Wax', quantity: 50, unit: 'kg', category: 'Chemicals', minLevel: 8 },
          { id: 'i6', name: 'Towels', quantity: 100, unit: 'pcs', category: 'Supplies', minLevel: 20 }
        ];
        mockEmps = [
          { id: 'e1', name: 'Karen Wheeler', role: 'Salon Manager', salary: 32000, status: 'Active', joinedDate: '2022-05-10' },
          { id: 'e2', name: 'Becky Ives', role: 'Receptionist', salary: 15000, status: 'Active', joinedDate: '2022-05-10' },
          { id: 'e3', name: 'Max Mayfield', role: 'Senior Stylist', salary: 28000, status: 'Active', joinedDate: '2022-05-10' },
          { id: 'e4', name: 'Jane Hopper', role: 'Junior Stylist', salary: 16000, status: 'Active', joinedDate: '2022-05-10' },
          { id: 'e5', name: 'Tina Cline', role: 'Beautician', salary: 20000, status: 'Active', joinedDate: '2022-05-10' },
          { id: 'e6', name: 'Nagma Khatoon', role: 'Massage Therapist', salary: 22000, status: 'Active', joinedDate: '2022-05-10' },
          { id: 'e7', name: 'Keith Matty', role: 'Cleaner', salary: 12000, status: 'Active', joinedDate: '2022-05-10' }
        ];
        break;
      case Sector.MEDICAL:
        mockRoles = [
          { id: 'r1', name: 'Store Manager', isServiceProvider: false },
          { id: 'r2', name: 'Billing Executive', isServiceProvider: true },
          { id: 'r3', name: 'Cheif Pharmacist', isServiceProvider: true },
          { id: 'r4', name: 'Assistant Pharmacist', isServiceProvider: true },
          { id: 'r5', name: 'Inventory Assistant', isServiceProvider: false },
          { id: 'r6', name: 'Delivery Executive', isServiceProvider: false },
          { id: 'r7', name: 'Cleaner', isServiceProvider: false }
        ];
        mockServices = [
          { id: 's1', name: 'Paracetamol 500mg', price: 22, category: 'Fever/Pain', image: 'https://media.istockphoto.com/id/1217210776/photo/generic-paracetamol-500mg-tablets.jpg?s=612x612&w=0&k=20&c=Tb7EuiMSA9yw7MpBLrT543Kd_l7IrabQfxfGzRRRgNI=' },
          { id: 's2', name: 'Antacid Tablets', price: 18, category: 'Digestive', image: 'https://images.pond5.com/antacid-tablets-medicine-box-footage-256283990_iconl.jpeg' },
          { id: 's3', name: 'Cold & Flu Tablets', price: 35, category: 'Cold', image: 'https://5.imimg.com/data5/SELLER/Default/2024/7/432301099/ZD/RQ/OF/153839255/healing-cold-and-flu-tablets.jpg' },
          { id: 's4', name: 'ORS Sachet', price: 21, category: 'Hydration', image: 'https://5.imimg.com/data5/SELLER/Default/2023/6/313561323/VC/OW/GP/150154223/ors-2-.jpeg' },
          { id: 's5', name: 'Vitamin C Tablets', price: 25, category: 'Supplements', image: 'https://media.istockphoto.com/id/158324666/photo/vitamin-c-pills.jpg?s=612x612&w=0&k=20&c=ANJohnSd2bNsj3Wb5NJam-HjeLh-EaGrQG-t5MgX3Vk=' },
          { id: 's6', name: 'Antibiotics', price: 120, category: 'Infection', image: 'https://thumbs.dreamstime.com/b/antibiotic-drug-open-paper-packaging-box-medication-name-group-drug-antibiotic-blister-pills-next-to-stethoscop-107555621.jpg' },
          { id: 's7', name: 'Diabetes Tablets', price: 95, category: 'Chronic', image: 'https://static.vecteezy.com/system/resources/previews/002/028/833/non_2x/top-view-of-diabetic-measurement-tools-and-pills-on-color-background-photo.jpg' },
          { id: 's8', name: 'Blood Pressure Tablets', price: 110, category: 'Chronic', image: 'https://media.istockphoto.com/id/1309305470/photo/blisters-with-pills-and-medical-tonometer-on-black-background-close-up-medical-concept.jpg?s=612x612&w=0&k=20&c=ikN-Xd0FifYKOkUgNAJI5YVlVPePSuBNV_nehL0Tm-s=' },
          { id: 's9', name: 'Thyroid Tablets', price: 145, category: 'Hormonal', image: 'https://t4.ftcdn.net/jpg/16/28/49/97/360_F_1628499767_FeOPze89pVjRgHI3c54CA0woAMi0oSOi.jpg' },
          { id: 's10', name: 'Anti-Allergy', price: 60, category: 'Allergy', image: 'https://media.istockphoto.com/id/1172461597/photo/antihistamine-medication-or-allergy-drug-concept-photo-on-doctor-table-is-pack-with-word.jpg?s=612x612&w=0&k=20&c=EUyd6nTJXikTB9gwZA12tql0hN8-x4U3cPMaTgeMFY4=' },
          { id: 's11', name: 'Insulin Vials', price: 620, category: 'Diabetes', image: 'https://t3.ftcdn.net/jpg/03/05/57/46/360_F_305574667_b7ZQzGLOpB48U4QiV1PhTrG56zxndIW5.jpg' },
          { id: 's12', name: 'Vaccines', price: 850, category: 'Immunization', image: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/10622/6524ac58-8ca7-4b9f-9e96-5b11169af6b2.jpg' },
          { id: 's13', name: 'Iron Injections', price: 1200, category: 'Deficiency', image: 'https://5.imimg.com/data5/SELLER/Default/2022/12/UO/JH/FA/155546301/iron-sucrose-injection.jpg' },
          { id: 's14', name: 'Emergency Injections', price: 95, category: 'Emergency', image: 'https://thumbs.dreamstime.com/b/epinephrine-injection-vial-emergency-medication-anaphylaxis-cardiac-arrest-gloved-hand-holding-vial-labeled-epinephrine-403917141.jpg' }
        ];
        mockInventory = [
          { id: 'i1', name: 'Medical Refrigerator', quantity: 15, unit: 'pcs', category: 'Appliances', minLevel: 1 },
          { id: 'i2', name: 'Vaccine Ice Packs', quantity: 20, unit: 'packs', category: 'Storage', minLevel: 5 },
          { id: 'i3', name: 'Digital Thermometer', quantity: 50, unit: 'pcs', category: 'Devices', minLevel: 10 },
          { id: 'i4', name: 'Cleaning Supplies', quantity: 50, unit: 'packs', category: 'Hygiene', minLevel: 10 },
          { id: 'i5', name: 'Towels', quantity: 100, unit: 'pcs', category: 'Supplies', minLevel: 20 },
          { id: 'i6', name: 'Medicine Carry Bags', quantity: 100, unit: 'packs', category: 'Packaging', minLevel: 50 },
          { id: 'i7', name: 'Prescription Receipt Books', quantity: 100, unit: 'packs', category: 'Admin', minLevel: 20 },
          { id: 'i8', name: 'Syringes', quantity: 100, unit: 'pcs', category: 'Surgical', minLevel: 100 },
          { id: 'i9', name: 'Gloves', quantity: 100, unit: 'box', category: 'Safety', minLevel: 20 }
        ];
        mockEmps = [
          { id: 'e1', name: 'Ted Wheeler', role: 'Store Manager', salary: 30000, status: 'Active', joinedDate: '2022-05-10' },
          { id: 'e2', name: 'Bob Newby', role: 'Billing Executive', salary: 40000, status: 'Active', joinedDate: '2022-05-10' },
          { id: 'e3', name: 'Sam Owens', role: 'Cheif Pharmacist', salary: 22000, status: 'Active', joinedDate: '2022-05-10' },
          { id: 'e4', name: 'Tom Dimitri', role: 'Assistant Pharmacist', salary: 16000, status: 'Active', joinedDate: '2022-05-10' },
          { id: 'e5', name: 'Alexei Utgoff', role: 'Inventory Assistant', salary: 15000, status: 'Active', joinedDate: '2022-05-10' },
          { id: 'e6', name: 'Victor Creel', role: 'Delivery Executive', salary: 17000, status: 'Active', joinedDate: '2022-05-10' },
          { id: 'e7', name: 'Kali Prasad', role: 'Cleaner', salary: 10000, status: 'Active', joinedDate: '2022-05-10' }
        ];
        break;
      default:
        mockRoles = [{ id: 'r1', name: 'Staff', isServiceProvider: true }];
        mockServices = [{ id: 's1', name: 'General Support', price: 100, category: 'General', image: '' }];
        mockInventory = [{ id: 'i1', name: 'Generic Item', quantity: 100, unit: 'pcs', category: 'General', minLevel: 10 }];
        mockEmps = [{ id: 'e1', name: 'Lead User', role: 'Staff', salary: 3000, status: 'Active', joinedDate: '2023-01-01' }];
    }

    const txs: Transaction[] = [];
    const specialists = mockEmps.filter(e => e.status === 'Active');
    
    for (let i = 0; i < 500; i++) {
      const randomService = mockServices[Math.floor(Math.random() * mockServices.length)];
      const randomEmp = specialists[Math.floor(Math.random() * specialists.length)];
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(9 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));

      txs.push({
        id: `TX-${3000 + i}`,
        employeeIds: [randomEmp.id],
        serviceIds: [randomService.id],
        customer: { name: 'Verified Client', phone: '99887-76655' },
        paymentMethod: Math.random() > 0.4 ? 'UPI' : Math.random() > 0.5 ? 'CASH' : 'SPLIT',
        totalAmount: randomService.price,
        date: date.toISOString()
      });
    }

    onComplete({
      profile: { companyName, sector: s, branches: [{ id: '1', name: 'Main Store', location: 'Commercial Hub' }] },
      roles: mockRoles,
      services: mockServices,
      inventory: mockInventory,
      employees: mockEmps,
      transactions: txs
    });
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-slate-900 border border-white/5 rounded-[2rem] md:rounded-[4rem] shadow-3xl p-6 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="mb-6 md:mb-12 relative z-10">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 md:mb-8 text-slate-950 font-black text-2xl md:text-3xl shadow-xl shadow-emerald-500/20">R</div>
          <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter mb-2 md:mb-4 leading-none uppercase">System<br/>Automation</h1>
          <p className="text-slate-500 font-bold uppercase text-[8px] md:text-xs tracking-widest">Select business type & enter profile name</p>
        </div>

        <div className="space-y-4 md:space-y-10 relative z-10">
          <div>
            <label className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3 block">Corporate Registry</label>
            <div className="relative">
              <Building2 className="absolute left-5 md:left-6 top-4 md:top-5 text-slate-700" size={20} />
              <input 
                type="text" 
                value={companyName} 
                onChange={e => setCompanyName(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl py-4 md:py-5 pl-14 md:pl-16 pr-6 md:pr-8 text-sm md:text-xl font-bold outline-none focus:border-emerald-500 transition-all placeholder:text-slate-800" 
                placeholder="Shop Name..." 
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 block">Operational Sector</label>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { id: Sector.CAFE, icon: Coffee },
                { id: Sector.AUTO, icon: Wrench },
                { id: Sector.SALON, icon: Scissors },
                { id: Sector.MEDICAL, icon: Pill }
              ].map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setSector(s.id)} 
                  className={`p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-2 md:gap-4 group ${sector === s.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-2xl scale-[1.02]' : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                >
                  <s.icon size={24} className={sector === s.id ? 'text-emerald-400' : 'text-slate-700 group-hover:text-slate-500'} />
                  <span className="text-[8px] md:text-[11px] font-black uppercase tracking-widest text-center leading-tight">{s.id}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={bootstrapSector} 
            disabled={!companyName || !sector} 
            className="w-full py-4 md:py-6 bg-emerald-500 rounded-2xl md:rounded-3xl font-black text-slate-950 uppercase tracking-[0.2em] text-xs md:text-base hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 disabled:bg-slate-800 disabled:text-slate-600 flex items-center justify-center gap-2 md:gap-4 mt-4"
          >
             <span>Launch Automated Desk</span>
             <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};