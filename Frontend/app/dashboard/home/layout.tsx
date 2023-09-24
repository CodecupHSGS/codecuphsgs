"use client";

import SubsectionBodyContainer from "../utils/subsectionBodyContainer";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {  
  return (
      <SubsectionBodyContainer>{children}</SubsectionBodyContainer>
  )
}
