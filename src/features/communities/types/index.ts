import { z } from 'zod';

export const INVITE_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const INVITE_CODE_LENGTH = 6;

export const CommunityRoleSchema = z.enum(['admin', 'member']);

export const CommunitySchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(3).max(50),
  description: z.string().max(140).optional(),
  invite_code: z.string().length(INVITE_CODE_LENGTH),
  created_by: z.string().min(1),
  created_at: z.string(),
});

export const CommunityMemberSchema = z.object({
  community_id: z.string().min(1),
  user_id: z.string().min(1),
  role: CommunityRoleSchema,
  joined_at: z.string(),
});

export const CreateCommunityPayloadSchema = z.object({
  name: z.string().trim().min(3, 'Nome precisa ter ao menos 3 caracteres').max(50, 'Nome pode ter no máximo 50 caracteres'),
  description: z.string().trim().max(140).optional(),
  created_by: z.string().min(1),
});

export const JoinCommunityPayloadSchema = z.object({
  invite_code: z.string().length(INVITE_CODE_LENGTH, 'O código tem 6 caracteres'),
  user_id: z.string().min(1),
});

export type CommunityRole = z.infer<typeof CommunityRoleSchema>;
export type Community = z.infer<typeof CommunitySchema>;
export type CommunityMember = z.infer<typeof CommunityMemberSchema>;
export type CreateCommunityPayload = z.infer<typeof CreateCommunityPayloadSchema>;
export type JoinCommunityPayload = z.infer<typeof JoinCommunityPayloadSchema>;
