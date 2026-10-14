import facts from '../../../content/batch-eight-facts.json'

export const challengeIds = ['purchase', 'refueling', 'operating'] as const
export type ChallengeId = typeof challengeIds[number]
export const challengeImage = (id: ChallengeId) => `${import.meta.env.BASE_URL}assets/images/${facts.images[id].path}`
