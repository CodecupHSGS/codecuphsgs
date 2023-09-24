import { redirect } from 'next/navigation';
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {
  redirect("./dashboard"); 
}
