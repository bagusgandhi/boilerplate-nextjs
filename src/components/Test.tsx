"use client"
import { useSWRFetcher } from '@/utils/hooks/useSwrFetcher';
import React from 'react'

export default function Test() {
  const {
    data: profileData,
    error,
    isLoading,
    mutate,
  } = useSWRFetcher<any>({
    key: [`api/profile`],
  });

  console.log(profileData)
  return (
    <div>Test</div>
  )
}
