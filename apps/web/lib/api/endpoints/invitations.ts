import { apiClient } from '../client'
import type { ApiResponse } from '@/types/api'

export interface CreateInvitationData {
  email: string
  role?: 'member' | 'owner'
}

export interface AcceptInvitationData {
  token: string
}

export interface Invitation {
  id: string
  email: string
  role: string
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED'
  invitedBy: string
  expiresAt: string
  createdAt: string
}

export interface InvitationResult {
  id: string
  email: string
  role: string
  status: string
  expiresAt: string
  createdAt: string
  acceptUrl?: string
}

export interface AcceptInvitationResult {
  orgId: string
  orgName: string
  message: string
}

/**
 * Create a new invitation
 */
export async function createInvitation(
  orgName: string,
  data: CreateInvitationData
): Promise<InvitationResult> {
  const response = await apiClient.post<ApiResponse<InvitationResult>>(
    `/invitations/${orgName}`,
    data
  )
  return response.data
}

/**
 * Accept an invitation
 */
export async function acceptInvitation(
  data: AcceptInvitationData
): Promise<AcceptInvitationResult> {
  const response = await apiClient.post<ApiResponse<AcceptInvitationResult>>(
    '/invitations/accept',
    data
  )
  return response.data
}

/**
 * List pending invitations for an organization
 */
export async function listOrgInvitations(orgName: string): Promise<Invitation[]> {
  const response = await apiClient.get<ApiResponse<Invitation[]>>(
    `/invitations/${orgName}`
  )
  return response.data
}

/**
 * Cancel an invitation
 */
export async function cancelInvitation(invitationId: string): Promise<{ message: string }> {
  const response = await apiClient.delete<ApiResponse<{ message: string }>>(
    `/invitations/${invitationId}`
  )
  return response.data
}
