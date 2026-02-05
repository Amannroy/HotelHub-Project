"use client";

import HomePage from '@/component/home/Home';
import SnapBooking from "@/component/snapbooking/SnapBooking";
import Team from '@/component/team/Team'

export default function Home() {
  return (
    <div>
       <HomePage />
       <SnapBooking/>
       <Team/>
    </div>
  );
}
